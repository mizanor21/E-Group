"use client";
import React, { useState } from "react";
import { LiaFileDownloadSolid } from "react-icons/lia";
import { ImSpinner9 } from "react-icons/im";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { useSalaryData } from "@/app/data/DataFetch";

const WpsTable = ({ employees, closeModal }) => {
  const { data, error, isLoading } = useSalaryData();
  console.log(data, error, isLoading);

  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const rowsPerPage = 5; // Set the number of rows per page

  // Pagination logic
  const totalPages = Math.ceil(employees.length / rowsPerPage);
  const startRow = (currentPage - 1) * rowsPerPage;

  const displayedEmployees = employees.slice(startRow, startRow + rowsPerPage);

  // Reset Function (Refresh)
  const handleReset = () => {
    setIsRefreshing(true);
    setTimeout(() => {
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

  // Pagination logic for 5 page buttons at a time
  const maxPageButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (endPage - startPage < maxPageButtons - 1) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  return (
    <div className="bg-gray-100 p-2">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold ">WPS Information</h1>
        <button
          onClick={closeModal}
          className="text-2xl bg-white p-1 rounded mb-2  text-gray-500 hover:text-rose-500 focus:outline-none"
        >
          <RxCross1 />
        </button>
      </div>
      <div className="lg:flex lg:gap- justify-between items-center">
        {/* Filter Input field */}
        <div>
          <div className="border border-gray-300 rounded-lg p-5 shadow-sm">
            <h3 className="text-base font-semibold">Payer Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {[
                {
                  label: "Employer EID",
                  type: "number",
                  placeholder: "Enter Employer EID",
                },
                {
                  label: "Payer EID",
                  type: "number",
                  placeholder: "Enter Payer EID",
                },
                {
                  label: "Payer QID",
                  type: "number",
                  placeholder: "Enter Payer QID",
                },
                {
                  label: "Payer Bank Name",
                  type: "text",
                  placeholder: "Enter Payer Bank Name",
                },
                {
                  label: "Payer IBAN",
                  type: "text",
                  placeholder: "Enter Payer IBAN",
                },
                { label: "Salary Creation Date", type: "date" },
                {
                  label: "Total Salaries",
                  type: "number",
                  placeholder: "Enter total salaries",
                },
                {
                  label: "Total Records",
                  type: "number",
                  placeholder: "Enter total record",
                },
                { label: "File creation Date", type: "date" },
              ].map((input, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700">
                    {input.label}
                  </label>
                  <input
                    type={input.type}
                    placeholder={input.placeholder}
                    className="mt-1 block w-full rounded px-3 py-2 focus:border-sky-500 focus:ring-sky-500 focus:outline-none sm:text-sm border border-gray-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Download and Reset Buttons */}
        <div className="p-3 rounded-lg space-y-2">
          <button
            onClick={handleDownloadPDF}
            type="button"
            className="btn flex gap-3 text-white lg:w-44 rounded-2xl bg-gradient-to-r from-green-500 to-green-800 hover:from-green-800 hover:to-green-400"
          >
            <LiaFileDownloadSolid className="text-xl" />
            Download
          </button>
          <button
            onClick={handleReset}
            type="button"
            className="btn flex gap-3 text-white  lg:w-44 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-800 hover:to-blue-400"
          >
            <ImSpinner9
              className={`text-xl ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white p-4 rounded-lg shadow mt-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse bg-white rounded-lg">
            <thead>
              <tr className="bg-blue-100 text-gray-800 text-sm">
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
              </tr>
            </thead>
            <tbody>
              {displayedEmployees.length > 0 ? (
                displayedEmployees.map((employee, index) => (
                  <tr
                    key={employee.regNo}
                    className="border-t hover:bg-gray-100 text-sm"
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={10}
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
        <div className="flex justify-evenly items-center mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            <FaLongArrowAltLeft />
          </button>

          {/* Pagination Buttons */}
          <div className="flex gap-2">
            {Array.from({ length: Math.min(maxPageButtons, totalPages) }).map(
              (_, index) => {
                const pageNumber = startPage + index;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-1.5 rounded-lg ${
                      currentPage === pageNumber
                        ? "bg-orange-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              }
            )}
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
            <FaLongArrowAltRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WpsTable;
