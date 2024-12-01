"use client";
import React, { useState } from "react";
import { TbDetails } from "react-icons/tb";


const EmployeePayrollTable = ({ employees }) => {
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
            <h1 className="text-2xl font-bold mb-4">Employees Payroll History</h1>

            {/* Filter Section */}
            <div className="bg-white p-6 rounded-lg shadow  grid grid-cols-1 md:grid-cols-3 gap-6 ">
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

            {/* Employee Table */}
            <div className="bg-white p-6 rounded-lg shadow mt-10">
                {/* Employee Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse bg-white rounded-lg">
                        <thead>
                            <tr className="bg-blue-100 text-gray-800 ">
                                {["S/N", "Payment Name", "Designation", "Date Generated", "Payment Month", "Payment Year", "Status", "Action"].map((header) => (
                                    <th key={header} className="py-3 px-4 text-sm  text-gray-700 border-b font-semibold">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {displayedEmployees.length > 0 ? (
                                displayedEmployees.map((employee, index) => (
                                    <tr
                                        key={employee.regNo}
                                        className="border-t hover:bg-gray-50 transition-all"
                                    >
                                        <td className="py-3 px-4 text-sm text-gray-800">{startRow + index + 1}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{employee.paymentName}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{employee.designation}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{employee.daraGenerated}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{employee.paymentMonth}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{employee.paymentYear}</td>
                                        <td className="py-3 px-4">
                                            <details className="dropdown bg-purple-500 hover:bg-purple-800 px-2 text-white rounded">
                                                <summary className="m-1 cursor-pointer">Status</summary>
                                                <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-full text-black p-2 shadow">
                                                    <li><a>Pending</a></li>
                                                    <li><a>Due</a></li>
                                                    <li><a>Paid</a></li>
                                                </ul>
                                            </details>
                                        </td>
                                        <td className="py-3 px-4 w-32">
                                            <div className={`inline-flex justify-center items-center px-3 py-1 rounded-full gap-x-2 
                                        transition-all duration-200 hover:shadow-lg
                                        ${employee.status === 'Pending' && 'bg-orange-100/60 text-orange-500'} 
                                        ${employee.status === 'Due' && 'bg-rose-100/60 text-rose-500'} 
                                        ${employee.status === 'Paid' && 'bg-emerald-100/60 text-emerald-500'}`}>
                                                <span className={`h-1.5 w-1.5 rounded-full 
                                                     ${employee.status === 'Pending' && 'bg-orange-700'}
                                                     ${employee.status === 'Due' && 'bg-rose-700'}
                                                     ${employee.status === 'Paid' && 'bg-emerald-700'}`}>
                                                </span>
                                                <h2 className="truncate">{employee.status}</h2>
                                            </div>
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

export default EmployeePayrollTable;
