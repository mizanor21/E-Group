import React from "react";

const numberToWords = (num) => {
  // This is a simple implementation. For a more robust solution, consider using a library like "number-to-words"
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100)
    return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
  if (num < 1000)
    return (
      ones[Math.floor(num / 100)] +
      " Hundred" +
      (num % 100 ? " and " + numberToWords(num % 100) : "")
    );
  if (num < 1000000)
    return (
      numberToWords(Math.floor(num / 1000)) +
      " Thousand" +
      (num % 1000 ? " " + numberToWords(num % 1000) : "")
    );
  return (
    numberToWords(Math.floor(num / 1000000)) +
    " Million" +
    (num % 1000000 ? " " + numberToWords(num % 1000000) : "")
  );
};

const SalaryModal = ({ closeModal, salaryData }) => {
  const handleSave = () => {
    console.log("Payslip saved!");
    alert("Save Payslip");
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="bg-white rounded-lg shadow-lg w-3/4 lg:w-1/2 p-8">
        {/* Header Section */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div>
            <h1 className="text-xl font-semibold">{salaryData.name}</h1>
            <p className="text-sm text-gray-500">{salaryData.designation}</p>
          </div>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-rose-500 focus:outline-none"
          >
            ✕
          </button>
        </div>

        {/* Salary Payslip Section */}
        <h2 className="text-lg font-medium mb-4">Salary Payslip</h2>
        <div className="flex justify-between text-sm mb-6">
          <p>Month: January</p>
          <p>Year: 2023</p>
        </div>

        <div className="overflow-x-auto lg:flex gap-5">
          {/* Salary Structure Table */}
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-700 text-white text-left">
                <th className="border border-gray-200 px-4 py-2">
                  Salary Structure
                </th>
                <th className="border border-gray-200 px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 font-bold px-4 py-2">
                  Basic Salary
                </td>
                <td className="border border-gray-200 font-bold px-4 py-2">
                  {salaryData.baseSalary}
                </td>
              </tr>
              <tr>
                <td className="border font-bold border-gray-200 px-4 py-2">
                  Normal Overtime
                </td>
                <td className="border font-bold border-gray-200 px-4 py-2">
                  {salaryData.normalOverTimeEarning}
                </td>
              </tr>
              <tr>
                <td className="border font-bold border-gray-200 px-4 py-2">
                  Holiday Overtime
                </td>
                <td className="border font-bold border-gray-200 px-4 py-2">
                  {salaryData.holidayOverTimeEarning}
                </td>
              </tr>
              {Object.entries(salaryData.allowances).map(([key, value]) => (
                <tr key={key}>
                  <td className="border border-gray-200 px-4 py-2">{key}</td>
                  <td className="border border-gray-200 px-4 py-2">{value}</td>
                </tr>
              ))}
              <tr>
                <td className="border border-gray-200 font-semibold px-4 py-2">
                  Total Allowances
                </td>
                <td className="border border-gray-200 font-semibold px-4 py-2">
                  {salaryData.allowanceEarning}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 font-semibold px-4 py-2">
                  Other Earnings
                </td>
                <td className="border border-gray-200 font-semibold px-4 py-2">
                  {salaryData.otherEarning}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 font-semibold px-4 py-2">
                  Gross Salary
                </td>
                <td className="border border-gray-200 font-semibold px-4 py-2">
                  {Number.parseFloat(salaryData.baseSalary) +
                    Number.parseFloat(salaryData.normalOverTimeEarning) +
                    Number.parseFloat(salaryData.holidayOverTimeEarning) +
                    Number.parseFloat(salaryData.allowanceEarning) +
                    Number.parseFloat(salaryData.otherEarning)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Deductions Table */}
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-700 text-white text-left">
                <th className="border border-gray-200 px-4 py-2">Deductions</th>
                <th className="border border-gray-200 px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(salaryData.deductions).map(([key, value]) => (
                <tr key={key}>
                  <td className="border border-gray-200 px-4 py-2">{key}</td>
                  <td className="border border-gray-200 px-4 py-2">{value}</td>
                </tr>
              ))}
              <tr>
                <td className="border border-gray-200 px-4 py-2 font-semibold">
                  Total Deduction
                </td>
                <td className="border border-gray-200 px-4 py-2 font-semibold">
                  {salaryData.deduction}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-4 py-2">Net Salary</td>
                <td className="border border-gray-200 px-4 py-2 font-semibold">
                  {salaryData.netSalary}
                </td>
              </tr>
              <tr>
                <td
                  className="border border-gray-200 px-4 py-2 font-semibold"
                  colSpan="2"
                >
                  <p className="text-right">
                    Net Salary in Words: {numberToWords(salaryData.netSalary)}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={closeModal}
            className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-md"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="bg-sky-600 text-white hover:bg-white hover:text-sky-600 border hover:border-sky-600 px-6 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalaryModal;
