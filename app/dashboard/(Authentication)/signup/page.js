'use client'
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase.config';
import { useRouter } from 'next/navigation';

// Zod schema for form validation
const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" })
});

export default function SignInPage() {
  const router = useRouter();
  const [firebaseError, setFirebaseError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(signInSchema)
  });

  const [
    signInWithEmailAndPassword,
    user,
    loading,
    error
  ] = useSignInWithEmailAndPassword(auth);

  // Check for stored lockout information on component mount
  useEffect(() => {
    const storedLockoutEnd = localStorage.getItem('loginLockoutEnd');
    const storedAttempts = localStorage.getItem('loginAttempts');

    if (storedLockoutEnd && parseInt(storedLockoutEnd) > Date.now()) {
      const remainingTime = Math.ceil((parseInt(storedLockoutEnd) - Date.now()) / 1000 / 60);
      setLockoutTime(remainingTime);
      setLoginAttempts(parseInt(storedAttempts || '0'));
    } else {
      // Clear lockout if time has passed
      localStorage.removeItem('loginLockoutEnd');
      localStorage.removeItem('loginAttempts');
    }
  }, []);

  const onSubmit = async (data) => {
    // Check if user is currently locked out
    if (lockoutTime > 0) {
      setFirebaseError(`Too many login attempts. Please try again in ${lockoutTime} minutes.`);
      return;
    }

    try {
      const res = await signInWithEmailAndPassword(data.email, data.password);
      
      if (res) {
        // Reset login attempts on successful login
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('loginLockoutEnd');
        
        // Navigate to dashboard
        router.push('/dashboard');
        return;
      }
    } catch (err) {
      // Increment login attempts
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('loginAttempts', newAttempts.toString());

      // Check if attempts exceed threshold
      if (newAttempts >= 3) {
        const lockoutEnd = Date.now() + (10 * 60 * 1000); // 10 minutes
        localStorage.setItem('loginLockoutEnd', lockoutEnd.toString());
        setLockoutTime(10);
        setFirebaseError('Too many failed attempts. Please try again in 10 minutes.');
        return;
      }

      setFirebaseError(err.message || 'Login failed');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-2xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  // User signed in successfully
  if (user) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Sign In
          </h2>
          
          {/* Login attempts and lockout warning */}
          {lockoutTime > 0 && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
              <p>Too many failed attempts. Please try again in {lockoutTime} minutes.</p>
            </div>
          )}

          {/* Firebase or form-level error display */}
          {(error || firebaseError) && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <p>{error?.message || firebaseError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                disabled={lockoutTime > 0}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                disabled={lockoutTime > 0}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || lockoutTime > 0}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {lockoutTime > 0 ? `Locked (${lockoutTime}m)` : 
                 isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account? 
              <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500 ml-1">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}