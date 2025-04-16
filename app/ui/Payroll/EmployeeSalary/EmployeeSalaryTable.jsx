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

const EmployeeSalaryTable = ({ employees }) => {
  const { data } = useLoginUserData([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processedEmployees, setProcessedEmployees] = useState(employees);

  // Calculate net salary from timesheet data
  const calculateNetSalary = (timesheetData, employeeData) => {
    return timesheetData.map((timesheetEntry) => {
      const employee = employeeData.find(
        (emp) => emp.employeeID === timesheetEntry.employeeID
      );
  
      if (!employee) {
        console.warn(`No employee found for ID: ${timesheetEntry.employeeID}`);
        return null;
      }
  
      const basicSalary = employee.hourlyRate * timesheetEntry.totalHours;
      const overtimePay = (employee.overTimeHours || 0) * employee.hourlyRate * 1.25;
      const totalAllowances = 
        (employee.accAllowance || 0) + 
        (employee.foodAllowance || 0) + 
        (employee.telephoneAllowance || 0) + 
        (employee.transportAllowance || 0) +
        (timesheetEntry.allowance || 0);
      const grossPay = basicSalary + overtimePay + totalAllowances;
      const deductions = (timesheetEntry?.deduction || 0);
      const netPayable = grossPay - deductions;
  
      return {
        ...employee,
        opBal: "0.00",
        salary: basicSalary.toFixed(2),
        overtime: overtimePay.toFixed(2),
        allowance: totalAllowances.toFixed(2),
        grossPay: grossPay.toFixed(2),
        deduction: deductions.toFixed(2),
        netPayable: netPayable.toFixed(2),
        timesheet: {
          project: timesheetEntry.project,
          month: timesheetEntry.salaryMonth, // This will show in the month column
          allowance: timesheetEntry.allowance,
          deduction: timesheetEntry.deduction,
          totalHours: timesheetEntry.totalHours
        }
      };
    }).filter(Boolean);
  };

  // Handle timesheet file upload
  const handleTimesheetUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const timesheetData = XLSX.utils.sheet_to_json(firstSheet);
        console.log(timesheetData);
        // Calculate salaries
        const calculatedSalaries = calculateNetSalary(timesheetData, employees);
        setProcessedEmployees(calculatedSalaries);
      } catch (error) {
        console.error("Error processing timesheet:", error);
        alert("Error processing timesheet file. Please check the format.");
      }
    };
    reader.readAsArrayBuffer(file);
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

  // Reset Function (Refresh)
  const handleReset = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setSearchQuery("");
      setFilterDepartment("");
      setCurrentPage(1);
      setProcessedEmployees(employees);
      setIsRefreshing(false);
    }, 1000);
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

      {/* Employee Table */}
      <div className="bg-white p-6 rounded-lg shadow mt-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse bg-white rounded-lg">
            <thead>
              <tr className="bg-blue-100 text-gray-800 text-sm">
                <th className="py-2 px-4">S/N</th>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Employee ID</th>
                <th className="py-2 px-4">Month</th>
                <th className="py-2 px-4">Hourly Rate</th>
                <th className="py-2 px-4">Total Hours</th>
                <th className="py-2 px-4">Basic Salary</th>
                <th className="py-2 px-4">Allowance</th>
                <th className="py-2 px-4">Deduction</th>
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
                    <td className="py-2 px-4">
                      {`${employee?.firstName || ""} ${employee?.lastName || ""
                        }`}
                    </td>
                    <td className="py-2 px-4">{employee?.employeeID || ""}</td>
                    <td className="py-2 px-4">{employee?.timesheet?.month || ""}</td>
                    <td className="py-2 px-4">{employee?.hourlyRate || "0.00"}</td>
                    <td className="py-2 px-4">
                      {employee?.timesheet?.totalHours || "0.00"}
                    </td>
                    <td className="py-2 px-4">{employee?.salary || "0.00"}</td>
                    <td className="py-2 px-4">
                      {employee?.timesheet?.allowance || "0.00"}
                    </td>
                    <td className="py-2 px-4">
                      {employee?.timesheet?.deduction || "0.00"}
                    </td>
                    <td className="py-2 px-4">
                      {employee?.netPayable || "0.00"}
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex justify-center gap-2">
                        {data?.permissions?.payroll?.create && (
                          <Link href={`/dashboard/payroll/${employee._id}`}>
                            <button className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600">
                              <FaMoneyCheckDollar />
                            </button>
                          </Link>
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