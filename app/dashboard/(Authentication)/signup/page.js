'use client'
import React, { useState, useEffect } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase.config'; // Ensure this path is correct
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

// Validation Schema
const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, 
      "Password must include letters, numbers, and special characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export default function ConservatorySignUpPage() {
  const router = useRouter();
  const [dynamicCode, setDynamicCode] = useState('8AD4F');
  const [error, setError] = useState('');
  
  // Firebase Hook for User Creation
  const [
    createUserWithEmailAndPassword,
    user,
    loading,
    firebaseError
  ] = useCreateUserWithEmailAndPassword(auth);

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
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Signup Submit Handler
  const onSubmit = async (data) => {
    // Reset previous errors
    setError('');

    try {
      // Create user with email and password
      const res = await createUserWithEmailAndPassword(data.email, data.password);
      
      if (res) {
        // Optional: You might want to update the user profile with full name
        // await updateProfile(auth.currentUser, { displayName: data.fullName });
        
        // Redirect to dashboard or profile setup
        router.push('/dashboard');
      }
    } catch (err) {
      // Handle specific Firebase authentication errors
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('Email is already registered');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/operation-not-allowed':
          setError('Sign up is currently disabled');
          break;
        default:
          setError('Sign up failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-700 relative overflow-hidden">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden relative z-10">
        {/* Signup Form Section */}
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
            <h2 className="text-2xl font-bold text-gray-800">E-Group Sign Up</h2>
          </div>

          {/* Error Message */}
          {(error || firebaseError) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-600 rounded">
              {error || firebaseError?.message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name Input */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Full Name" 
                {...register('fullName')}
                className="w-full px-4 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-cyan-500 transition-colors duration-300"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

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

            {/* Confirm Password Input */}
            <div className="relative">
              <input 
                type="password" 
                placeholder="Confirm Password" 
                {...register('confirmPassword')}
                className="w-full px-4 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-cyan-500 transition-colors duration-300"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Sign Up Button */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full hover:opacity-90 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </motion.button>

            {/* Login Link */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account? {' '}
                <Link 
                  href="/" 
                  className="text-cyan-600 hover:underline"
                >
                  Login
                </Link>
              </p>
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