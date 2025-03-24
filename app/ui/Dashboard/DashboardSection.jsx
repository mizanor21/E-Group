"use client";

import { useState, useEffect } from "react";
import {
  useExpensesData,
  useIncomeData,
  useInvestmentData,
  useSalaryData,
} from "@/app/data/DataFetch";
import TransactionGraph from "../Accounts/AccountsDash/Transaction/transaction-graph";
import AnnualPayrollSummary from "../Payroll/AnnualPayrollSummary";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DashboardSection = ({
  stats = [],
  feed = [],
  meetings = [],
  payments = [],
  employees = [],
}) => {
  const { data: income } = useIncomeData();
  const { data: expenses } = useExpensesData();
  const { data: investment } = useInvestmentData();
  const { data: salaryData } = useSalaryData();

  const [selectedYear, setSelectedYear] = useState("");

  const years = Array.from(
    new Set([
      ...(income?.map((item) => new Date(item.date).getFullYear()) || []),
      ...(expenses?.map((item) => new Date(item.date).getFullYear()) || []),
      ...(investment?.map((item) => new Date(item.date).getFullYear()) || []),
      ...(salaryData?.flatMap((employee) =>
        employee.salaries.map((salary) => new Date(salary.month).getFullYear())
      ) || []),
    ])
  ).sort((a, b) => b - a);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const currentYear = new Date().getFullYear().toString();
    setSelectedYear(currentYear);
  }, []);

  // Prepare data for the transaction graph
  const prepareGraphData = () => {
    const graphData = months.map((month, index) => {
      const monthIncome =
        income
          ?.filter((item) => {
            const itemDate = new Date(item.date);
            return (
              itemDate.getFullYear() === Number.parseInt(selectedYear) &&
              itemDate.getMonth() === index
            );
          })
          .reduce((sum, item) => sum + item.amount, 0) || 0;

      const monthInvestment =
        investment
          ?.filter((item) => {
            const itemDate = new Date(item.date);
            return (
              itemDate.getFullYear() === Number.parseInt(selectedYear) &&
              itemDate.getMonth() === index
            );
          })
          .reduce((sum, item) => sum + item.amount, 0) || 0;

      const monthExpenses =
        expenses
          ?.filter((item) => {
            const itemDate = new Date(item.date);
            return (
              itemDate.getFullYear() === Number.parseInt(selectedYear) &&
              itemDate.getMonth() === index
            );
          })
          .reduce((sum, item) => sum + item.amount, 0) || 0;

      const monthSalary =
        salaryData
          ?.flatMap((employee) =>
            employee.salaries.filter((salary) => {
              const [year, salaryMonth] = salary.month.split("-");
              return year === selectedYear && Number(salaryMonth) - 1 === index;
            })
          )
          .reduce((sum, salary) => sum + salary.netSalary, 0) || 0;

      return {
        name: month,
        income: monthIncome + monthInvestment,
        expenses: monthExpenses + monthSalary,
      };
    });

    return graphData;
  };

  const graphData = prepareGraphData();

  return (
    <div className="space-y-8 min-h-screen">
      {/* Statistics Section */}
      <div className="grid grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="text-white rounded-lg p-6 shadow-md flex justify-between items-center"
            style={{
              background: `linear-gradient(to right, ${stat.bgFrom}, ${stat.bgTo})`,
            }}
          >
            <div>
              <h2 className="text-lg font-semibold">{stat.title}</h2>
              <p className="text-4xl font-extrabold">{stat.value}</p>
              {/* <p className="text-sm mt-2 opacity-75">
                +{stat.percentage}% Increase
              </p> */}
            </div>
            <div className="text-6xl opacity-20">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Transaction Graph and Annual Payroll Summary */}
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">
        <div className="relative">
          <TransactionGraph data={graphData} />
          {/* Year Selection */}
          <div className="absolute top-3 right-3 flex justify-end">
            <Select onValueChange={setSelectedYear} value={selectedYear}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <AnnualPayrollSummary />
      </div>

      {/* Payment Vouchers and Employee List */}
      <div className="grid grid-cols-2 gap-8">
        {/* Recent Employee List */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Employee List
          </h3>
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-3 font-medium text-gray-700">S/N</th>
                <th className="py-2 px-3 font-medium text-gray-700">
                  Staff Name
                </th>
                <th className="py-2 px-3 font-medium text-gray-700">
                  Staff Role
                </th>
                <th className="py-2 px-3 font-medium text-gray-700">
                  Designation
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.slice(-5).map((employee, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">{index + 1}</td>
                  <td className="py-2 px-3">
                    {employee.firstName} {employee.lastName}
                  </td>
                  <td className="py-2 px-3">{employee.role}</td>
                  <td className="py-2 px-3">{employee.currentJob}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Payment Vouchers */}
        {/* <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Vouchers</h3>
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-3 font-medium text-gray-700">S/N</th>
                <th className="py-2 px-3 font-medium text-gray-700">Memo Title</th>
                <th className="py-2 px-3 font-medium text-gray-700">Sent From</th>
                <th className="py-2 px-3 font-medium text-gray-700">Sent To</th>
                <th className="py-2 px-3 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">{index + 1}</td>
                  <td className="py-2 px-3">{payment.memoTitle}</td>
                  <td className="py-2 px-3">{payment.sentFrom}</td>
                  <td className="py-2 px-3">{payment.sentTo}</td>
                  <td
                    className={`py-2 px-3 font-semibold ${
                      payment.status === "Pending" ? "text-orange-600" : "text-green-600"
                    }`}
                  >
                    {payment.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
      </div>

      {/* Meetings */}
      {/* <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Meetings</h3>
          <button className="bg-gray-100 text-sm px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200">Create New</button>
        </div>
        <div className="space-y-4">
          {meetings.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="bg-gray-100 p-4 rounded-lg text-center w-14">
                <p className="text-sm font-semibold text-orange-500">{item.day}</p>
                <p className="text-xl font-bold text-gray-800">{item.date}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-400">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default DashboardSection;
