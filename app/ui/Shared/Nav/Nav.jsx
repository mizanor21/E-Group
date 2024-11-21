"use client";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { IoMdNotifications } from "react-icons/io";
import Image from "next/image";
import demoProfile from "@/public/icons/profile.gif";
import user from "@/public/icons/user.png";
import settings from "@/public/icons/settings.png";
import logout from "@/public/icons/logout.png";
const Nav = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="navbar flex justify-between px-5">
      <div className="flex flex-col items-start">
        <h3 className="text-xl font-bold">Welcome, Mr. Kahafil Ora </h3>
        <small className="text-sm">
          Today&apos;s {format(currentTime, "EEEE, MMMM d, yyyy")}
        </small>
      </div>
      <div className="flex">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <IoMdNotifications className="text-2xl mt-1" />
              <span className="badge badge-sm indicator-item">8</span>
            </div>
          </div>
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
                <a className="justify-between">Profile</a>
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
              <div className="">
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
