// src/geminiService.js

// Using an empty string ensures the API call goes to the root of the current site (the Express server).
const BACKEND_URL = ""; 

export async function generateDietPlan(userData) {
  const res = await fetch(`${BACKEND_URL}/api/dietplan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });
  const data = await res.json();
  return data.output;
}

export async function proteinifyMeal(meal) {
  const res = await fetch(`${BACKEND_URL}/api/proteinify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ meal })
  });
  const data = await res.json();
  return data.output;
}

export async function analyzeCalories(mealLog) {
  const res = await fetch(`${BACKEND_URL}/api/calories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mealLog })
  });
  const data = await res.json();
  return data.output;
}

export async function generateRecipe(recipeName) {
  const res = await fetch(`${BACKEND_URL}/api/recipe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipeName })
  });
  const data = await res.json();
  return data.output;
}