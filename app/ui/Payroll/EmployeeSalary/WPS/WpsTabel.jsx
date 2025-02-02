"use client";

import { useState, useEffect } from "react";
import { LiaFileDownloadSolid } from "react-icons/lia";
import { ImSpinner9 } from "react-icons/im";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";

const SalaryTable = ({ employees, closeModal }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  const [filterMonth, setFilterMonth] = useState(() => {
    const currentMonth = new Date().toISOString().slice(0, 7); // Format: YYYY-MM
    return currentMonth;
  });
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterProject, setFilterProject] = useState("");

  const rowsPerPage = 5;

  useEffect(() => {
    const filtered = employees
      .filter((employee) => {
        const matchingMonthSalary = employee.salaries.find(
          (salary) => !filterMonth || salary.month === filterMonth
        );
        return (
          matchingMonthSalary &&
          (!filterDepartment || employee.department === filterDepartment) &&
          (!filterProject || employee.project === filterProject)
        );
      })
      .map((employee) => ({
        ...employee,
        salaries: employee.salaries.filter(
          (salary) => !filterMonth || salary.month === filterMonth
        ),
      }));
    setFilteredEmployees(filtered);
    setCurrentPage(1);
  }, [employees, filterMonth, filterDepartment, filterProject]);

  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
  const startRow = (currentPage - 1) * rowsPerPage;
  const displayedEmployees = filteredEmployees.slice(
    startRow,
    startRow + rowsPerPage
  );

  const handleReset = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setFilterMonth("");
      setFilterDepartment("");
      setFilterProject("");
      setCurrentPage(1);
      setIsRefreshing(false);
    }, 1000);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Employee ID",
      "Name",
      "Month",
      "Base Salary",
      "Overtime",
      "Allowances",
      "Deductions",
      "Net Salary",
    ];
    const tableRows = filteredEmployees.flatMap((employee) =>
      employee.salaries.map((salary) => [
        employee.employeeId,
        employee.name,
        salary.month,
        salary.baseSalary,
        salary.overtime.normal.earning + salary.overtime.holiday.earning,
        salary.allowances.total,
        salary.deductions.total,
        salary.netSalary,
      ])
    );

    doc.text("Employee Salary List", 14, 15);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
    });
    doc.save("Employee_Salary_List.pdf");
  };

  const maxPageButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (endPage - startPage < maxPageButtons - 1) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  return (
    <div className="bg-gray-100 p-2">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Salary Information</h1>
        <button
          onClick={closeModal}
          className="text-2xl bg-white p-1 rounded mb-2 text-gray-500 hover:text-rose-500 focus:outline-none"
        >
          <RxCross1 />
        </button>
      </div>

      <div className="lg:flex lg:gap-4 justify-between items-center mb-4">
        <div className="flex flex-wrap gap-2">
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="border rounded px-2 py-1"
            placeholder="Filter by Month"
          />
          <input
            type="text"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="border rounded px-2 py-1"
            placeholder="Filter by Department"
          />
          <input
            type="text"
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="border rounded px-2 py-1"
            placeholder="Filter by Project"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDownloadPDF}
            className="btn flex gap-3 text-white px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-800 hover:from-green-800 hover:to-green-400"
          >
            <LiaFileDownloadSolid className="text-xl" />
            Download
          </button>
          <button
            onClick={handleReset}
            className="btn flex gap-3 text-white px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-800 hover:to-blue-400"
          >
            <ImSpinner9
              className={`text-xl ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse bg-white rounded-lg">
            <thead>
              <tr className="bg-blue-100 text-gray-800 text-sm">
                <th className="py-2 px-4">Employee ID</th>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Month</th>
                <th className="py-2 px-4">Base Salary</th>
                <th className="py-2 px-4">Overtime</th>
                <th className="py-2 px-4">Allowances</th>
                <th className="py-2 px-4">Deductions</th>
                <th className="py-2 px-4">Net Salary</th>
              </tr>
            </thead>
            <tbody>
              {displayedEmployees.length > 0 ? (
                displayedEmployees.flatMap((employee) =>
                  employee.salaries.map((salary, index) => (
                    <tr
                      key={`${employee.employeeId}-${salary.month}`}
                      className="border-t hover:bg-gray-100 text-sm"
                    >
                      <td className="py-2 px-4">{employee.employeeId}</td>
                      <td className="py-2 px-4">{employee.name}</td>
                      <td className="py-2 px-4">{salary.month}</td>
                      <td className="py-2 px-4">{salary.baseSalary}</td>
                      <td className="py-2 px-4">
                        {salary.overtime.normal.earning +
                          salary.overtime.holiday.earning}
                      </td>
                      <td className="py-2 px-4">{salary.allowances.total}</td>
                      <td className="py-2 px-4">{salary.deductions.total}</td>
                      <td className="py-2 px-4">{salary.netSalary}</td>
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-4 text-gray-500 italic"
                  >
                    No salary records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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

export default SalaryTable;
