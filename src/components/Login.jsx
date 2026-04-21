import React, { useState } from "react";

export default function Login({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? "register" : "login";
    setMessage("");

    const payload = { userId, password };
    if (isRegistering) {
      payload.name = name;
    }

    try {
      // FIX: Reverted to relative path for deployment/single-server mode
      const res = await fetch(`/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setMessage(data.message || data.error);

      if (res.ok && !isRegistering) {
        onLoginSuccess(data.name, data.userId);
      }
      
    } catch (err) {
      setMessage("Failed to connect to the server.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">
        {isRegistering ? "Register" : "Login"}
      </h2>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {isRegistering && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input w-full"
            required
          />
        )}
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="input w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input w-full"
          required
        />
        <button type="submit" className="btn-primary w-full">
          {isRegistering ? "Register" : "Login"}
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-center">{message}</p>}
      <button
        onClick={() => setIsRegistering(!isRegistering)}
        className="mt-4 text-green-600 dark:text-green-400 hover:underline"
      >
        {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
      </button>
    </div>
  );
}