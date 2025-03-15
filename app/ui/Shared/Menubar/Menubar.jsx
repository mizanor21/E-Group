"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MdDashboard, MdOutlinePeople, MdSettings, MdAccountBalance } from "react-icons/md";
import { BsCashCoin } from "react-icons/bs";
import Image from "next/image";
import logo from "@/public/assets/logo/file2.png";
import { useLoginUserData } from "@/app/data/DataFetch";

const Menubar = () => {
  const {data} = useLoginUserData([])
  const pathname = usePathname();

  const MenuLink = ({ href, icon, title }) => {
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-2 transition-all duration-500 ${
          isActive
            ? "bg-[#f2f7ff] text-[#1f8ec3] border-l-[7px] border-[#1f8ec3]"
            : "text-black hover:bg-[#f2f7ff]"
        }`}
      >
        <span className="text-xl">{icon}</span>
        <span className="text-base font-medium">{title}</span>
      </Link>
    );
  };

  return (
    <div className="h-screen w-72 bg-white text-black flex flex-col">
      {/* Logo and Title */}
      <div className="flex flex-col items-center text-center p-10">
        <Image
          src={logo}
          width={500}
          height={500}
          alt="E group logo"
          className="rounded-2xl w-32 animate-pulse"
        />
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto space-y-3">
        <MenuLink href="/dashboard" icon={<MdDashboard />} title="Dashboard" />
        {
          data?.permissions?.employee?.view && (
            <MenuLink href="/dashboard/employees" icon={<MdOutlinePeople />} title="Employee" />
          )
        }
        {
          data?.permissions?.payroll?.view && (

            <MenuLink href="/dashboard/payroll" icon={<BsCashCoin />} title="Payroll" />
          )
        }
        {
          data?.permissions?.accounts?.view && (

            <MenuLink href="/dashboard/accounts" icon={<MdAccountBalance />} title="Accounts" />
          )
        }
        {
          data?.permissions?.settings?.view && (

            <MenuLink href="/dashboard/settings" icon={<MdSettings />} title="Settings" />
          )
        }
      </div>
    </div>
  );
};

export default Menubar;
