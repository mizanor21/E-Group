"use client";
import React, { useState, useEffect } from "react";
import { LiaFileDownloadSolid } from "react-icons/lia";
import { ImSpinner9 } from "react-icons/im";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { CloudDownloadIcon } from "lucide-react";

const EmployeePayslipsTable = ({ employees }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterMonth, setFilterMonth] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Process and flatten the data structure
    const processEmployeeData = () => {
        const flattenedData = [];
        
        employees?.forEach(employee => {
            if (employee.salaries && employee.salaries.length > 0) {
                employee.salaries.forEach(salary => {
                    flattenedData.push({
                        employeeId: employee.employeeId,
                        name: employee.name,
                        salaryMonth: salary.month,
                        baseSalary: salary.baseSalary,
                        allowance: salary.allowances?.total || 0,
                        otherEarnings: salary.otherEarnings?.total || 0,
                        deduction: salary.deductions?.total || 0,
                        grossSalary: salary.baseSalary + (salary.allowances?.total || 0) + (salary.otherEarnings?.total || 0),
                        netSalary: salary.netSalary,
                        workingDays: salary.workingDays
                    });
                });
            }
        });
        
        return flattenedData;
    };

    const [processedEmployees, setProcessedEmployees] = useState([]);
    const [availableMonths, setAvailableMonths] = useState([]);

    useEffect(() => {
        const processed = processEmployeeData();
        setProcessedEmployees(processed);
        
        // Extract unique months for filter dropdown
        const months = [...new Set(processed.map(emp => emp.salaryMonth))].sort();
        setAvailableMonths(months);
    }, [employees]);

    // Pagination and filtering logic
    const filteredEmployees = processedEmployees.filter(
        (employee) => {
            const matchesMonth = filterMonth === "" || employee.salaryMonth === filterMonth;
            const matchesSearch = Object.values(employee)
                .join(" ")
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            
            return matchesMonth && matchesSearch;
        }
    );

    const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
    const startRow = (currentPage - 1) * rowsPerPage;
    const displayedEmployees = filteredEmployees.slice(startRow, startRow + rowsPerPage);

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    // Reset Function (Refresh)
    const handleReset = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setSearchQuery("");
            setFilterMonth("");
            setCurrentPage(1);
            setIsRefreshing(false);
        }, 1000);
    };

    // Format the salary month for better display
    const formatSalaryMonth = (monthStr) => {
        if (!monthStr) return "";
        try {
            const [year, month] = monthStr.split("-");
            const date = new Date(parseInt(year), parseInt(month) - 1);
            return date.toLocaleString('default', { month: 'long', year: 'numeric' });
        } catch (e) {
            return monthStr;
        }
    };

    // Format currency values
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0 
        }).format(amount);
    };

    // Download PDF for all employees
    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const tableColumn = [
            "S/N",
            "EID",
            "Name",
            "Month",
            "Base Salary",
            "Allowance",
            "Other Earnings",
            "Deduction",
            "Gross Salary",
            "Net Salary",
        ];
        const tableRows = filteredEmployees.map((employee, index) => [
            index + 1,
            employee.employeeId,
            employee.name,
            formatSalaryMonth(employee.salaryMonth),
            formatCurrency(employee.baseSalary),
            formatCurrency(employee.allowance),
            formatCurrency(employee.otherEarnings),
            formatCurrency(employee.deduction),
            formatCurrency(employee.grossSalary),
            formatCurrency(employee.netSalary),
        ]);

        const title = filterMonth ? 
            `Employee Payslips - ${formatSalaryMonth(filterMonth)}` : 
            'Employee Payslips List';
            
        doc.text(title, 14, 15);
        autoTable(doc,{
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { fontSize: 9 },
        });
        doc.save("Employee_Payslips_List.pdf");
    };

    // Download PDF for individual employee
    const handleDownloadIndividualPDF = (employee) => {
        const doc = new jsPDF();
        doc.text(`Payslip for ${employee.name}`, 14, 15);
        doc.text(`Month: ${formatSalaryMonth(employee.salaryMonth)}`, 14, 25);
        
        autoTable(doc,{
            head: [["Field", "Value"]],
            body: [
                ["Employee ID", employee.employeeId],
                ["Name", employee.name],
                ["Working Days", employee.workingDays],
                ["Base Salary", formatCurrency(employee.baseSalary)],
                ["Allowances", formatCurrency(employee.allowance)],
                ["Other Earnings", formatCurrency(employee.otherEarnings)],
                ["Gross Salary", formatCurrency(employee.grossSalary)],
                ["Deductions", formatCurrency(employee.deduction)],
                ["Net Salary", formatCurrency(employee.netSalary)],
            ],
            startY: 35,
            styles: { fontSize: 10 },
        });
        doc.save(`Payslip_${employee.employeeId}_${employee.salaryMonth}.pdf`);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4">Employees Payslips History</h1>

            <div className="lg:flex lg:gap-20 justify-between">
                {/* Filter Section */}
                <div className="lg:w-[70%] bg-white p-6 rounded-lg shadow grid grid-cols-1 md:grid-cols-3 gap-6">
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

                    {/* Filter by Month */}
                    <div>
                        <label className="text-sm font-medium text-gray-600">
                            Filter by Month
                        </label>
                        <select
                            value={filterMonth}
                            onChange={(e) => setFilterMonth(e.target.value)}
                            className="mt-2 block w-full border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
                        >
                            <option value="">All Months</option>
                            {availableMonths.map(month => (
                                <option key={month} value={month}>
                                    {formatSalaryMonth(month)}
                                </option>
                            ))}
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

                {/* Download and Refresh Buttons */}
                <div className="bg-white px-6 py-3 rounded-lg shadow mt-4 lg:mt-0 flex flex-col gap-2">
                    <button
                        onClick={handleDownloadPDF}
                        className="btn flex items-center justify-center gap-3 text-white w-full lg:w-44 py-2 rounded-2xl bg-gradient-to-r from-green-500 to-green-800 hover:from-green-800 hover:to-green-400"
                    >
                        <LiaFileDownloadSolid className="text-xl" />
                        Download All
                    </button>
                    <button
                        onClick={handleReset}
                        className="btn flex items-center justify-center gap-3 text-white w-full lg:w-44 py-2 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-800 hover:to-blue-400"
                    >
                        <ImSpinner9 className={`text-xl ${isRefreshing ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Employee Table */}
            <div className="bg-white p-6 rounded-lg shadow mt-10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse bg-white rounded-lg">
                        <thead>
                            <tr className="bg-blue-100 text-gray-800">
                                <th className="py-2 px-4">S/N</th>
                                <th className="py-2 px-4">EID</th>
                                <th className="py-2 px-4">Name</th>
                                <th className="py-2 px-4">Month</th>
                                <th className="py-2 px-4">Base Salary</th>
                                <th className="py-2 px-4">Allowance</th>
                                <th className="py-2 px-4">Deduction</th>
                                <th className="py-2 px-4">Gross</th>
                                <th className="py-2 px-4">Net</th>
                                <th className="py-2 px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedEmployees.length > 0 ? (
                                displayedEmployees.map((employee, index) => (
                                    <tr key={`${employee.employeeId}-${employee.salaryMonth}`} className="border-t hover:bg-gray-100">
                                        <td className="py-2 px-4">{startRow + index + 1}</td>
                                        <td className="py-2 px-4">{employee.employeeId}</td>
                                        <td className="py-2 px-4">{employee.name}</td>
                                        <td className="py-2 px-4">{formatSalaryMonth(employee.salaryMonth)}</td>
                                        <td className="py-2 px-4">{formatCurrency(employee.baseSalary)}</td>
                                        <td className="py-2 px-4">{formatCurrency(employee.allowance)}</td>
                                        <td className="py-2 px-4">{formatCurrency(employee.deduction)}</td>
                                        <td className="py-2 px-4">{formatCurrency(employee.grossSalary)}</td>
                                        <td className="py-2 px-4">{formatCurrency(employee.netSalary)}</td>
                                        <td className="py-2 px-4 flex justify-center">
                                            <button onClick={() => handleDownloadIndividualPDF(employee)}>
                                                <CloudDownloadIcon className="text-blue-500 hover:text-blue-700 cursor-pointer" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={10} className="text-center py-4 text-gray-500 italic">
                                        No payslips found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-wrap justify-between items-center mt-6">
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
                    <div className="flex flex-wrap gap-2 my-2">
                        {totalPages <= 5 ? (
                            // Show all pages if 5 or fewer
                            Array.from({ length: totalPages }).map((_, pageIndex) => (
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
                            ))
                        ) : (
                            // Show limited pages with ellipsis for large page counts
                            <>
                                {/* First page */}
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    className={`px-4 py-2 rounded-lg ${currentPage === 1
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                >
                                    1
                                </button>
                                
                                {/* Ellipsis or page numbers before current */}
                                {currentPage > 3 && <span className="px-2 py-2">...</span>}
                                
                                {/* Pages around current page */}
                                {Array.from({ length: 3 }, (_, i) => {
                                    const pageNum = Math.max(2, currentPage - 1) + i;
                                    if (pageNum > 1 && pageNum < totalPages) {
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`px-4 py-2 rounded-lg ${currentPage === pageNum
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    }
                                    return null;
                                })}
                                
                                {/* Ellipsis or page numbers after current */}
                                {currentPage < totalPages - 2 && <span className="px-2 py-2">...</span>}
                                
                                {/* Last page */}
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    className={`px-4 py-2 rounded-lg ${currentPage === totalPages
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}
                    </div>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className={`px-4 py-2 rounded-lg ${currentPage === totalPages || totalPages === 0
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                    >
                        Next
                    </button>
                </div>
                
                {/* Statistics summary */}
                <div className="mt-6 text-sm text-gray-600">
                    Showing {displayedEmployees.length} of {filteredEmployees.length} payslips
                    {filterMonth && ` for ${formatSalaryMonth(filterMonth)}`}
                </div>
            </div>
        </div>
    );
};

export default EmployeePayslipsTable;