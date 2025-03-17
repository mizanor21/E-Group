import React from "react";
import { format } from "date-fns";

const numberToWords = (num) => {
  // This is a simple implementation. For a more robust solution, consider using a library like "number-to-words"
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
  if (num < 1000) return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " and " + numberToWords(num % 100) : "");
  if (num < 1000000) return numberToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + numberToWords(num % 1000) : "");
  return numberToWords(Math.floor(num / 1000000)) + " Million" + (num % 1000000 ? " " + numberToWords(num % 1000000) : "");
};

const SalaryModal = ({ closeModal, salaryData }) => {
  // Format the date (YYYY-MM to Month YYYY)
  const formatSalaryDate = (dateString) => {
    if (!dateString) return "";
    try {
      const [year, month] = dateString.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      return format(date, "MMMM yyyy");
    } catch (e) {
      return dateString;
    }
  };

  // Calculate totals
  const totalAllowances = Object.values(salaryData.allowances).reduce((sum, value) => 
    sum + (Number(value) || 0), 0);
  const totalDeductions = Object.values(salaryData.deductions).reduce((sum, value) => 
    sum + (Number(value) || 0), 0);
  const totalOtherEarnings = Object.values(salaryData.otherEarnings).reduce((sum, value) => 
    sum + (Number(value) || 0), 0);
  const totalOvertime = salaryData.overtime.normal.earning + salaryData.overtime.holiday.earning;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US').format(amount || 0);
  };

  // Handle actions
  const handleDownload = () => {
    console.log("Payslip downloaded");
    closeModal();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">Salary Payslip</h1>
              <p className="text-sm opacity-90">{formatSalaryDate(salaryData.month)}</p>
            </div>
            <div>
              <button
                onClick={closeModal}
                className="rounded-full p-1 hover:bg-white hover:bg-opacity-20 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Employee Info */}
        <div className="p-5 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-bold text-lg">{salaryData.name}</h2>
              <p className="text-gray-500 text-sm">Employee ID: {salaryData.employeeId}</p>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <p className="text-xs text-blue-700">Working Days / Hours</p>
              <p className="font-bold text-lg text-blue-900">{salaryData.workingDays || 0}</p>
            </div>
          </div>
        </div>
        
        {/* Key Salary Information */}
        <div className="p-5">
          {/* Big Net Salary Display */}
          <div className="mb-6 bg-green-50 p-4 rounded-lg border border-green-100 text-center">
            <p className="text-sm text-green-600 font-medium">Net Salary</p>
            <p className="text-3xl font-bold text-green-700">{formatCurrency(salaryData.netSalary)}</p>
            <p className="text-xs text-green-600 mt-1">{numberToWords(salaryData.netSalary)} Only</p>
          </div>
          
          {/* Key metrics in a grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-600">Basic Salary</p>
              <p className="font-bold text-blue-700">{formatCurrency(salaryData.baseSalary)}</p>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg">
              <p className="text-xs text-amber-600">Total Overtime</p>
              <p className="font-bold text-amber-700">{formatCurrency(totalOvertime)}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-xs text-purple-600">Total Allowances</p>
              <p className="font-bold text-purple-700">{formatCurrency(totalAllowances)}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-xs text-red-600">Total Deductions</p>
              <p className="font-bold text-red-700">{formatCurrency(totalDeductions)}</p>
            </div>
          </div>
          
          {/* Summary accordion */}
          <details className="mb-4 border rounded-lg">
            <summary className="p-3 font-medium cursor-pointer hover:bg-gray-50">
              Salary Breakdown
            </summary>
            <div className="p-3 pt-0 text-sm border-t">
              <div className="grid grid-cols-2 gap-y-2 mt-3">
                {salaryData.baseSalary > 0 && (
                  <>
                    <div className="text-gray-600">Basic Salary</div>
                    <div className="text-right font-medium">{formatCurrency(salaryData.baseSalary)}</div>
                  </>
                )}
                
                {salaryData.overtime.normal.earning > 0 && (
                  <>
                    <div className="text-gray-600">Normal Overtime</div>
                    <div className="text-right font-medium">{formatCurrency(salaryData.overtime.normal.earning)}</div>
                  </>
                )}
                
                {salaryData.overtime.holiday.earning > 0 && (
                  <>
                    <div className="text-gray-600">Holiday Overtime</div>
                    <div className="text-right font-medium">{formatCurrency(salaryData.overtime.holiday.earning)}</div>
                  </>
                )}
                
                {Object.entries(salaryData.allowances).map(([key, value]) => 
                  value > 0 ? (
                    <React.Fragment key={key}>
                      <div className="text-gray-600 capitalize">{key}</div>
                      <div className="text-right font-medium">{formatCurrency(value)}</div>
                    </React.Fragment>
                  ) : null
                )}
                
                {Object.entries(salaryData.deductions).map(([key, value]) => 
                  value > 0 ? (
                    <React.Fragment key={key}>
                      <div className="text-gray-600 capitalize">{key.replace('ded', '')}</div>
                      <div className="text-right font-medium text-red-600">-{formatCurrency(value)}</div>
                    </React.Fragment>
                  ) : null
                )}
                
                {Object.entries(salaryData.otherEarnings).map(([key, value]) => 
                  value > 0 ? (
                    <React.Fragment key={key}>
                      <div className="text-gray-600 capitalize">{key}</div>
                      <div className="text-right font-medium">{formatCurrency(value)}</div>
                    </React.Fragment>
                  ) : null
                )}
                
                <div className="border-t pt-2 mt-2 font-bold text-green-700">Net Salary</div>
                <div className="border-t pt-2 mt-2 font-bold text-green-700 text-right">{formatCurrency(salaryData.netSalary)}</div>
              </div>
            </div>
          </details>
        </div>
        
        {/* Footer with action buttons */}
        <div className="p-5 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalaryModal;