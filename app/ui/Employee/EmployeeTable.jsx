"use client";
import Link from "next/link";
import React, { useState } from "react";

const EmployeeTable = ({ employees }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("");

  // Pagination Logic
  const totalPages = Math.ceil(employees?.length / rowsPerPage);
  const startRow = (currentPage - 1) * rowsPerPage;

  // Handle displayed employees with search and filtering
  const displayedEmployees = employees
    ?.filter(
      (employee) =>
        (filterRole === "" || employee.role === filterRole) &&
        Object.values(employee)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    )
    .slice(startRow, startRow + rowsPerPage);

  // Handle changing rows per page
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  return (
    <div className="rounded-lg space-y-5">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Search Bar */}
        <div className="relative col-span-2 lg:col-span-1">
          <label htmlFor="search" className="text-sm font-medium text-gray-600">
            Quick Search an Employee
          </label>
          <div className="relative mt-2">
            <input
              type="text"
              id="search"
              placeholder="Search Employee"
              className="border px-4 py-2 pl-10 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-3 top-3 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M15 11a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </span>
          </div>
        </div>

        {/* Total Employees */}
        <div className="text-center col-span-1">
          <h2 className="text-3xl font-bold">{employees?.length}</h2>
          <p className="text-sm text-gray-500">Total Employees</p>
        </div>

        {/* Filter Role */}
        <div className="col-span-1">
          <label
            htmlFor="filterRole"
            className="text-sm font-medium text-gray-600"
          >
            Filter by Role
          </label>
          <select
            id="filterRole"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full mt-2"
          >
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
          </select>
        </div>

        {/* Add Employee Button */}
        <div className="flex items-center justify-end col-span-1">
          <Link
            href={"/dashboard/add-employee"}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition"
          >
            Add New Employee
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">All Employee</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Showing</span>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="border px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm text-gray-600">per page</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse bg-white rounded-lg">
            <thead>
              <tr className="bg-blue-100 text-gray-800">
                <th className="py-2 px-4">S/N</th>
                <th className="py-2 px-4">First Name</th>
                <th className="py-2 px-4">Last Name</th>
                <th className="py-2 px-4">Gender</th>
                <th className="py-2 px-4">Employee ID</th>
                <th className="py-2 px-4">Phone Number</th>
                <th className="py-2 px-4">Role</th>
                <th className="py-2 px-4">Department</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedEmployees?.length > 0 ? (
                displayedEmployees.map((employee, index) => (
                  <tr
                    key={employee.employeeID}
                    className="border-t hover:bg-gray-100"
                  >
                    <td className="py-2 px-4">{startRow + index + 1}</td>
                    <td className="py-2 px-4">{employee.firstName}</td>
                    <td className="py-2 px-4">{employee.lastName}</td>
                    <td className="py-2 px-4">{employee.gender}</td>
                    <td className="py-2 px-4">{employee.employeeID}</td>
                    <td className="py-2 px-4">{employee.phoneNumber}</td>
                    <td className="py-2 px-4">{employee.role}</td>
                    <td className="py-2 px-4">{employee.department}</td>
                    <td className="py-2 px-4">
                      <button className="text-blue-500 hover:underline">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
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
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
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
                className={`px-4 py-2 rounded-lg ${
                  currentPage === pageIndex + 1
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
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
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

export default EmployeeTable;
