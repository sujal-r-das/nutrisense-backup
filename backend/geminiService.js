import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

// FINAL MODEL CHOICE: gemini-2.0-flash-lite (Cost-Effective and Correct Model ID)
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent";
const API_KEY = process.env.GEMINI_API_KEY;

async function callGeminiAI(prompt) {
  try {
    // FIX: Pass API key as query parameter and use correct body
    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 500,
        },
      }),
    });

    const data = await response.json();
    console.log("Gemini Raw Response:", data);
    
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      if (candidate.finishReason === 'SAFETY') {
          return "Output filtered: The AI response was blocked due to safety settings. Please adjust your input.";
      }
      return candidate.content?.parts?.[0]?.text || "No text content found in valid response. (Try simplifying your prompt)";
    }

    return data.error?.message || "No output from AI (received empty response).";

  } catch (err) {
      console.error("Gemini AI Error:", err);
      return "Error generating AI response.";
  }
}

// ---------------- AI Functions ----------------
export async function generateDietPlan(userData) {
  const prompt = `
Create a personalized diet plan for:
Age: ${userData.age}
Gender: ${userData.gender}
Weight: ${userData.weight} kg
Height: ${userData.height} cm
Activity: ${userData.activityLevel}
Goal: ${userData.goal}
Allergies: ${userData.allergies || "None"}
Preferences: ${userData.preferences || "None"}

Provide a daily meal plan with breakfast, lunch, dinner, and snacks.
`;
  return await callGeminiAI(prompt);
}

export async function proteinifyMeal(meal) {
  const prompt = `
Transform this meal into a protein-rich recipe:
Meal: ${meal}

Provide a detailed recipe with ingredients and instructions.
`;
  return await callGeminiAI(prompt);
}

export async function analyzeCalories(mealLog) {
  const mealList = mealLog.map(m => `${m.mealName} (${m.quantity})`).join("\n- ");
  const prompt = `
For the following list of logged meals, perform a nutritional analysis:
1. Calculate the estimated total calories for all meals combined.
2. Provide a breakdown of the estimated calories for each individual meal.
3. Offer health suggestions based on the total calorie count and meal types.

Meals Logged:
- ${mealList}
`;
  return await callGeminiAI(prompt);
}

export async function generateRecipe(recipeName) {
  const prompt = `
Generate a detailed recipe for the following dish:
${recipeName}

Include ingredients, step-by-step instructions, and tips.
`;
  return await callGeminiAI(prompt);
}