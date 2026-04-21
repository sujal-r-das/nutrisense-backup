// src/AppLayout.jsx
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";

import DietPlannerApp from "./components/DietPlannerApp";
import Proteinify from "./components/Proteinify";
import CalorieTracker from "./components/CalorieTracker";
import About from "./components/About";
import History from "./components/History";
import ContactUs from "./components/ContactUs";
import RecipeFinder from "./components/RecipeFinder";

import logo from "./assets/logo.png";

// Import icons from React Icons (Fa = Font Awesome)
import { FaAppleAlt, FaDrumstickBite, FaFire, FaUtensils, FaHistory, FaInfoCircle, FaEnvelope } from 'react-icons/fa';

export default function AppLayout() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userName, setUserName] = useState("");
	const [userId, setUserId] = useState("");
	const [activeSection, setActiveSection] = useState(null); 
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		const html = document.documentElement;
		if (darkMode) html.classList.add("dark");
		else html.classList.remove("dark");
	}, [darkMode]);

	const handleLoginSuccess = (name, id) => {
		setIsLoggedIn(true);
		setUserName(name);
		setUserId(id);
		console.log(`User ${name} logged in successfully!`);
	};

	const handleLogout = () => {
		setIsLoggedIn(false);
		setUserName("");
		setUserId("");
		setActiveSection(null);
	};

	const sections = [
		{
			key: "diet",
			label: "Diet Plan",
			description: "Generate a personalized diet plan based on your data.",
			component: <DietPlannerApp userId={userId} />,
			icon: <FaAppleAlt className="text-3xl text-green-600 dark:text-green-400" />,
		},
		{
			key: "proteinify",
			label: "Proteinify My Meal",
			description: "Transform your normal meals into protein-rich recipes.",
			component: <Proteinify userId={userId} />,
			icon: <FaDrumstickBite className="text-3xl text-red-600 dark:text-red-400" />,
		},
		{
			key: "calories",
			label: "Calorie Tracker",
			description: "Track daily meals and calories to stay healthy.",
			component: <CalorieTracker userId={userId} />,
			icon: <FaFire className="text-3xl text-orange-600 dark:text-orange-400" />,
		},
		{
			key: "recipe",
			label: "Recipe Finder",
			description: "Enter a dish name and get AI-generated recipe instructions.",
			component: <RecipeFinder userId={userId} />,
			icon: <FaUtensils className="text-3xl text-yellow-600 dark:text-yellow-400" />,
		},
		{
			key: "about",
			label: "About",
			description: "Learn more about NutriSense AI and its features.",
			component: <About />,
			icon: <FaInfoCircle className="text-3xl text-blue-600 dark:text-blue-400" />,
		},
		{
			key: "history",
			label: "History",
			description: "View your meal history, pinned favorites, and past plans.",
			component: <History userId={userId} />,
			icon: <FaHistory className="text-3xl text-purple-600 dark:text-purple-400" />,
		},
		{
			key: "contact",
			label: "Contact Us",
			description: "Send us your queries or reports via email or phone.",
			component: <ContactUs />,
			icon: <FaEnvelope className="text-3xl text-indigo-600 dark:text-indigo-400" />,
		},
	];

	const renderHome = () => (
		<div className="space-y-8 p-4 sm:p-6 lg:p-8">
			<div className="text-center space-y-2">
				<img src={logo} alt="NutriSense AI Logo" className="mx-auto w-24 h-24 sm:w-32 sm:h-32" />
				<h1 className="text-2xl sm:text-3xl font-bold dark:text-white">Welcome to NutriSense AI</h1>
				{/* CLEANED DESCRIPTION: No redundant welcome, no markdown characters */}
				<p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
					NutriSense AI is your intelligent partner for mastering nutrition and fitness goals. We use AI to instantly transform your health journey by crafting custom diet plans, analyzing logged meals for accurate calorie tracking, and 'proteinifying' your favorite recipes. Log in to personalize your path to a healthier, more efficient you. (Please consult a healthcare professional for medical advice.)
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
				{sections.map((sec) => (
					<div
						key={sec.key}
						className="bg-green-100 dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-300 animate-slide-in-right flex flex-col items-start space-y-2"
						onClick={() => setActiveSection(sec.key)}
					>
						<div className="flex items-center space-x-3">
							{sec.icon}
							<h2 className="text-xl font-bold dark:text-white">{sec.label}</h2>
						</div>
						<p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{sec.description}</p>
					</div>
				))}
			</div>
		</div>
	);

	const renderSection = () => {
		const sec = sections.find((s) => s.key === activeSection);
		return sec ? (
			<div className="animate-slide-in-right p-4">
				<button
					onClick={() => setActiveSection(null)}
					className="mb-4 px-3 py-1 text-sm sm:px-4 sm:py-2 bg-green-600 dark:bg-green-800 text-white rounded hover:bg-green-700 dark:hover:bg-green-600 transition-all"
				>
					← Back to Home
				</button>
				{sec.component}
			</div>
		) : (
			renderHome()
		);
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-poppins transition-colors duration-300 flex flex-col">
			{isLoggedIn ? (
				<>
					<Navbar darkMode={darkMode} setDarkMode={setDarkMode} logo={logo} userName={userName} onLogout={handleLogout} />
					<main className="flex-grow container mx-auto px-2 sm:px-4 py-4 sm:py-6">{renderSection()}</main>
					<Footer />
				</>
			) : (
				<main className="flex-grow container mx-auto px-2 sm:px-4 py-4 sm:py-6 flex items-center justify-center">
					<Login onLoginSuccess={handleLoginSuccess} />
				</main>
			)}
		</div>
	);
}