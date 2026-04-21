// src/components/footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-green-600 dark:bg-green-800 text-white p-4 text-center mt-6">
      &copy; {new Date().getFullYear()} NutriSense AI. All Rights Reserved.
    </footer>
  );
}