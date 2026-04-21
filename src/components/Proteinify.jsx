import { useState } from "react";
import { proteinifyMeal } from "../geminiService";

// Local Backend URL
const BACKEND_URL = "http://localhost:5000"; 

export default function Proteinify({ userId }) {
  const [meal, setMeal] = useState("");
  const [protein, setProtein] = useState("chicken");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  const saveHistory = async (type, data) => {
    if (!userId) return;
    await fetch(`${BACKEND_URL}/api/history`, { // <-- FIXED
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, type, data }),
    });
};

  const handleGenerate = async () => {
    setLoading(true);
    const res = await proteinifyMeal(meal);
    setRecipe(res);
    setLoading(false);
    if (res) {
      saveHistory(`Proteinify (${meal})`, res);
    }
  };

  return (
    <section className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-green-600">🍗 Proteinify My Meal</h2>

      {/* Input Fields */}
      <input type="text" placeholder="Enter your meal" value={meal} onChange={(e) => setMeal(e.target.value)} className="w-full p-2 border rounded-lg mb-2" />
      <select value={protein} onChange={(e) => setProtein(e.target.value)} className="w-full p-2 border rounded-lg mb-2">
        <option>chicken</option>
        <option>fish</option>
        <option>tofu</option>
        <option>beans</option>
        <option>egg</option>
      </select>

      {/* Button */}
      <button onClick={handleGenerate} className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
        {loading ? "Creating..." : "Proteinify"}
      </button>

      {/* Output Section */}
      {recipe && (
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl max-h-64 overflow-y-auto">
          <h3 className="font-semibold mb-2 text-green-500">Your Protein-Rich Recipe:</h3>
          <pre className="whitespace-pre-wrap">{recipe}</pre>
        </div>
      )}
    </section>
  );
}