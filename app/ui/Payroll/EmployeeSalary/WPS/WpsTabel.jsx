"use client";

import { useState, useEffect } from "react";
import { ImSpinner9 } from "react-icons/im";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { utils } from "xlsx";
import { useForm } from "react-hook-form";
// import SummarySection from "./summary-section"

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
  const [totalSalaries, setTotalSalaries] = useState(""); // Added state for totalSalaries
  const [totalRecords, setTotalRecords] = useState(""); // Added state for totalRecords

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
    setTotalSalaries(
      filtered
        .reduce(
          (sum, emp) =>
            sum + emp.salaries.reduce((s, sal) => s + sal.netSalary, 0),
          0
        )
        .toString()
    ); // Calculate totalSalaries
    setTotalRecords(filtered.length.toString()); // Calculate totalRecords
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
      const currentMonth = new Date().toISOString().slice(0, 7);
      setFilterMonth(currentMonth);
      setFilterDepartment("");
      setFilterProject("");
      setCurrentPage(1);
      setIsRefreshing(false);
    }, 1000);
  };

  const now = new Date();
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      employerEID: "17219975",
      fileCreationDate: new Date().toISOString().slice(0, 10),
      fileCreationTime: `${now.getHours()}${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`,
      payerEID: "17198214",
      payerQID: "",
      payerBankName: "QNB",
      payerIBAN: "QA32QNBA0000000",
      // salaryYearMonth: filterMonth.replace(/-/g, ""),
      // totalSalaries: totalSalaries, // Use the state variable
      // totalRecords: totalRecords, // Use the state variable
    },
  });

  const handleDownloadExcel = (formData) => {
    // Create header rows for payer information
    const headerRows = [
      {
        "Employer EID": formData.employerEID,
        "File Creation Date": formData.fileCreationDate.replace(/-/g, ""),
        "File Creation Time": formData.fileCreationTime,
        "Payer EID": formData.payerEID,
        "Payer QID": formData.payerQID,
        "Payer Bank Short Name": formData.payerBankName,
        "Payer IBAN": formData.payerIBAN,
        "Salary Year and Month": filterMonth,
        "Total Salaries": totalSalaries,
        "Total Records": totalRecords,
      },
      {}, // Empty row for spacing
    ];

    // Create employee data rows
    const employeeRows = filteredEmployees.flatMap((employee, index) =>
      employee.salaries.map((salary) => ({
        "Record Sequence": (index + 1).toString(),
        "Employee QID": employee.employeeId,
        "Employee Visa ID": "",
        "Employee Name": employee.name,
        "Employee Bank Short Name": employee.payerBank || "QNB",
        "Employee Account": employee.payerIban || "",
        "Salary Frequency": "M",
        "Number of Working days": salary.workingDays,
        "Net Salary": salary.netSalary,
        "Basic Salary": salary.baseSalary,
        "Extra hours":
          salary.overtime.normal.hours + salary.overtime.holiday.hours,
        "Extra income":
          salary.overtime.normal.earning + salary.overtime.holiday.earning,
        Deductions: salary.deductions.total,
        "Payment Type": "SALARY",
        "Notes / Comments": "",
      }))
    );

    // Combine header and employee data
    const wsData = [
      ...headerRows.filter((row) => Object.keys(row).length > 0),
      ...employeeRows,
    ];

    // Create workbook and worksheet
    const wb = utils.book_new();
    const ws = utils.json_to_sheet([]); // Start with an empty sheet

    // Append headerRows first
    utils.sheet_add_json(ws, headerRows, { skipHeader: false, origin: "A1" });

    // Append employeeRows starting from a new row (e.g., after the last header row)
    utils.sheet_add_json(ws, employeeRows, { skipHeader: false, origin: 2 });

    // Add worksheet to workbook
    utils.book_append_sheet(wb, ws, "Sheet1");

    // Generate dynamic filename
    const now = new Date();
    const dateStr = formData.fileCreationDate.replace(/-/g, "");

    const timeStr = formData.fileCreationTime;

    const fileName = `SIF_${formData.employerEID}_${formData.payerBankName}_${dateStr}_${timeStr}.csv`;

    // Convert to CSV and download
    const csvContent = utils.sheet_to_csv(ws);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const maxPageButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (endPage - startPage < maxPageButtons - 1) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  return (
    <div className="bg-gray-100 p-2 max-h-[600px] overflow-scroll">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">WPS Information</h1>
        <button
          onClick={closeModal}
          className="text-2xl bg-white p-1 rounded mb-2 text-gray-500 hover:text-rose-500 focus:outline-none"
        >
          <RxCross1 />
        </button>
      </div>

      <div className="lg:flex lg:gap-4 justify-between items-center">
        {/* Payer Information */}
        <div className="border border-gray-300 rounded-lg p-5 shadow-sm">
          <h3 className="text-base font-semibold">Payer Information</h3>
          <form onSubmit={handleSubmit(handleDownloadExcel)}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {[
                {
                  label: "Employer EID",
                  name: "employerEID",
                  type: "text",
                  placeholder: "Enter Employer EID",
                },
                {
                  label: "File Creation Date",
                  name: "fileCreationDate",
                  type: "date",
                },
                {
                  label: "File Creation Time",
                  name: "fileCreationTime",
                  type: "text",
                  placeholder: "HHMM",
                },
                {
                  label: "Payer EID",
                  name: "payerEID",
                  type: "text",
                  placeholder: "Enter Payer EID",
                },
                {
                  label: "Payer QID",
                  name: "payerQID",
                  type: "text",
                  placeholder: "Enter Payer QID",
                },
                {
                  label: "Payer Bank Name",
                  name: "payerBankName",
                  type: "text",
                  placeholder: "Enter Payer Bank Name",
                },
                {
                  label: "Payer IBAN",
                  name: "payerIBAN",
                  type: "text",
                  placeholder: "Enter Payer IBAN",
                },
                // {
                //   label: "Salary Year and Month",
                //   name: "salaryYearMonth",
                //   type: "text",
                //   placeholder: "YYYYMM",
                // },
                // {
                //   label: "Total Salaries",
                //   name: "totalSalaries",
                //   type: "text",
                //   placeholder: "Enter total salaries",
                // },
                // {
                //   label: "Total Records",
                //   name: "totalRecords",
                //   type: "text",
                //   placeholder: "Enter total records",
                // },
              ].map((input, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700">
                    {input.label}
                  </label>
                  <input
                    {...register(input.name)}
                    type={input.type}
                    placeholder={input.placeholder}
                    className="mt-1 block w-full rounded px-3 py-2 focus:border-sky-500 focus:ring-sky-500 focus:outline-none sm:text-sm border border-gray-300"
                  />
                </div>
              ))}
            </div>

            {/* Download and Reset Buttons */}
            <div className="flex justify-end items-center mt-5 rounded-lg gap-2">
              <button
                type="submit"
                className="btn flex gap-3 text-white lg:w-44 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-800 hover:to-green-400"
              >
                Download Excel
              </button>
              <button
                onClick={handleReset}
                type="button"
                className="btn flex gap-3 text-white lg:w-44 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-800 hover:to-blue-400"
              >
                <ImSpinner9
                  className={`text-xl ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Filtering options */}
      <div className="my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div>
          <label
            htmlFor="filterMonth"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Filter by Month
          </label>
          <input
            id="filterMonth"
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="filterDepartment"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Filter by Department
          </label>
          <input
            id="filterDepartment"
            type="text"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter department"
          />
        </div>
        <div>
          <label
            htmlFor="filterProject"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Filter by Project
          </label>
          <input
            id="filterProject"
            type="text"
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter project"
          />
        </div>
      </div>

      {/* Add the SummarySection here, just before the Employee Table */}
      {/* <SummarySection totalSalaries={totalSalaries} totalRecords={totalRecords} filterMonth={filterMonth} /> */}

      {/* Employee Table */}
      <div className="bg-white p-4 rounded-lg shadow mt-10">
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
