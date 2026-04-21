// src/components/history.jsx
import React, { useState, useEffect, useCallback } from "react";

// The path is now relative since the server hosts the frontend
const BACKEND_URL = ""; 

export default function History({ userId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      // FIX: Reverted to relative path
      const res = await fetch(`${BACKEND_URL}/api/history/${userId}`);
      const data = await res.json();
      setHistory(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching history:", error);
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleDelete = async (id) => {
    try {
      // FIX: Reverted to relative path
      const res = await fetch(`${BACKEND_URL}/api/history/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setHistory(history.filter(item => item._id !== id));
      } else {
        console.error("Failed to delete history item.");
      }
    } catch (error) {
      console.error("Error deleting history item:", error);
    }
  };

  const togglePin = (id) => {
    const itemIndex = history.findIndex(item => item._id === id);
    if (itemIndex > -1) {
      const newHistory = [...history];
      newHistory[itemIndex].pinned = !newHistory[itemIndex].pinned;
      setHistory(newHistory);
    }
  };

  if (loading) {
    return <div className="text-center">Loading history...</div>;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">History</h2>
      <ul className="space-y-2">
        {history.length > 0 ? (
          history.map((item) => (
            <li
              key={item._id}
              className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"
            >
              <div className="flex-grow">
                <strong>{item.type}:</strong> {item.data}
              </div>
              <div className="flex space-x-2">
                <button
                  className={`px-4 py-2 rounded-lg ${
                    item.pinned ? "bg-yellow-400" : "bg-gray-300 dark:bg-gray-500"
                  }`}
                  onClick={() => togglePin(item._id)}
                >
                  {item.pinned ? "Pinned" : "Pin"}
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No history found.</p>
        )}
      </ul>
    </section>
  );
}