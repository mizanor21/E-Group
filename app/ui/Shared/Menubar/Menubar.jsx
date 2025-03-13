"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MdDashboard, MdOutlinePeople, MdSettings } from "react-icons/md";
import { BsCashCoin } from "react-icons/bs"; // Import icons

import Image from "next/image";
import logo from "@/public/assets/logo/file2.png";
import { MdAccountBalance } from "react-icons/md";

const Menubar = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <MdDashboard />,
    },
    {
      title: "Employee",
      path: "/dashboard/employees",
      icon: <MdOutlinePeople />,
    },
    {
      title: "Payroll",
      path: "/dashboard/payroll",
      icon: <BsCashCoin />,
    },
    {
      title: "Accounts",
      path: "/dashboard/accounts",
      icon: <MdAccountBalance />,
    },
    {
      title: "Settings",
      path: "/dashboard/settings",
      icon: <MdSettings />,
    },
  ];

  const MenuLink = ({ item }) => {
    const isActive = pathname === item.path;

    return (
      <Link
        href={item.path}
        className={`flex items-center gap-3 px-4 py-2 transition-all duration-500 ${
          isActive
            ? "bg-[#f2f7ff] text-[#1f8ec3] border-l-[7px] border-[#1f8ec3]"
            : "text-black hover:bg-[#f2f7ff]"
        }`}
      >
        {item.icon && <span className="text-xl">{item.icon}</span>}
        <span className="text-base font-medium">{item.title}</span>
      </Link>
    );
  };

  return (
    <div className="h-screen w-72 bg-white text-black flex flex-col">
      {/* Logo and Title */}
      <div className="flex flex-col items-center text-center p-10">
        {/* <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#2d63a9] to-[#2d63a9]/60 text-transparent bg-clip-text">
          LO <br /> GO
        </h1>
        <h2 className="text-md bg-gradient-to-b from-[#416ea8] to-[#2d63a9]/60 text-transparent bg-clip-text">
          E Group
        </h2>
        <h2 className="text-md text-black">ERP System</h2> */}
        <Image
          src={logo}
          width={500}
          height={500}
          alt="E group logo"
          className="rounded-2xl w-32 animate-pulse"
        ></Image>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {menuItems.map((item, index) => (
          <MenuLink key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Menubar;
