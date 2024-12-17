import React from "react";

const SalaryModal = ({ closeModal }) => {
    const handleSave = () => {
        console.log("Payslip saved!");
        alert("Save Payslip")
        closeModal();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
            <div className="bg-white rounded-lg shadow-lg w-3/4 lg:w-1/2 p-8">
                {/* Header Section */}
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <div>
                        <h1 className="text-xl font-semibold">Abubakar Alghazali</h1>
                        <p className="text-sm text-gray-500">Managing Director | MD/CEO</p>
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
                                <th className="border border-gray-200 px-4 py-2">Salary Structure</th>
                                <th className="border border-gray-200 px-4 py-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-200 px-4 py-2">Basic Salary</td>
                                <td className="border border-gray-200 px-4 py-2">445,331</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-200 px-4 py-2">Housing Allowance</td>
                                <td className="border border-gray-200 px-4 py-2">222,666</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-200 px-4 py-2">Transport Allowance</td>
                                <td className="border border-gray-200 px-4 py-2">89,066</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-200 px-4 py-2">Utility Allowance</td>
                                <td className="border border-gray-200 px-4 py-2">44,533</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-200 px-4 py-2">Productivity Allowance</td>
                                <td className="border border-gray-200 px-4 py-2">89,066</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-200 px-4 py-2">Communication Allowance</td>
                                <td className="border border-gray-200 px-4 py-2">89,066</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-200 px-4 py-2">Inconvenience Allowance</td>
                                <td className="border border-gray-200 px-4 py-2">89,066</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-200 font-semibold px-4 py-2">Gross Salary</td>
                                <td className="border border-gray-200 font-semibold  px-4 py-2">89,066</td>
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
                            <tr>
                                <td className="border border-gray-200 px-4 py-2">Tax/PAYE</td>
                                <td className="border border-gray-200 px-4 py-2">163,696</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-200 px-4 py-2">Employee Pension</td>
                                <td className="border border-gray-200 px-4 py-2">60,565</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-200 px-4 py-2 font-semibold">Total Deduction</td>
                                <td className="border border-gray-200 px-4 py-2 font-semibold">224,261</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-200 px-4 py-2">Net Salary</td>
                                <td className="border border-gray-200 px-4 py-2 font-semibold">800,000</td>
                            </tr>
                            <tr>
                                <td
                                    className="border border-gray-200 px-4 py-2 font-semibold"
                                    colSpan="2"
                                >
                                    <p className="text-right">Net Salary in Words: Eight Hundred Thousand Naira Only</p>
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
