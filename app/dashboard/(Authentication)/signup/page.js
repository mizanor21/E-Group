'use client';
import React, { useState } from 'react';
import { useCreateUserWithEmailAndPassword, useUpdateProfile } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase.config';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);
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
    formState: { errors },
    reset
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

  // Toggle permissions for a whole module
  const toggleModulePermissions = (module, value) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        create: value,
        view: value,
        edit: value,
        delete: value
      },
    }));
  };

  const onSubmit = async (data) => {
    // Reset states
    setError('');
    setIsSubmitting(true);
    setUserCreated(false);
    setProfileUpdated(false);
    
    let userUID = '';
    
    try {
      // Step 1: Create a Firebase account
      const userCredential = await createUserWithEmailAndPassword(
        data.email,
        data.password
      );
      
      if (!userCredential || !userCredential.user) {
        throw new Error('Failed to create user account');
      }
      
      userUID = userCredential.user.uid;
      setUserCreated(true);
      
      // Step 2: Update the user's profile with retries
      let profileUpdateSuccess = false;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (!profileUpdateSuccess && retryCount < maxRetries) {
        try {
          await updateProfile({ 
            displayName: data.fullName,
            photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName)}&background=random`
          });
          profileUpdateSuccess = true;
          setProfileUpdated(true);
        } catch (profileError) {
          console.error(`Profile update attempt ${retryCount + 1} failed:`, profileError);
          retryCount++;
          
          // Wait before retrying (exponential backoff)
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
          }
        }
      }
      
      if (!profileUpdateSuccess) {
        toast.error("Profile information was partially updated. Some details may be missing.");
      }
      
      // Step 3: Prepare additional user data for the database
      const userData = {
        uid: userUID,
        fullName: data.fullName,
        email: data.email,
        permissions: permissions,
        createdAt: new Date().toISOString(),
        photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName)}&background=random`
      };
      
      // Step 4: Store additional user data in database
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success("User account created successfully!");
        reset(); // Clear form
        router.push('/dashboard');
      } else {
        // If database storage fails but Firebase account was created
        setError(`User created but database update failed: ${result.message || 'Unknown error'}`);
        toast.error("User created but some information couldn't be saved");
      }
    } catch (err) {
      console.error("Signup error:", err);
      
      // Handle Firebase-specific errors
      if (err.code) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            setError('This email is already registered');
            break;
          case 'auth/invalid-email':
            setError('Invalid email address format');
            break;
          case 'auth/weak-password':
            setError('Password is too weak');
            break;
          case 'auth/operation-not-allowed':
            setError('Account creation is currently disabled');
            break;
          default:
            setError(`Registration error: ${err.message}`);
        }
      } else {
        setError(`Registration error: ${err.message || 'Unknown error occurred'}`);
      }
      
      // If user was created but profile update or database storage failed
      if (userCreated && userUID) {
        toast.error("Account created but profile setup is incomplete");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate overall submission status
  const isProcessing = loading || updating || isSubmitting;
  const getSubmitButtonText = () => {
    if (isProcessing) {
      if (!userCreated) return 'Creating Account...';
      if (!profileUpdated) return 'Setting Up Profile...';
      return 'Saving User Data...';
    }
    return 'Create Account';
  };

  return (
    <div className="">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden relative z-10">
        {/* Signup Form Section */}
        <div className="p-8 flex flex-col justify-center bg-white/90">
          <div className="flex items-center mb-6">
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

          {/* Progress Steps */}
          {isProcessing && (
            <div className="mb-6">
              <div className="flex mb-2">
                <div className={`h-1 flex-1 ${!userCreated ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
                <div className={`h-1 flex-1 ${userCreated && !profileUpdated ? 'bg-blue-500 animate-pulse' : (profileUpdated ? 'bg-green-500' : 'bg-gray-200')}`}></div>
                <div className={`h-1 flex-1 ${profileUpdated ? 'bg-blue-500 animate-pulse' : 'bg-gray-200'}`}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span className={userCreated ? 'text-green-500' : ''}>Account</span>
                <span className={profileUpdated ? 'text-green-500' : ''}>Profile</span>
                <span>Complete</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {(error || firebaseError || updateError) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-600 rounded">
              {error || firebaseError?.message || updateError?.message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name Input */}
            <div className="relative">
              <label htmlFor="fullName" className="text-sm font-medium text-gray-700 mb-1 block">
                Full Name
              </label>
              <input 
                id="fullName"
                type="text" 
                placeholder="Enter full name" 
                {...register('fullName')}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors duration-300"
                disabled={isProcessing}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="relative">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">
                Email Address
              </label>
              <input 
                id="email"
                type="email" 
                placeholder="Enter email address" 
                {...register('email')}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors duration-300"
                disabled={isProcessing}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1 block">
                Password
              </label>
              <input 
                id="password"
                type="password" 
                placeholder="Enter password" 
                {...register('password')}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors duration-300"
                disabled={isProcessing}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 mb-1 block">
                Confirm Password
              </label>
              <input 
                id="confirmPassword"
                type="password" 
                placeholder="Confirm your password" 
                {...register('confirmPassword')}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors duration-300"
                disabled={isProcessing}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Mobile Permission Controls (Visible on small screens) */}
            <div className="md:hidden">
              <div className="border border-gray-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-gray-700 mb-3">Module Permissions</h3>
                <div className="space-y-3">
                  {Object.keys(permissions).map((module) => (
                    <div key={module} className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{module}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={Object.values(permissions[module                          ]).every(Boolean)}
                          onChange={(e) => toggleModulePermissions(module, e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sign Up Button */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit" 
              disabled={isProcessing}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {getSubmitButtonText()}
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

        {/* Permission Section (Visible on larger screens) */}
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