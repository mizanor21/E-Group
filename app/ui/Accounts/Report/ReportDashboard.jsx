'use client'
import { useState } from "react";
import { FaMoneyCheckAlt, FaRegFileAlt, FaListAlt, FaExchangeAlt, FaBalanceScale } from "react-icons/fa";
import LedgerReport from "./Ledger/LedgerReport";

const ReportDashboard = () => {
  const [activeTab, setActiveTab] = useState("Ledger");

  const tabs = [
    {
      label: "Ledger",
      icon: <FaMoneyCheckAlt className="text-lg" />,
    },
    {
      label: "Group Ledger",

      icon: <FaRegFileAlt className="text-lg" />,
    },
    {
      label: "Balance Sheet",
      icon: <FaListAlt className="text-lg" />,
    },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Ledger":
        return <LedgerReport />;
      case "Group Ledger":
        return <LedgerReport />;
      case "Balance Sheet":
        return <LedgerReport />;
      default:
        return <LedgerReport />;
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

export default ReportDashboard;
