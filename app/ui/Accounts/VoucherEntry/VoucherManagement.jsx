'use client'
import { useState } from "react";
import TodayVouchersTable from "./TodayVouchersTable";
import VoucherEntryForm from "./VoucherEntryForm";
import ReceivedVoucher from "./ReceivedVoucher";
import VoucherApproval from "./VoucherApproval";
import FundTransfer from "./FundTransfer";
import VoucherList from "./VoucherList";

const VoucherManagementUI = () => {
  // Tab state management
  const [activeTab, setActiveTab] = useState("Voucher Entry");
  
  // Tabs configuration
  const tabs = [
    "Voucher Entry",
    "Received Voucher",
    "Voucher Approval",
    "Fund Transfer",
    "Voucher List"
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Voucher Entry":
        return <VoucherEntryForm />;
      case "Received Voucher":
        return <ReceivedVoucher />;
      case "Voucher Approval":
        return <VoucherApproval />;
      case "Fund Transfer":
        return <FundTransfer />;
      case "Voucher List":
        return <VoucherList />;
      default:
        return <VoucherEntryForm />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4">
      {/* Tabs Navigation */}
      <div className="flex border-b overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === tab
                ? "border-b-2 border-green-500 text-green-500"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      {renderActiveTab()}

      {/* Your voucher today section - shown for all tabs */}
      <TodayVouchersTable />
    </div>
  );
};

export default VoucherManagementUI;