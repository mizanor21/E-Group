"use client";
import React, { useState } from "react";
import { SiApacheopenoffice } from "react-icons/si";
import { LiaFileDownloadSolid } from "react-icons/lia";
import { ImSpinner9 } from "react-icons/im";

const EmployeeSalaryTable = ({ employees }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");

  // Pagination logic
  const totalPages = Math.ceil(employees.length / rowsPerPage);
  const startRow = (currentPage - 1) * rowsPerPage;

  // Filter and search logic
  const filteredEmployees = employees.filter(
    (employee) =>
      (filterDepartment === "" || employee.department === filterDepartment) &&
      Object.values(employee)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const displayedEmployees = filteredEmployees.slice(
    startRow,
    startRow + rowsPerPage
  );

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">All Employees Salary</h1>

      <div className="lg:flex justify-between">
        {/* Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search Bar */}
          <div>
            <label className="text-sm font-medium text-gray-600">Search</label>
            <input
              type="text"
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
        {/* download button */}
        <div className="bg-white p-6 rounded-lg space-y-2 ">
          <button type="button" class=" btn flex gap-3 text-white w-44  py-2 rounded-2xl bg-gradient-to-r from-orange-600 to-blue-500 hover:from-pink-500 hover:to-orange-500 ...">
            <SiApacheopenoffice className="text-xl" />
            WPS
          </button>
          <button type="button" class=" btn flex gap-3 text-white w-44  py-2 rounded-2xl bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 ...">
            <LiaFileDownloadSolid className="text-xl" />
            Download
          </button>
          <button type="button" class=" btn flex gap-3 text-white w-44  py-2 rounded-2xl bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 ...">
            <ImSpinner9 className="text-xl" />
            Refresh
          </button>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white p-6 rounded-lg shadow">
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
              {displayedEmployees.length > 0 ? (
                displayedEmployees.map((employee, index) => (
                  <tr
                    key={employee.regNo}
                    className="border-t hover:bg-gray-100"
                  >
                    <td className="py-2 px-4">{startRow + index + 1}</td>
                    <td className="py-2 px-4">{employee.name}</td>
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
                        <button className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600">
                          Create Salary
                        </button>
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
                  <td
                    colSpan={11}
                    className="text-center py-4 text-gray-500 italic"
                  >
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
          >
            Previous
          </button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <button
                key={pageIndex}
                onClick={() => setCurrentPage(pageIndex + 1)}
                className={`px-4 py-2 rounded-lg ${currentPage === pageIndex + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                {pageIndex + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSalaryTable;
