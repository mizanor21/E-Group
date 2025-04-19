"use client";
import React, { useState } from "react";
import { SiApacheopenoffice } from "react-icons/si";
import { LiaFileDownloadSolid } from "react-icons/lia";
import { ImSpinner9 } from "react-icons/im";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Link from "next/link";
import WpsModal from "./WPS/WpsModal";
import { CiEdit } from "react-icons/ci";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useLoginUserData } from "@/app/data/DataFetch";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

const EmployeeSalaryTable = ({ employees }) => {
  const { data } = useLoginUserData([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processedEmployees, setProcessedEmployees] = useState(employees);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasTimesheetData, setHasTimesheetData] = useState(false);

  // Unified function to post salary data
  const postSalaryData = async (salaryData) => {
    try {
      const response = await fetch("/api/salary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(salaryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create salary");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating salary:", error);
      throw error;
    }
  };

  // Calculate net salary in the required format
  const calculateNetSalary = (timesheetData, employeeData) => {
    return timesheetData.map((timesheetEntry) => {
      const employee = employeeData.find(
        (emp) => emp.employeeID === timesheetEntry.employeeID
      );

      if (!employee) {
        console.warn(`No employee found for ID: ${timesheetEntry.employeeID}`);
        return null;
      }

      const workingDays = 30; // Default working days
      const baseSalary = employee.hourlyRate * timesheetEntry.totalHours;
      const normalOvertimeHours = employee.overTimeHours || 0;
      const normalOvertimeEarning = normalOvertimeHours * employee.hourlyRate * 1.25;
      
      const allowances = {
        allowances: timesheetEntry.allowance || 0,
        specialAllowances: 0,
        accommodation: employee.accAllowance || 0,
        foodAllowance: employee.foodAllowance || 0,
        telephoneAllowance: employee.telephoneAllowance || 0,
        transportAllowance: employee.transportAllowance || 0,
        total: (timesheetEntry.allowance || 0) + 
               (employee.accAllowance || 0) + 
               (employee.foodAllowance || 0) + 
               (employee.telephoneAllowance || 0) + 
               (employee.transportAllowance || 0)
      };

      const deductions = {
        numberOfLeave: 0,
        dedFines: 0,
        dedDoc: 0,
        dedOthers: 0,
        total: timesheetEntry.deduction || 0
      };

      const otherEarnings = {
        advRecovery: 0,
        arrearPayments: 0,
        currentBalance: 0,
        total: 0
      };

      const netSalary = baseSalary + normalOvertimeEarning + allowances.total - deductions.total;

      return {
        ...employee,
        opBal: "0.00",
        salary: baseSalary.toFixed(2),
        overtime: normalOvertimeEarning.toFixed(2),
        allowance: allowances.total.toFixed(2),
        grossPay: (baseSalary + normalOvertimeEarning + allowances.total).toFixed(2),
        deduction: deductions.total.toFixed(2),
        netPayable: netSalary.toFixed(2),
        timesheet: {
          project: timesheetEntry.project,
          month: timesheetEntry.salaryMonth,
          allowance: timesheetEntry.allowance,
          deduction: timesheetEntry.deduction,
          totalHours: timesheetEntry.totalHours
        },
        fullSalaryData: {
          employeeId: employee.employeeID,
          name: `${employee.firstName} ${employee.lastName}`,
          month: timesheetEntry.salaryMonth,
          workingDays: workingDays,
          baseSalary: baseSalary,
          overtime: {
            normal: {
              hours: normalOvertimeHours,
              earning: normalOvertimeEarning
            },
            holiday: {
              hours: 0,
              earning: 0
            }
          },
          allowances: allowances,
          deductions: deductions,
          otherEarnings: otherEarnings,
          netSalary: netSalary
        }
      };
    }).filter(Boolean);
  };

  // Handle timesheet file upload and salary generation
  const handleTimesheetUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsGenerating(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const timesheetData = XLSX.utils.sheet_to_json(firstSheet);
        
        const calculatedSalaries = calculateNetSalary(timesheetData, employees);
        
        await Promise.all(
          calculatedSalaries.map(salary => 
            postSalaryData(salary.fullSalaryData)
          )
        );
        
        setProcessedEmployees(calculatedSalaries);
        setHasTimesheetData(true);
        toast.success("Salaries successfully generated and saved!");
      } catch (error) {
        console.error("Error processing timesheet:", error);
        alert(`Error: ${error.message}`);
      } finally {
        setIsGenerating(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Handle individual salary generation
  const handleGenerateSalary = async (employeeId) => {
    setIsGenerating(true);
    try {
      const employee = employees.find(emp => emp._id === employeeId);
      const timesheetEntry = processedEmployees.find(
        emp => emp.employeeID === employee.employeeID
      )?.timesheet;

      if (!employee || !timesheetEntry) {
        throw new Error("Employee or timesheet data not found");
      }

      const salaryData = {
        employeeId: employee.employeeID,
        name: `${employee.firstName} ${employee.lastName}`,
        month: timesheetEntry.month,
        workingDays: 30,
        baseSalary: employee.hourlyRate * timesheetEntry.totalHours,
        overtime: {
          normal: {
            hours: employee.overTimeHours || 0,
            earning: (employee.overTimeHours || 0) * employee.hourlyRate * 1.25
          },
          holiday: {
            hours: 0,
            earning: 0
          }
        },
        allowances: {
          allowances: timesheetEntry.allowance || 0,
          specialAllowances: 0,
          accommodation: employee.accAllowance || 0,
          foodAllowance: employee.foodAllowance || 0,
          telephoneAllowance: employee.telephoneAllowance || 0,
          transportAllowance: employee.transportAllowance || 0,
          total: (timesheetEntry.allowance || 0) + 
                 (employee.accAllowance || 0) + 
                 (employee.foodAllowance || 0) + 
                 (employee.telephoneAllowance || 0) + 
                 (employee.transportAllowance || 0)
        },
        deductions: {
          numberOfLeave: 0,
          dedFines: 0,
          dedDoc: 0,
          dedOthers: 0,
          total: timesheetEntry.deduction || 0
        },
        otherEarnings: {
          advRecovery: 0,
          arrearPayments: 0,
          currentBalance: 0,
          total: 0
        },
        netSalary: (employee.hourlyRate * timesheetEntry.totalHours) +
                  ((employee.overTimeHours || 0) * employee.hourlyRate * 1.25) +
                  (timesheetEntry.allowance || 0) + 
                  (employee.accAllowance || 0) + 
                  (employee.foodAllowance || 0) + 
                  (employee.telephoneAllowance || 0) + 
                  (employee.transportAllowance || 0) -
                  (timesheetEntry.deduction || 0)
      };

      await postSalaryData(salaryData);
      
      const updatedEmployees = processedEmployees.map(emp => 
        emp.employeeID === employee.employeeID ? 
        { ...emp, ...calculateNetSalary([timesheetEntry], [employee])[0] } : 
        emp
      );
      setProcessedEmployees(updatedEmployees);
      
      alert("Salary successfully generated and saved!");
    } catch (error) {
      console.error("Error generating salary:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset Function (Refresh)
  const handleReset = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setSearchQuery("");
      setFilterDepartment("");
      setCurrentPage(1);
      setProcessedEmployees(employees);
      setHasTimesheetData(false);
      setIsRefreshing(false);
    }, 1000);
  };

  // Pagination logic
  const totalPages = Math.ceil(processedEmployees?.length / rowsPerPage);
  const startRow = (currentPage - 1) * rowsPerPage;

  // Filter and search logic
  const filteredEmployees = processedEmployees?.filter(
    (employee) =>
      (filterDepartment === "" || employee.department === filterDepartment) &&
      Object.values(employee)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const displayedEmployees = filteredEmployees?.slice(
    startRow,
    startRow + rowsPerPage
  );

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Download PDF Function
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "S/N",
      "Name",
      "Employee ID",
      "OP BAL",
      "Salary",
      "Over Time",
      "Allowance",
      "Gross Pay",
      "Deduction",
      "Net Payable",
    ];
    const tableRows = processedEmployees.map((employee, index) => [
      index + 1,
      `${employee?.firstName || ""} ${employee?.lastName || ""}`,
      employee?.employeeID || "",
      employee?.opBal || "0.00",
      employee?.salary || "0.00",
      employee?.overtime || "0.00",
      employee?.allowance || "0.00",
      employee?.grossPay || "0.00",
      employee?.deduction || "0.00",
      employee?.netPayable || "0.00",
    ]);

    doc.text("Employee Salary List", 14, 15);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 10 },
    });
    doc.save("Employee_Salary_List.pdf");
  };

  // WPS Modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">All Employees Salary</h1>

      <div className="lg:flex lg:gap-20 justify-between">
        {/* Filter Section */}
        <div className="lg:w-[70%] bg-white p-6 rounded-lg shadow mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Timesheet Upload */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Upload Timesheet
            </label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleTimesheetUpload}
              className="mt-2 block w-full border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
              disabled={isGenerating}
            />
          </div>

          {/* Search Bar */}
          <div>
            <label className="text-sm font-medium text-gray-600">Search</label>
            <input
              type="text"
              value={searchQuery}
              placeholder="Search by any field"
              className="mt-2 block w-full border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter by Department */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Filter by Department
            </label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="mt-2 block w-full border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
            >
              <option value="">All Departments</option>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
        </div>

        {/* Download and Reset Buttons */}
        <div className="bg-white px-6 py-3 rounded-lg space-y-1">
          {data?.permissions?.payroll?.create && (
            <button
              onClick={openModal}
              type="button"
              className="btn flex gap-3 text-white w-28 lg:w-44 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-800 hover:to-orange-500"
            >
              <SiApacheopenoffice className="text-xl" />
              WPS
            </button>
          )}
          <button
            onClick={handleDownloadPDF}
            type="button"
            className="btn flex gap-3 text-white w-28 lg:w-44 rounded-2xl bg-gradient-to-r from-green-500 to-green-800 hover:from-green-800 hover:to-green-400"
          >
            <LiaFileDownloadSolid className="text-xl" />
            Download
          </button>
          <button
            onClick={handleReset}
            type="button"
            className="btn flex gap-3 text-white w-28 lg:w-44 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-800 hover:to-blue-400"
          >
            <ImSpinner9
              className={`text-xl ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Timesheet Status Indicator */}
      {hasTimesheetData && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          <p>Timesheet data loaded. You can now generate individual salaries.</p>
        </div>
      )}

      {/* Employee Table */}
      <div className="bg-white p-6 rounded-lg shadow mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse bg-white rounded-lg">
            <thead>
              <tr className="bg-blue-100 text-gray-800 text-sm">
                <th className="py-2 px-4">S/N</th>
                <th className="py-2 px-4">Employee ID</th>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Month</th>
                <th className="py-2 px-4">Hourly Rate</th>
                <th className="py-2 px-4">Total Hours</th>
                <th className="py-2 px-4">Allowance</th>
                <th className="py-2 px-4">Deduction</th>
                <th className="py-2 px-4">Basic Salary</th>
                <th className="py-2 px-4">Net Payable</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedEmployees?.length > 0 ? (
                displayedEmployees.map((employee, index) => (
                  <tr
                    key={employee._id || index}
                    className="border-t hover:bg-gray-100"
                  >
                    <td className="py-2 px-4">{startRow + index + 1}</td>
                    <td className="py-2 px-4">{employee?.employeeID || ""}</td>
                    <td className="py-2 px-4">
                      {`${employee?.firstName || ""} ${employee?.lastName || ""}`}
                    </td>
                    <td className="py-2 px-4">{employee?.timesheet?.month || ""}</td>
                    <td className="py-2 px-4">{employee?.hourlyRate || "0.00"}</td>
                    <td className="py-2 px-4">
                      {employee?.timesheet?.totalHours || "0.00"}
                    </td>
                    <td className="py-2 px-4">
                      {employee?.timesheet?.allowance || "0.00"}
                    </td>
                    <td className="py-2 px-4">
                      {employee?.timesheet?.deduction || "0.00"}
                    </td>
                    <td className="py-2 px-4">{employee?.salary || "0.00"}</td>
                    <td className="py-2 px-4">
                      {employee?.netPayable || "0.00"}
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex justify-center gap-2">
                        {data?.permissions?.payroll?.create && (
                          hasTimesheetData ? (
                            <button
                              onClick={() => handleGenerateSalary(employee._id)}
                              disabled={isGenerating}
                              className={`bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600 ${
                                isGenerating ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                              title="Generate Salary from Timesheet"
                            >
                              {isGenerating ? (
                                <ImSpinner9 className="animate-spin" />
                              ) : (
                                <FaMoneyCheckDollar />
                              )}
                            </button>
                          ) : (
                            <Link href={`/dashboard/payroll/${employee._id}`}>
                              <button 
                                className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                                title="Go to Payroll Details"
                              >
                                <FaMoneyCheckDollar />
                              </button>
                            </Link>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center py-4 text-gray-500">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 ${currentPage === 1 && "opacity-50 cursor-not-allowed"
                }`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 ${currentPage === totalPages && "opacity-50 cursor-not-allowed"
                }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* WPS Modal */}
      {isModalOpen && <WpsModal closeModal={closeModal} />}
    </div>
  );
};

export default EmployeeSalaryTable;