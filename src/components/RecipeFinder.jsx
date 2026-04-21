// src/components/RecipeFinder.jsx
import React, { useState } from "react";
import { generateRecipe } from "../geminiService";

// Local Backend URL
const BACKEND_URL = "http://localhost:5000"; 

export default function RecipeFinder({ userId }) {
  const [recipeName, setRecipeName] = useState("");
  const [output, setOutput] = useState("");

  const saveHistory = async (type, data) => {
    if (!userId) return;
    await fetch(`${BACKEND_URL}/api/history`, { // <-- FIXED
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, type, data }),
    });
};

  const handleGenerate = async () => {
    if (!recipeName) return;
    try {
      const res = await generateRecipe(recipeName);
      setOutput(res);
      if (res) {
        saveHistory(`Recipe: ${recipeName}`, res);
      }
    } catch (err) {
      setOutput("Error generating recipe. Please try again.");
    }
  };

  return (
    <section className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-green-600 dark:text-green-400">Recipe Finder</h2>
      <input
        type="text"
        placeholder="Enter recipe name"
        value={recipeName}
        onChange={(e) => setRecipeName(e.target.value)}
        className="border p-2 rounded w-full mb-2 dark:bg-gray-700 dark:text-white"
      />
      <button
        onClick={handleGenerate}
        className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded hover:bg-green-700 dark:hover:bg-green-600 transition-all"
      >
        Generate Recipe
      </button>
      {output && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-100 whitespace-pre-wrap">
          {output}
        </div>
      )}
    </section>
  );
}