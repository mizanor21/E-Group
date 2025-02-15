"use client";
import Link from "next/link";
import React from "react";
import bg from "@/public/assets/technology_bg.jpg";

const Login = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: `url(${bg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Glassy Form Container */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-lg shadow-xl px-8 py-16 w-full max-w-md">
        {/* Header */}
        <h2 className="text-center text-3xl font-bold text-white mb-6">
          SIGN IN
        </h2>

        {/* /* Form */}
        <form>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-2 w-full px-4 py-3 bg-transparent backdrop-blur-lg border border-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D9BC65] text-white transition-all"
              placeholder="Registered Email Address"
            />
          </div>
          <div className="mb-8">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-2 w-full px-4 py-3 bg-transparent backdrop-blur-lg border border-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D9BC65] text-white transition-all"
              placeholder="••••••••"
            />
          </div>
          <Link
            href="/dashboard"
            className="w-full inline-block text-center font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300 focus:ring-2 focus:ring-offset-2 hover:bg-[#D9BC65] hover:text-black"
            style={{
              background:
                "linear-gradient(90deg, #D9BC65 10%, #E0C264 30%, #B6953A 70%, #DFBA60 100%)",
              color: "#000",
            }}
          >
            Login
          </Link>
        </form>

        {/* /* Footer */}
        <p className="text-sm text-gray-400 mt-6 text-center">
          Don’t have an account?{" "}
          <Link href="#" className="text-[#D9BC65] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
