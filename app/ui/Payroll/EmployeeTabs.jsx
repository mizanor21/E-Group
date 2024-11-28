"use client";
import React, { useState } from "react";
import EmployeeSalary from "./EmployeeSalary/EmployeeSalary";
import EmployeePayslips from "./EmployeePayslips/EmployeePayslips";
import EmployeePayroll from "./EmployeePayroll/EmployeePayroll";
import TaxDefinitions from "./TaxDefinitions/TaxDefinitions";

const EmployeeTabs = () => {
    const [activeTab, setActiveTab] = useState("employeeSalary"); // Manage active tab

    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
            {/* Tabs */}
            <div className="flex gap-6 border-b pb-2 mb-6 text-gray-600">
                <button
                    onClick={() => setActiveTab("employeeSalary")}
                    className={`${activeTab === "employeeSalary"
                        ? "border-b-4 border-blue-500 text-blue-500"
                        : "hover:text-blue-500"
                        } pb-2 font-medium`}
                >
                    Employee Salary
                </button>
                <button
                    onClick={() => setActiveTab("employeePayslips")}
                    className={`${activeTab === "employeePayslips"
                        ? "border-b-4 border-blue-500 text-blue-500"
                        : "hover:text-blue-500"
                        } pb-2 font-medium`}
                >
                    Employee Payslips
                </button>
                <button
                    onClick={() => setActiveTab("employeePayroll")}
                    className={`${activeTab === "employeePayroll"
                        ? "border-b-4 border-blue-500 text-blue-500"
                        : "hover:text-blue-500"
                        } pb-2 font-medium`}
                >
                    Employee Payroll
                </button>
                <button
                    onClick={() => setActiveTab("taxDefinitions")}
                    className={`${activeTab === "taxDefinitions"
                        ? "border-b-4 border-blue-500 text-blue-500"
                        : "hover:text-blue-500"
                        } pb-2 font-medium`}
                >
                    Tax Definitions
                </button>
            </div>

            {/* Render Components Based on Active Tab */}
            {activeTab === "employeeSalary" && <EmployeeSalary />}
            {activeTab === "employeePayslips" && <EmployeePayslips />}
            {activeTab === "employeePayroll" && <EmployeePayroll />}
            {activeTab === "taxDefinitions" && <TaxDefinitions />}
        </div>
    );
};

export default EmployeeTabs;
