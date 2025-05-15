'use client'
import { useState } from "react";
import { FaMoneyCheckAlt, FaRegFileAlt, FaListAlt, FaExchangeAlt } from "react-icons/fa";
import TodayVouchersTable from "./TodayVouchersTable";
import VoucherEntryForm from "./VoucherEntryForm";
import ReceivedVoucher from "./ReceivedVoucher";
import FundTransfer from "./FundTransfer";
import VoucherList from "./VoucherList";

const VoucherManagementUI = () => {
  const [activeTab, setActiveTab] = useState("Payment Voucher");

  const tabs = [
    {
      label: "Payment Voucher",
      icon: <FaMoneyCheckAlt className="text-lg" />,
    },
    {
      label: "Received Voucher",
      icon: <FaRegFileAlt className="text-lg" />,
    },
    {
      label: "Voucher List",
      icon: <FaListAlt className="text-lg" />,
    },
    {
      label: "Fund Transfer",
      icon: <FaExchangeAlt className="text-lg" />,
    },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Payment Voucher":
        return <VoucherEntryForm />;
      case "Received Voucher":
        return <ReceivedVoucher />;
      case "Voucher List":
        return <VoucherList />;
      case "Fund Transfer":
        return <FundTransfer />;
      default:
        return <VoucherEntryForm />;
    }
  };

  return (
    <div className="bg-white min-h-screen p-4">
      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-md transition-all duration-200 whitespace-nowrap font-medium
              ${activeTab === tab.label
                ? "bg-green-100 text-green-600 border-b-2 border-green-500"
                : "text-gray-500 hover:text-green-500"
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="mt-4">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default VoucherManagementUI;
