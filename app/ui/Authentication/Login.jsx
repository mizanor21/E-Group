"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (email === "egroup2004@gmail.com" && password === "215969") {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
      <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-10 w-full max-w-md text-white">
        <h2 className="text-center text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
          Welcome Back
        </h2>
        <p className="text-center text-sm text-gray-300 mb-6">
          Sign in to continue to your dashboard
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <FaUser className="absolute left-3 top-4 text-gray-400" />
            <input
              type="email"
              className="w-full pl-10 pr-4 py-3 bg-transparent border border-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Registered Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6 relative">
            <FaLock className="absolute left-3 top-4 text-gray-400" />
            <input
              type="password"
              className="w-full pl-10 pr-4 py-3 bg-transparent border border-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="mb-4 text-red-400 text-center">{error}</div>}
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:scale-105 transition-transform"
          >
            Login
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default Login;
