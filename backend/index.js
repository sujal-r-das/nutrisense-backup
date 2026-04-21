import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import path from 'path'; 
import fs from 'fs'; 
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai'; 

// --- ES Module Path Setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- End Path Setup ---

// FIX: Explicitly load the .env file from the current directory (backend/)
dotenv.config({ path: path.resolve(__dirname, '.env') }); 

const app = express();

// ---------------- CHECK FOR CRITICAL ENVIRONMENT VARIABLES ----------------
const MONGODB_URI = process.env.MONGODB_URI;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!MONGODB_URI) {
    console.error("❌ CRITICAL ERROR: MONGODB_URI is missing. Check your backend/.env file.");
    process.exit(1);
}

// Global AI Constants
if (!GEMINI_API_KEY) {
    console.error("❌ CRITICAL WARNING: GEMINI_API_KEY is missing. AI features will fail on request.");
}
const ai = new GoogleGenerativeAI(GEMINI_API_KEY); 
const model = "gemini-2.0-flash-lite";

// Middleware
app.use(cors());
app.use(express.json());

// ---------------- MongoDB Connection ----------------
mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB!"))
  .catch(err => console.error("Could not connect to MongoDB...", err));

// ---------------- Schemas ----------------
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

const historySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  data: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const History = mongoose.model("History", historySchema);

// ---------------- Email Transporter Setup ----------------
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    }
});

// Helper function to call the AI
const getAiResponse = async (prompt) => {
  try {
    if (!GEMINI_API_KEY) {
        throw new Error("AI features disabled: GEMINI_API_KEY is missing.");
    }
    // FIX: Call the global 'ai' constant
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // This message is critical for debugging the key failure
    return `Error generating content from AI: ${error.message}.`;
  }
};


// ---------------- AI Service Endpoints ----------------
app.post("/api/dietplan", async (req, res) => {
  const userData = req.body;
  try {
    const result = await getAiResponse(
        `Generate a 7-day personalized diet plan based on the following: Age: ${userData.age}, Gender: ${userData.gender}, Weight: ${userData.weight}kg, Height: ${userData.height}cm, Activity: ${userData.activity}, Goal: ${userData.goal}, Preference: ${userData.dietPreference}, Allergies: ${userData.allergies}, Medical Conditions: ${userData.medicalConditions}, Cuisine: ${userData.cuisine}, Budget: ${userData.budget}. Provide a detailed, easy-to-read plan.`
    );
    res.json({ output: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/proteinify", async (req, res) => {
  const { meal } = req.body;
  try {
    const result = await getAiResponse(
        `Take this meal: "${meal}" and rewrite the recipe/instructions to significantly increase the protein content, ideally suggesting natural, healthy sources like chicken, fish, tofu, or beans. Give a new protein-rich recipe.`
    );
    res.json({ output: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/calories", async (req, res) => {
  const { mealLog } = req.body;
  const mealString = mealLog.map(m => `${m.mealName} (${m.quantity})`).join(', ');
  try {
    const result = await getAiResponse(
        `Analyze the following logged meals for a day: ${mealString}. Provide a total estimated calorie count, a calorie breakdown per meal, and brief suggestions for healthier options. Format the output clearly.`
    );
    res.json({ output: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/recipe", async (req, res) => {
  const { recipeName } = req.body;
  try {
    const result = await getAiResponse(
        `Generate a detailed recipe with steps, ingredients, and approximate cooking time for a dish named: ${recipeName}.`
    );
    res.json({ output: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ---------------- Auth Endpoints ----------------
app.post("/api/register", async (req, res) => {
  const { name, userId, password } = req.body;
  if (!name || !userId || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const userExists = await User.findOne({ userId });
    if (userExists) {
      return res.status(409).json({ error: "User ID already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, userId, password: hashedPassword });
    await newUser.save(); 

    res.status(201).json({ message: "Registration successful!" });
  } catch (err) {
    res.status(500).json({ error: "Server error during registration." });
  }
});

app.post("/api/login", async (req, res) => {
  const { userId, password } = req.body;
  if (!userId || !password) {
    return res.status(400).json({ error: "User ID and password are required." });
  }

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    res.json({ message: "Login successful!", name: user.name, userId: user.userId });
  } catch (err) {
    res.status(500).json({ error: "Server error during login." });
  }
});

// ---------------- History Endpoints ----------------
app.post("/api/history", async (req, res) => {
  const { userId, type, data } = req.body;
  if (!userId || !type || !data) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newHistory = new History({ userId, type, data });
    await newHistory.save();
    res.status(201).json({ message: "History saved successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/history/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const userHistory = await History.find({ userId }).sort({ createdAt: -1 });
    res.json(userHistory);
      } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/history/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await History.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ error: "History item not found." });
    }
    res.json({ message: "History item deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- Direct Email Endpoint ----------------
app.post("/api/send-email", async (req, res) => {
    const { fromEmail, subject, message } = req.body;
    
    if (!fromEmail || !subject || !message) {
        return res.status(400).json({ message: "All fields are required to send an email." });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER, 
        to: process.env.SUPPORT_EMAIL, 
        subject: `[SUPPORT] ${subject} from ${fromEmail}`,
        html: `
            <p><strong>From:</strong> ${fromEmail}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully! We will get back to you soon." });
    } catch (error) {
        console.error("Nodemailer Error:", error);
        res.status(500).json({ message: "Failed to send email. Please try again later." });
    }
});

// ------------------------------------
// DEPLOYMENT CONFIGURATION
// ------------------------------------

// 1. Define the path to the React build output.
const buildPath = path.resolve(__dirname, '..', 'src', 'build');

// Check if the React build exists.
if (fs.existsSync(buildPath)) {
  console.log('Serving static React assets...');
  
  // 2. Serve static files (CSS, JS, images, etc.)
  app.use(express.static(buildPath));

  // 3. Catch-all: For any request not matching an API route, serve the React index.html.
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(buildPath, 'index.html'));
  });
} else {
  console.log("React build folder not found. Running in API-only mode.");
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));