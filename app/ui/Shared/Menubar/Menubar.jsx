"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MdDashboard, MdOutlinePeople, MdSettings } from "react-icons/md";
import { BsCashCoin } from "react-icons/bs";
import { MdAccountBalance } from "react-icons/md";
import { HiMenuAlt3 } from "react-icons/hi";
import Image from "next/image";
import logo from "@/public/assets/logo/file2.png";
import { useLoginUserData } from "@/app/data/DataFetch";
import { motion } from "framer-motion";

const Menubar = () => {
  const pathname = usePathname();
  const { data } = useLoginUserData([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Define menu items with permission checks
  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <MdDashboard />,
      permission: true, // Dashboard is always visible
    },
    {
      title: "Employee",
      path: "/dashboard/employees",
      icon: <MdOutlinePeople />,
      permission: data?.permissions?.employee?.view,
    },
    {
      title: "Payroll",
      path: "/dashboard/payroll",
      icon: <BsCashCoin />,
      permission: data?.permissions?.payroll?.view,
    },
    {
      title: "Accounts",
      path: "/dashboard/accounts",
      icon: <MdAccountBalance />,
      permission: data?.permissions?.accounts?.view,
    },
    {
      title: "Settings",
      path: "/dashboard/settings",
      icon: <MdSettings />,
      permission: data?.permissions?.settings?.view,
    },
  ];

  // Filter menu items based on permissions
  const filteredMenuItems = menuItems.filter(item => item.permission);

  const MenuLink = ({ item }) => {
    const isActive = pathname === item.path;

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link
          href={item.path}
          className={`flex items-center gap-3 px-4 py-3 my-1 rounded-lg transition-all duration-300 ${
            isActive
              ? "bg-gradient-to-r from-[#1f8ec3]/10 to-[#f2f7ff] text-[#1f8ec3] border-l-4 border-[#1f8ec3] font-medium"
              : "text-gray-700 hover:bg-[#f2f7ff]"
          }`}
        >
          {item.icon && (
            <span className={`text-xl ${isActive ? "text-[#1f8ec3]" : "text-gray-500"}`}>
              {item.icon}
            </span>
          )}
          {(!isCollapsed || isActive) && (
            <span className={`text-base ${isActive ? "font-medium" : ""}`}>
              {item.title}
            </span>
          )}
        </Link>
      </motion.div>
    );
  };

  return (
    <div 
      className={`h-screen bg-white text-black flex flex-col shadow-sm transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Logo and Title */}
      <div className="flex flex-col items-center text-center p-6 relative">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute right-2 top-2 text-gray-500 hover:text-[#1f8ec3] transition-colors p-2 rounded-full hover:bg-gray-100"
        >
          <HiMenuAlt3 />
        </button>
        
        <Image
          src={logo}
          width={isCollapsed ? 50 : 100}
          height={isCollapsed ? 50 : 100}
          alt="E group logo"
          className="rounded-xl hover:animate-pulse transition-all duration-300"
        />
        
        {!isCollapsed && (
          <h2 className="mt-2 text-sm font-medium text-gray-700">ERP System</h2>
        )}
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {filteredMenuItems.map((item, index) => (
          <MenuLink key={index} item={item} />
        ))}
      </div>
      
      {/* User Profile */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#1f8ec3] to-[#2d63a9] flex items-center justify-center text-white text-sm">
            {data?.user?.name?.charAt(0) || "U"}
          </div>
          {!isCollapsed && (
            <div className="text-sm">
              <p className="font-medium">{data?.user?.name || "User"}</p>
              <p className="text-xs text-gray-500">{data?.user?.role || "User Role"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menubar;