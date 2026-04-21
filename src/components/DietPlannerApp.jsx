import React, { useState } from "react";
import { generateDietPlan } from "../geminiService";

// Local Backend URL
const BACKEND_URL = "http://localhost:5000"; 

export default function DietPlannerApp({ userId }) {
  const [form, setForm] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    activity: "",
    goal: "",
    dietPreference: "",
    allergies: "",
    medicalConditions: "",
    cuisine: "",
    budget: "",
  });

  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveHistory = async (type, data) => {
    if (!userId) return;
    await fetch(`${BACKEND_URL}/api/history`, { // <-- FIXED
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, type, data }),
    });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await generateDietPlan(form);
    setPlan(result);
    setLoading(false);
    if (result) {
      saveHistory("Diet Plan", result);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <h2 className="text-3xl font-bold mb-6 text-green-700 dark:text-green-300 text-center">
        Personalized Diet Planner
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6"
      >
        <input type="number" name="age" placeholder="Age" onChange={handleChange} className="input" />
        <select name="gender" onChange={handleChange} className="input">
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input type="number" name="weight" placeholder="Weight (kg)" onChange={handleChange} className="input" />
        <input type="number" name="height" placeholder="Height (cm)" onChange={handleChange} className="input" />
        <select name="activity" onChange={handleChange} className="input">
          <option value="">Activity Level</option>
          <option value="Sedentary">Sedentary</option>
          <option value="Lightly Active">Lightly Active</option>
          <option value="Moderately Active">Moderately Active</option>
          <option value="Very Active">Very Active</option>
        </select>
        <select name="goal" onChange={handleChange} className="input">
          <option value="">Goal</option>
          <option value="Weight Loss">Weight Loss</option>
          <option value="Weight Gain">Weight Gain</option>
          <option value="Muscle Gain">Muscle Gain</option>
          <option value="Maintenance">Maintenance</option>
        </select>
        <input type="text" name="dietPreference" placeholder="Dietary Preference (veg, keto...)" onChange={handleChange} className="input" />
        <input type="text" name="allergies" placeholder="Allergies" onChange={handleChange} className="input" />
        <input type="text" name="medicalConditions" placeholder="Medical Conditions" onChange={handleChange} className="input" />
        <input type="text" name="cuisine" placeholder="Preferred Cuisine (Indian, Italian...)" onChange={handleChange} className="input" />
        <input type="text" name="budget" placeholder="Budget per day (₹/$)" onChange={handleChange} className="input" />

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl font-semibold transition"
        >
          {loading ? "Generating..." : "Generate Diet Plan"}
        </button>
      </form>

      {plan && (
        <div className="mt-6 p-6 bg-green-50 dark:bg-gray-900 rounded-2xl shadow-inner">
          <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-4">Your Personalized Diet Plan</h3>
          <p className="whitespace-pre-line text-gray-700 dark:text-gray-200">{plan}</p>
        </div>
      )}
    </div>
  );
}