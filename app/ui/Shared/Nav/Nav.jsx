"use client";
import { FaUser, FaTrashAlt, FaEnvelope, FaClock } from "react-icons/fa";
import { formatDistanceToNow, format } from "date-fns";
import React, { useEffect, useState } from "react";
import { IoMdNotifications } from "react-icons/io";

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
                <button className="btn btn-primary btn-block">
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
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Nav;
