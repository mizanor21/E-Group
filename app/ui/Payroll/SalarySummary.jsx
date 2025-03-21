"use client";

import { useMemo } from "react";
import { FaDollarSign, FaChartLine, FaClock } from "react-icons/fa";

const SalarySummary = ({ data, isLoading, error }) => {
  const summaryData = useMemo(() => {
    if (!data || data.length === 0) return null;

    // Find the most recent month
    const mostRecentMonth = data
      .flatMap((emp) => emp.salaries.map((s) => s.month))
      .sort()
      .reverse()[0];

    let totalGrossSalary = 0;
    let totalNetSalary = 0;
    let totalOvertime = 0;

    data.forEach((employee) => {
      const recentSalary = employee.salaries.find(
        (s) => s.month === mostRecentMonth
      );
      if (recentSalary) {
        totalGrossSalary +=
          recentSalary.baseSalary +
          recentSalary.allowances.total +
          recentSalary.overtime.normal.earning +
          recentSalary.overtime.holiday.earning;
        totalNetSalary += recentSalary.netSalary;
        totalOvertime +=
          recentSalary.overtime.normal.earning +
          recentSalary.overtime.holiday.earning;
      }
    });

    return {
      month: mostRecentMonth,
      grossSalary: totalGrossSalary,
      netSalary: totalNetSalary,
      overtime: totalOvertime,
    };
  }, [data]);

  if (!summaryData)
    return (
      <div className="text-center">
        No data available for the most recent month
      </div>
    );

  const SummaryCard = ({ title, amount, icon }) => (
    <div className="p-6 bg-white rounded-lg shadow flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold">{amount.toFixed(2)}</p>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-sm mt-2 text-blue-500">For {summaryData.month}</p>
      </div>
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
        {icon}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SummaryCard
        title="Total Gross Salary"
        amount={summaryData.grossSalary}
        icon={<FaDollarSign />}
      />
      <SummaryCard
        title="Total Net Salary"
        amount={summaryData.netSalary}
        icon={<FaChartLine />}
      />
      <SummaryCard
        title="Total Overtime"
        amount={summaryData.overtime}
        icon={<FaClock />}
      />
    </div>
  );
};

export default SalarySummary;
