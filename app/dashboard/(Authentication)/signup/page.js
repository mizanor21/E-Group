'use client';
import React, { useState } from 'react';
import { useCreateUserWithEmailAndPassword, useUpdateProfile } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase.config'; // Ensure this path is correct
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import toast from 'react-hot-toast';

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

// Permission Checkbox Component
const PermissionCheckbox = ({ module, action, label, checked, onChange }) => (
  <div className="flex items-center mb-2">
    <input
      type="checkbox"
      id={`${module}-${action}`}
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
    />
    <label htmlFor={`${module}-${action}`} className="text-sm font-medium text-gray-700">
      {label || action.charAt(0).toUpperCase() + action.slice(1)}
    </label>
  </div>
);

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [permissions, setPermissions] = useState({
    employee: { create: true, view: true, edit: true, delete: true },
    payroll: { create: true, view: true, edit: true, delete: true },
    accounts: { create: true, view: true, edit: true, delete: true },
    settings: { create: true, view: true, edit: true, delete: true },
  });

  // Firebase Hook for User Creation
  const [
    createUserWithEmailAndPassword,
    user,
    loading,
    firebaseError
  ] = useCreateUserWithEmailAndPassword(auth);

  // Firebase Hook for Profile Update
  const [updateProfile, updating, updateError] = useUpdateProfile(auth);

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

  // Handle Permission Changes
  const handlePermissionChange = (module, action) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module][action],
      },
    }));
  };

  const onSubmit = async (data) => {
    // Reset previous errors
    setError('');
  
    try {
  
      // Prepare the data to match the schema
      const userData = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        permissions: permissions, // Include permissions from state
      };
  
      // Send a POST request to the /api/signup endpoint
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      // Handle the response
      const result = await response.json();
  
      if (response.ok) {
        // If the API call is successful, show a success message and redirect
        toast.success("Account created successfully!");
        router.push('/dashboard');
      } else {
        // If there's an error, display the error message
        setError(result.message || 'Sign up failed. Please try again.');
      }
    } catch (err) {
      // Handle any unexpected errors
      setError('An unexpected error occurred. Please try again.');
      console.error("Signup error:", err);
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
            <h2 className="text-2xl font-bold text-gray-800">Create New User</h2>
          </div>

          {/* Error Message */}
          {(error || firebaseError || updateError) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-600 rounded">
              {error || firebaseError?.message || updateError?.message}
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
              disabled={loading || updating}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full hover:opacity-90 transition-all duration-300 disabled:opacity-50"
            >
              {(loading || updating) ? 'Creating Account...' : 'Sign Up'}
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

        {/* Permission Section */}
        <div className="hidden md:block relative bg-gradient-to-br from-cyan-50 to-blue-100 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Module Permissions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employee Module */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-gray-700 mb-3 uppercase text-sm">Employee</h3>
              <PermissionCheckbox 
                module="employee" 
                action="create" 
                checked={permissions.employee.create} 
                onChange={() => handlePermissionChange('employee', 'create')} 
              />
              <PermissionCheckbox 
                module="employee" 
                action="view" 
                checked={permissions.employee.view} 
                onChange={() => handlePermissionChange('employee', 'view')} 
              />
              <PermissionCheckbox 
                module="employee" 
                action="edit" 
                checked={permissions.employee.edit} 
                onChange={() => handlePermissionChange('employee', 'edit')} 
              />
              <PermissionCheckbox 
                module="employee" 
                action="delete" 
                checked={permissions.employee.delete} 
                onChange={() => handlePermissionChange('employee', 'delete')} 
              />
            </div>

            {/* Payroll Module */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-gray-700 mb-3 uppercase text-sm">Payroll</h3>
              <PermissionCheckbox 
                module="payroll" 
                action="create" 
                checked={permissions.payroll.create} 
                onChange={() => handlePermissionChange('payroll', 'create')} 
              />
              <PermissionCheckbox 
                module="payroll" 
                action="view" 
                checked={permissions.payroll.view} 
                onChange={() => handlePermissionChange('payroll', 'view')} 
              />
              <PermissionCheckbox 
                module="payroll" 
                action="edit" 
                checked={permissions.payroll.edit} 
                onChange={() => handlePermissionChange('payroll', 'edit')} 
              />
              <PermissionCheckbox 
                module="payroll" 
                action="delete" 
                checked={permissions.payroll.delete} 
                onChange={() => handlePermissionChange('payroll', 'delete')} 
              />
            </div>

            {/* Accounts Module */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-gray-700 mb-3 uppercase text-sm">Accounts</h3>
              <PermissionCheckbox 
                module="accounts" 
                action="create" 
                checked={permissions.accounts.create} 
                onChange={() => handlePermissionChange('accounts', 'create')} 
              />
              <PermissionCheckbox 
                module="accounts" 
                action="view" 
                checked={permissions.accounts.view} 
                onChange={() => handlePermissionChange('accounts', 'view')} 
              />
              <PermissionCheckbox 
                module="accounts" 
                action="edit" 
                checked={permissions.accounts.edit} 
                onChange={() => handlePermissionChange('accounts', 'edit')} 
              />
              <PermissionCheckbox 
                module="accounts" 
                action="delete" 
                checked={permissions.accounts.delete} 
                onChange={() => handlePermissionChange('accounts', 'delete')} 
              />
            </div>

            {/* Settings Module */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-gray-700 mb-3 uppercase text-sm">Settings</h3>
              <PermissionCheckbox 
                module="settings" 
                action="create" 
                checked={permissions.settings.create} 
                onChange={() => handlePermissionChange('settings', 'create')} 
              />
              <PermissionCheckbox 
                module="settings" 
                action="view" 
                checked={permissions.settings.view} 
                onChange={() => handlePermissionChange('settings', 'view')} 
              />
              <PermissionCheckbox 
                module="settings" 
                action="edit" 
                checked={permissions.settings.edit} 
                onChange={() => handlePermissionChange('settings', 'edit')} 
              />
              <PermissionCheckbox 
                module="settings" 
                action="delete" 
                checked={permissions.settings.delete} 
                onChange={() => handlePermissionChange('settings', 'delete')} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}