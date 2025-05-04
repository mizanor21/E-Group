"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  MdDashboard, 
  MdOutlinePeople, 
  MdSettings, 
  MdAccountBalance,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdAccountBalanceWallet,
  MdReceiptLong,
  MdApproval,
  MdAttachMoney,
  MdAccountBox
} from "react-icons/md";
import { BsCashCoin, BsBank2, BsJournalBookmark } from "react-icons/bs";
import Image from "next/image";
import logo from "@/public/assets/logo/file2.png";
import { useLoginUserData } from "@/app/data/DataFetch";

const Sidebar = () => {
  const { data } = useLoginUserData([]);
  const pathname = usePathname();
  const [isAccountsOpen, setIsAccountsOpen] = useState(false);

  // Account submenu items
  const accountSubMenuItems = [
    { href: "/dashboard/accounts-new/chart-of-accounts", icon: <BsJournalBookmark className="text-emerald-600" />, title: "Chart of Account" },
    { href: "/dashboard/accounts-new/voucher-entry", icon: <MdReceiptLong className="text-amber-500" />, title: "Voucher Entry" },
    { href: "/dashboard/accounts-new/voucher-approval", icon: <MdApproval className="text-blue-500" />, title: "Voucher Approval" },
    { href: "/dashboard/accounts-new/budget", icon: <MdAttachMoney className="text-green-600" />, title: "Accounts Budget" },
    { href: "/dashboard/accounts-new/bank-create", icon: <BsBank2 className="text-purple-600" />, title: "Bank Account Create" },
    { href: "/dashboard/accounts-new/cheque-book", icon: <MdAccountBox className="text-red-500" />, title: "Cheque Book Create" },
  ];

  const MenuLink = ({ href, icon, title, className = "" }) => {
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
          isActive
            ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md"
            : "text-white hover:bg-blue-50 hover:text-green-600"
        } ${className}`}
      >
        <span className={`text-xl ${isActive ? "text-white" : ""}`}>{icon}</span>
        <span className={`text-base font-medium ${isActive ? "text-white" : ""}`}>{title}</span>
      </Link>
    );
  };

  const toggleAccounts = () => {
    setIsAccountsOpen(!isAccountsOpen);
  };

  return (
    <div className="w-72 bg-gradient-to-b from-green-900 via-green-700 to-green-800 flex flex-col shadow-lg rounded-lg m-5">
      {/* Logo and Title */}
      <div className="flex flex-col items-center text-center p-6 text-white">
        <Image
          src={logo}
          width={500}
          height={500}
          alt="E group logo"
          className="rounded-2xl w-28 mb-2"
        />
        <small className="text-sm mt-2">ERP System</small>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <MenuLink href="/dashboard" icon={<MdDashboard className="text-blue-600" />} title="Dashboard" />
        
        {data?.permissions?.employee?.view && (
          <MenuLink 
            href="/dashboard/employees" 
            icon={<MdOutlinePeople className="text-purple-600" />} 
            title="Employee" 
          />
        )}
        
        {data?.permissions?.payroll?.view && (
          <MenuLink 
            href="/dashboard/payroll" 
            icon={<BsCashCoin className="text-amber-600" />} 
            title="Payroll" 
          />
        )}
        
        {data?.permissions?.accounts?.view && (
          <div className="space-y-1">
            <button
              onClick={toggleAccounts}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 ${
                pathname.includes('/dashboard/accounts')
                  ? "bg-gradient-to-r from-emerald-600 via-green-500 to-green-400 text-white shadow-md"
                  : "text-white hover:bg-green-50 hover:text-green-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <MdAccountBalance className={`text-xl ${pathname.includes('/dashboard/accounts') ? "text-white" : "text-green-600"}`} />
                <span className={`text-base font-medium ${pathname.includes('/dashboard/accounts') ? "text-white" : ""}`}>Accounts</span>
              </div>
              {isAccountsOpen ? (
                <MdKeyboardArrowUp className={pathname.includes('/dashboard/accounts') ? "text-white" : ""} />
              ) : (
                <MdKeyboardArrowDown className={pathname.includes('/dashboard/accounts') ? "text-white" : ""} />
              )}
            </button>
            
            {isAccountsOpen && (
              <div className="pl-4 space-y-1 animate-fadeIn">
                {accountSubMenuItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ${
                      pathname === item.href
                        ? "bg-gradient-to-r from-green-100 via-green-200 to-green-300 text-green-800 shadow-sm"
                        : "text-white hover:bg-green-50 hover:text-green-600"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
        
        {data?.permissions?.settings?.view && (
          <MenuLink 
            href="/dashboard/settings" 
            icon={<MdSettings className="text-gray-600" />} 
            title="Settings" 
          />
        )}
      </div>
      
      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-cyan-300 flex items-center justify-center text-white">
            {data?.fullName?.charAt(0) || "U"}
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="text-sm font-medium truncate">{data?.fullName || "User"}</h3>
            <p className="text-xs text-gray-500 truncate">{data?.email || "user@example.com"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;