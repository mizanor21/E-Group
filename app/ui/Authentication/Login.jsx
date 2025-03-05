'use client'
import React, { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { auth } from '@/firebase.config'; // Ensure this path is correct
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Validation Schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  verificationCode: z.string().length(5, "Verification code must be 5 characters")
});

export default function ConservatoryLoginPage() {
  const router = useRouter();
  const [dynamicCode, setDynamicCode] = useState('8AD4F');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Generate dynamic verification code
  const generateVerificationCode = () => {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
  };

  // Regenerate code periodically
  useEffect(() => {
    const newCode = generateVerificationCode();
    setDynamicCode(newCode);

    const codeInterval = setInterval(() => {
      const refreshedCode = generateVerificationCode();
      setDynamicCode(refreshedCode);
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(codeInterval);
  }, []);

  // Form management with React Hook Form
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      verificationCode: ''
    }
  });

  // Handle Password Reset
  const handlePasswordReset = async () => {
    const email = prompt('Please enter your email:');
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        alert('Password reset email sent!');
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  // Login Submit Handler
  const onSubmit = async (data) => {
    // Verify dynamic code first
    if (data.verificationCode.toUpperCase() !== dynamicCode) {
      setError('Incorrect verification code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );

      // Successful login
      router.push('/dashboard');
    } catch (error) {
      // Handle specific Firebase authentication errors
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No user found with this email');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        case 'auth/too-many-requests':
          setError('Too many login attempts. Please try again later.');
          break;
        default:
          setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-700 relative overflow-hidden">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden relative z-10">
        {/* Login Form Section */}
        <div className="p-12 flex flex-col justify-center bg-white/90">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mr-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                className="w-6 h-6 text-white"
              >
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">E-Group</h2>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-600 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email Address" 
                {...register('email')}
                className="w-full px-4 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-cyan-500 transition-colors duration-300"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <input 
                type="password" 
                placeholder="Password" 
                {...register('password')}
                className="w-full px-4 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-cyan-500 transition-colors duration-300"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Verification Code */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Verification Code" 
                {...register('verificationCode')}
                className="w-full px-4 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-cyan-500 transition-colors duration-300"
              />
              <span className="absolute right-0 top-4 text-cyan-600 font-bold">
                {dynamicCode}
              </span>
              {errors.verificationCode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.verificationCode.message}
                </p>
              )}
            </div>

            {/* Login Button */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit" 
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full hover:opacity-90 transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Logging In...' : 'Login'}
            </motion.button>

            {/* Forgot Password */}
            <div className="text-center mt-4">
              <button 
                type="button"
                onClick={handlePasswordReset}
                className="text-cyan-600 hover:underline text-sm"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </div>

        {/* Isometric Illustration Section */}
        <div className="hidden md:block relative bg-gradient-to-br from-cyan-50 to-blue-100 p-8">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 600 400" 
            className="absolute inset-0 w-full h-full"
          >
            {/* Isometric Buildings */}
            <g transform="translate(50, 50)">
              {/* Large Blue Cubes */}
              <g fill="#3B82F6" fillOpacity="0.2">
                <path d="M0 250 L200 150 L400 250 L200 350 Z" />
                <path d="M200 150 L400 50 L600 150 L400 250 Z" />
                <path d="M0 250 L200 350 L400 250 L200 150 Z" />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}