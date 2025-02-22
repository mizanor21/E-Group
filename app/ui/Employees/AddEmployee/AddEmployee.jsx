"use client";
import React, { useState } from "react";
import EmployeeInformation from "./EmployeeInformation";
import HRDetails from "./HRDetails";
import Documents from "./Documents";
import PaymentInformation from "./PaymentInformation";

const AddEmployee = () => {
  const [activeTab, setActiveTab] = useState("employeeInfo"); // Manage active tab

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
      {/* Tabs */}
      <div className="flex gap-6 border-b pb-2 mb-6 text-gray-600">
        <button
          onClick={() => setActiveTab("employeeInfo")}
          className={`${
            activeTab === "employeeInfo"
              ? "border-b-4 border-blue-500 text-blue-500"
              : "hover:text-blue-500"
          } pb-2 font-medium`}
        >
          Employee Information
        </button>
        <button
          onClick={() => setActiveTab("hrDetails")}
          className={`${
            activeTab === "hrDetails"
              ? "border-b-4 border-blue-500 text-blue-500"
              : "hover:text-blue-500"
          } pb-2 font-medium`}
        >
          HR Details
        </button>
        <button
          onClick={() => setActiveTab("documents")}
          className={`${
            activeTab === "documents"
              ? "border-b-4 border-blue-500 text-blue-500"
              : "hover:text-blue-500"
          } pb-2 font-medium`}
        >
          Documents
        </button>
        <button
          onClick={() => setActiveTab("paymentInfo")}
          className={`${
            activeTab === "paymentInfo"
              ? "border-b-4 border-blue-500 text-blue-500"
              : "hover:text-blue-500"
          } pb-2 font-medium`}
        >
          Payment Information
        </button>
      </div>

      {/* Render Components Based on Active Tab */}
      {activeTab === "employeeInfo" && <EmployeeInformation />}
      {activeTab === "hrDetails" && <HRDetails />}
      {activeTab === "documents" && <Documents />}
      {activeTab === "paymentInfo" && <PaymentInformation />}
    </div>
  );
};

export default AddEmployee;
