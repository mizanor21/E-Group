"use client";
import Link from "next/link";
import React from "react";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="bg-gray-900/80 rounded-lg shadow-lg p-8 w-full max-w-sm relative border border-gray-700">
        {/* Neon Glow */}
        <div className="absolute rounded-lg border-2 border-[#00ffcc] blur-md"></div>

        {/* Content */}
        <h2 className="text-center text-2xl font-extrabold text-[#00ffcc] mb-6">
          E Group
        </h2>
        <form>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ffcc] text-white"
              placeholder="example@gamer.com"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ffcc] text-white"
              placeholder="••••••••"
            />
          </div>
          <Link
            href={"/dashboard"}
            className="w-full btn bg-[#00ffcc] text-gray-900 font-semibold py-2 rounded-lg hover:bg-[#00e6b3] transition-all duration-200 focus:ring-2 focus:ring-[#00ffcc] focus:ring-offset-2"
          >
            Login
          </Link>
        </form>
        <p className="text-sm text-gray-400 mt-4 text-center">
          Don’t have an account?{" "}
          <Link href="/register" className="text-[#00ffcc] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
