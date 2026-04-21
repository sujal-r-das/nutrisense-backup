// src/components/about.jsx
import React from "react";

export default function About() {
  return (
    <section className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">About NutriSense AI</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-8">
        NutriSense AI is an innovative, full-stack health application created with a singular mission: to simplify nutrition tracking and personalized meal planning using the power of generative AI. Our team is dedicated to building intelligent tools that translate complex health goals into actionable daily plans.
      </p>
      
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Meet the Core Team</h3>
      
      <div className="space-y-6">
        
        {/* SUJAL DAS - Full Stack Developer (Prioritized & Detailed) */}
        <div className="p-3">
          <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">Sujal Das (384) — Full Stack Developer</h4>
          <p className="text-gray-700 dark:text-gray-400 text-sm mb-2">
            As the primary architect and Full Stack Developer, I was responsible for the entire end-to-end lifecycle of the NutriSense AI application. This comprehensive role began with the foundational design and architectural planning for both the client-side and server-side components.
          </p>
          <p className="text-gray-700 dark:text-gray-400 text-sm mb-2">
            My development work spanned the React frontend, creating all user-facing components, and the Node.js backend, where I built the REST APIs, integrated the MongoDB database for persistent user and history storage, and secured the full stack. This included troubleshooting all complex connection and logic errors.
          </p>
          <p className="text-gray-700 dark:text-gray-400 text-sm">
            Finally, I personally managed all operational aspects, including final testing, quality assurance, environment configuration, and handling the entire deployment process to ensure the NutriSense AI application could be accessed and used live.
          </p>
        </div>

        {/* SAAVI CHAWKE */}
        <div className="p-3">
          <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">Saavi Chawke (146) — UI/UX Designer</h4>
          <p className="text-gray-700 dark:text-gray-400 text-sm">
            Saavi focused on ensuring a seamless and attractive user interface. Her work involved optimizing the visual design, ensuring mobile responsiveness, and implementing modern UI elements to make the user experience intuitive and engaging.
          </p>
        </div>

        {/* SHUBHANKAR SARKAR */}
        <div className="p-3">
          <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">Shubhankar Sarkar (382) — Tester & Quality Analyst</h4>
          <p className="text-gray-700 dark:text-gray-400 text-sm">
            Shubhankar was instrumental in validating the core functionality of the application. This involved rigorously testing the AI outputs against prompt instructions and performing scenario-based tests to guarantee a reliable user experience.
          </p>
        </div>
        
        {/* AADARSH PILLAI */}
        <div className="p-3">
          <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">Aadarsh Pillai (147) — AI Researcher & Prompt Engineer</h4>
          <p className="text-gray-700 dark:text-gray-400 text-sm">
            Aadarsh specialized in optimizing the AI model's performance. His role was to craft precise prompts, manage the AI model integration, and conduct research to ensure the generated diet plans and recipes were accurate and context-aware.
          </p>
        </div>

        {/* TEJAL BAGADE */}
        <div className="p-3">
          <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">Tejal Bagade (331) — Quality Assurance Specialist</h4>
          <p className="text-gray-700 dark:text-gray-400 text-sm">
            Tejal was responsible for maintaining the overall stability and high standards of the application. Her QA work ensured that all features, especially the new login system and database connections, functioned flawlessly across different environments.
          </p>
        </div>

        {/* AKASH PATWEKAR */}
        <div className="p-3">
          <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">Akash Patwekar (155) — Build Engineer & Debugger</h4>
          <p className="text-gray-700 dark:text-gray-400 text-sm">
            Akash managed the build engineering process, specializing in environment configuration, dependency management, and deep-level debugging to resolve complex system and network errors during development.
          </p>
        </div>

        {/* TANUSHREE AMBHORE */}
        <div className="p-3">
          <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">Tanushree Ambhore (329) — Technical Writer & Documentation</h4>
          <p className="text-gray-700 dark:text-gray-400 text-sm">
            Tanushree focused on creating clear and comprehensive technical documentation and user guides, ensuring all aspects of the application's functionality and features are easily understood by both the development team and end-users.
          </p>
        </div>
      </div>
    </section>
  );
}