import { useState } from "react";
import { analyzeCalories } from "../geminiService";

// Local Backend URL
const BACKEND_URL = "http://localhost:5000"; 

export default function CalorieTracker({ userId }) {
  const [meals, setMeals] = useState([]);
  const [mealName, setMealName] = useState("");
  const [quantity, setQuantity] = useState(""); 
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const addMeal = () => {
    if (!mealName || !quantity) return;
    setMeals([...meals, { mealName, quantity: quantity }]); 
    setMealName("");
    setQuantity("");
  };

  const saveHistory = async (type, data) => {
    if (!userId) return;
    await fetch(`${BACKEND_URL}/api/history`, { // <-- FIXED
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, type, data }),
    });

};

  const analyze = async () => {
    setLoading(true);
    const res = await analyzeCalories(meals);
    setAnalysis(res);
    setLoading(false);
    if (res) {
      saveHistory("Calorie Analysis", res);
    }
  };

  const totalItems = meals.length;

  return (
    <section className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-green-600">🔥 Calorie Tracker</h2>

      {/* Input Fields */}
      <div className="grid grid-cols-2 gap-2">
        <input type="text" placeholder="Meal Name" value={mealName} onChange={(e) => setMealName(e.target.value)} className="p-2 border rounded-lg" />
        <input type="text" placeholder="Quantity (e.g., 150g or 1 cup)" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="p-2 border rounded-lg" />
      </div>
      <button onClick={addMeal} className="mt-2 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
        Add Meal
      </button>

      {/* Meal List */}
      <ul className="mt-4 space-y-1">
        {meals.map((m, idx) => (
          <li key={idx} className="flex justify-between">
            <span>{m.mealName}</span>
            <span className="font-semibold">{m.quantity}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 font-semibold text-green-500">Total Items Logged: {totalItems}</p>

      {/* Button */}
      <button onClick={analyze} className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
        {loading ? "Analyzing..." : "Analyze with AI"}
      </button>

      {/* Output Section */}
      {analysis && (
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl max-h-64 overflow-y-auto">
          <h3 className="font-semibold mb-2 text-green-500">AI Analysis & Calorie Breakdown:</h3>
          <pre className="whitespace-pre-wrap">{analysis}</pre>
        </div>
      )}
    </section>
  );
}