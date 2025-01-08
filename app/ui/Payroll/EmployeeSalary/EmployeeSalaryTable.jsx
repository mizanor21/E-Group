"use client";
import React, { useState } from "react";
import { SiApacheopenoffice } from "react-icons/si";
import { LiaFileDownloadSolid } from "react-icons/lia";
import { ImSpinner9 } from "react-icons/im";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Link from "next/link";
import WpsModal from "./WPS/WpsModal";

const EmployeeSalaryTable = ({ employees }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination logic
  const totalPages = Math.ceil(employees?.length / rowsPerPage);
  const startRow = (currentPage - 1) * rowsPerPage;

  // Filter and search logic
  const filteredEmployees = employees?.filter(
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
      setIsRefreshing(false);
    }, 1000);
  };

  // Download PDF Function
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "S/N",
      "Name",
      "Reg No",
      "OP BAL",
      "Salary",
      "Over Time",
      "Allowance",
      "Gross Pay",
      "Deduction",
      "Net Payable",
    ];
    const tableRows = employees.map((employee, index) => [
      index + 1,
      employee.name,
      employee.regNo,
      employee.opBal,
      employee.salary,
      employee.overtime,
      employee.allowance,
      employee.grossPay,
      employee.deduction,
      employee.netPayable,
    ]);

    doc.text("Employee Salary List", 14, 15);

    // Generate table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: {
        fontSize: 10,
      },
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

          {/* Rows per Page */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Rows per Page
            </label>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="mt-2 block w-full border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>

        {/* Download and Reset Buttons */}
        <div className="bg-white px-6 py-3 rounded-lg space-y-1">
          <button
            onClick={openModal}
            type="button"
            className="btn flex gap-3 text-white w-28 lg:w-44 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-800 hover:to-orange-500"
          >
            <SiApacheopenoffice className="text-xl" />
            WPS
          </button>
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

      {/* /* Employee Table  */}
      <div className="bg-white p-6 rounded-lg shadow mt-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse bg-white rounded-lg">
            <thead>
              <tr className="bg-blue-100 text-gray-800">
                <th className="py-2 px-4">S/N</th>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Reg No</th>
                <th className="py-2 px-4">OP BAL</th>
                <th className="py-2 px-4">Salary</th>
                <th className="py-2 px-4">Over Time</th>
                <th className="py-2 px-4">Allowance</th>
                <th className="py-2 px-4">Gross Pay</th>
                <th className="py-2 px-4">Deduction</th>
                <th className="py-2 px-4">Net Payable</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedEmployees?.length > 0 ? (
                displayedEmployees.map((employee, index) => (
                  <tr
                    key={employee.regNo}
                    className="border-t hover:bg-gray-100"
                  >
                    <td className="py-2 px-4">{startRow + index + 1}</td>
                    <td className="py-2 px-4">{`${employee?.firstName} ${employee?.lastName}`}</td>
                    <td className="py-2 px-4">{employee.regNo}</td>
                    <td className="py-2 px-4">{employee.opBal}</td>
                    <td className="py-2 px-4">{employee.salary}</td>
                    <td className="py-2 px-4">{employee.overtime}</td>
                    <td className="py-2 px-4">{employee.allowance}</td>
                    <td className="py-2 px-4">{employee.grossPay}</td>
                    <td className="py-2 px-4">{employee.deduction}</td>
                    <td className="py-2 px-4">{employee.netPayable}</td>
                    <td className="py-2 px-4">
                      <div className="flex gap-2">
                        <Link href={"create-salary"}>
                          <button className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600">
                            Create Salary
                          </button>
                        </Link>
                        <button className="text-blue-500 hover:underline text-sm">
                          Edit
                        </button>
                        <button className="text-red-500 hover:underline text-sm">
                          Delete
                        </button>
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
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 ${
              currentPage === 1 && "opacity-50 cursor-not-allowed"
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 ${
              currentPage === totalPages && "opacity-50 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* WPS Modal */}
      {isModalOpen && <WpsModal closeModal={closeModal} />}
    </div>
  );
};

export default EmployeeSalaryTable;
