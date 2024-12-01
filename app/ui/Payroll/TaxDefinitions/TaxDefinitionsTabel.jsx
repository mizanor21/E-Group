"use client";
import React, { useState } from "react";
import CreateTaxModal from "../../component/Modal/CreateTaxModal";

const TaxDefinitionsTabel = ({ employees }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [employee, setEmployee] = useState(employees);

    // Pagination logic
    const totalPages = Math.ceil(employee.length / rowsPerPage);
    const startRow = (currentPage - 1) * rowsPerPage;
    const paginatedEmployees = employee.slice(startRow, startRow + rowsPerPage);

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    // Function to add new tax data to the list
    const addNewTax = (newTax) => {
        setEmployee((prevEmployee) => [...prevEmployee, newTax]);
    };

    const handleOpenModal = () => {
        setIsOpenModal(true);
    };

    const handleCloseModal = () => {
        setIsOpenModal(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="lg:flex justify-between items-center">
                <h1 className="text-2xl font-bold mb-4">Tax Definitions</h1>
                <button
                    onClick={handleOpenModal}
                    className="btn text-white rounded-lg hover:bg-transparent border-none transition-all duration-300 bg-gradient-to-r from-[#56a7d9] to-[#0a76db] hover:from-[#228cef] hover:to-[#5ccae8]"
                >
                    Create Tax Definitions
                </button>
            </div>

            {/* Employee Table */}
            <div className="bg-white p-6 rounded-lg shadow mt-10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse bg-white rounded-lg">
                        <thead>
                            <tr className="bg-blue-100 text-gray-800">
                                <th className="py-2 px-4">S/N</th>
                                <th className="py-2 px-4">Tax Type</th>
                                <th className="py-2 px-4">% Value</th>
                                <th className="py-2 px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedEmployees?.length > 0 ? (
                                paginatedEmployees.map((employee, index) => (
                                    <tr
                                        key={employee.regNo}
                                        className="border-t hover:bg-gray-100"
                                    >
                                        <td className="py-2 px-4">{startRow + index + 1}</td>
                                        <td className="py-2 px-4">{employee.taxType}</td>
                                        <td className="py-2 px-4">{employee.value}</td>
                                        <td className="py-2 px-4">
                                            <div className="flex gap-2">
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
                                        colSpan={4}
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

            {/* Rows Per Page */}
            <div className="mt-4">
                <label htmlFor="rowsPerPage" className="mr-2">
                    Rows per page:
                </label>
                <select
                    id="rowsPerPage"
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    className="border rounded px-3 py-2"
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>

            {/* Modal */}
            {isOpenModal &&
                <CreateTaxModal
                    onClose={handleCloseModal}
                    addNewTax={addNewTax} />}
        </div>
    );
};

export default TaxDefinitionsTabel;
