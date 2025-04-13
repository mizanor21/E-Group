"use client";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase.config";
import { useRouter } from "next/navigation";
import demoProfile from "@/public/icons/profile.gif";
import user from "@/public/icons/user.png";
import settings from "@/public/icons/settings.png";
import logout from "@/public/icons/logout.png";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuthState } from "react-firebase-hooks/auth";

const Nav = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loginUser, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (loading) return; // Don't proceed if auth state is still loading
    
    if (!loginUser) {
      // Redirect to login page if no user is logged in
      router.push('/');
      return;
    }
    
  }, [loginUser, loading, router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      toast.success("Successfully signed out!");
      router.push('/');
    } catch (error) {
      console.error("Sign out error", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  // Show skeleton UI while loading
  if (loading) {
    return (
      <div className="navbar flex justify-between px-5 animate-pulse">
        <div className="flex flex-col items-start">
          <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="flex">
          <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="navbar flex justify-between px-5">
        <div className="flex flex-col items-start">
          <h3 className="text-xl font-bold text-red-500">Authentication Error</h3>
          <small className="text-sm">Please try refreshing the page</small>
        </div>
        <button 
          onClick={() => router.push('/')}
          className="btn btn-error btn-sm"
        >
          Return to Login
        </button>
      </div>
    );
  }

  const displayName = loginUser?.displayName;

  return (
    <div className="navbar flex justify-between p-4 shadow-sm bg-white rounded-lg">
      <div className="flex flex-col items-start">
        <h3 className="text-xl font-bold">
          Welcome, {displayName}
        </h3>
        <small className="text-sm text-gray-600">
          Today&apos;s {format(currentTime, "EEEE, MMMM d, yyyy")}
        </small>
      </div>
      <div className="flex items-center gap-4">
        
        {/* User Profile Dropdown */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar ring ring-primary ring-offset-2"
          >
            <div className="w-10 rounded-full">
              <Image alt={`${displayName}'s profile`} src={demoProfile} />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link href="/dashboard/manage-permission" className="py-2 font-medium">
                <div className="flex items-center gap-2">
                  <Image width={20} height={20} alt="User logo" src={user} />
                  <span>Manage Permissions</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/required-field-manage" className="py-2 font-medium">
                <div className="flex items-center gap-2">
                  <Image width={20} height={20} alt="User logo" src={user} />
                  <span>Manage Field</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href='/dashboard/signup' className="py-2">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" x2="19" y1="8" y2="14" />
                    <line x1="16" x2="22" y1="11" y2="11" />
                  </svg>
                  <span>Create New User</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/settings" className="py-2">
                <div className="flex items-center gap-2">
                  <Image width={20} height={20} alt="settings logo" src={settings} />
                  <span>Settings</span>
                </div>
              </Link>
            </li>
            <div className="divider my-1"></div>
            <li>
              <button 
                onClick={handleSignOut} 
                className="py-2 text-red-500 hover:text-red-700"
              >
                <div className="flex items-center gap-2">
                  <Image width={20} height={20} alt="logout logo" src={logout} />
                  <span>Logout</span>
                </div>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Nav;