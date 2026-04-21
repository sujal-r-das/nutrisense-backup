import React from "react";

export default function Navbar({ darkMode, setDarkMode, logo, userName, onLogout }) {
  return (
    <nav className="bg-green-600 dark:bg-green-800 text-white p-4 flex justify-between items-center flex-wrap">
      <div className="flex items-center space-x-2 cursor-pointer">
        <img src={logo} alt="NutriSense AI Logo" className="w-10 h-10" />
        <h1 className="text-2xl font-bold">NutriSense AI</h1>
      </div>

      <div className="flex items-center space-x-4">
        {userName && <span className="text-lg font-medium">Hello, {userName}</span>}
        {userName && (
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded bg-red-600 dark:bg-red-800 hover:bg-red-700 dark:hover:bg-red-600 transition-all text-white"
          >
            Logout
          </button>
        )}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded bg-green-800 dark:bg-green-600 hover:bg-green-700 dark:hover:bg-green-500 transition-all"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </nav>
  );
}