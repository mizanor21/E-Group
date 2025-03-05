"use client";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { IoMdNotifications } from "react-icons/io";
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

const Nav = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Firebase SignOut Handler
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Clear any local storage or session data if needed
      localStorage.removeItem('user'); // Optional: clear user data
      toast.success("Successfully signed out!");
      
      // Redirect to login page
      router.push('/');
    } catch (error) {
      console.error("Sign out error", error);
      // Optionally show an error toast or message
      alert("Failed to sign out. Please try again.");
    }
  };

  return (
    <div className="navbar flex justify-between px-5">
      <div className="flex flex-col items-start">
        <h3 className="text-xl font-bold">Welcome, Mr. Shazzad Hossion </h3>
        <small className="text-sm">
          Today&apos;s {format(currentTime, "EEEE, MMMM d, yyyy")}
        </small>
      </div>
      <div className="flex">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow"
          >
            <div className="card-body">
              <span className="text-lg font-bold">8 Notifications</span>
              <div className="card-actions">
                <button className="btn bg-gradient-to-r from-[#2d63a9] to-[#2d63a9]/50 text-white btn-block">
                  View Notifications
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-14 rounded-full">
              <Image alt="User demo profile" src={demoProfile} />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li className="flex justify-between">
              <div className="">
                <Image width={20} height={20} alt="User logo" src={user} />
                <Link href={'/dashboard/signup'} className="justify-between">Create New User</Link>
              </div>
            </li>
            <li className="flex justify-between">
              <div className="">
                <Image
                  width={20}
                  height={20}
                  alt="settings logo"
                  src={settings}
                />
                <a>Settings</a>
              </div>
            </li>
            <li className="flex justify-between">
              <div 
                onClick={handleSignOut} 
                className="cursor-pointer"
              >
                <Image width={20} height={20} alt="logout logo" src={logout} />
                <a>Logout</a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Nav;