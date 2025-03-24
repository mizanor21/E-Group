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
  <div className="bg-white p-5 mt-5 rounded-xl shadow-sm">
      <div className="flex flex-col items-center justify-center h-64 bg-amber-100 rounded-lg">
      {/* Main content */}
      <div className="w-full max-w-md relative">
        {/* Background with sand dunes */}
        <div className="absolute bottom-0 w-full">
          <div className="h-20 bg-amber-200 rounded-t-full"></div>
        </div>

        {/* UFO illustrations */}
        <div className="relative">
          {/* Decorative dots */}
          <div className="absolute w-full h-full">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  backgroundColor: ["#e2e8f0", "#cbd5e1", "#f8a4a4", "#93c5fd"][
                    i % 4
                  ],
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
              ></div>
            ))}
          </div>

          {/* Left UFO */}
          <div className="absolute left-6 top-4">
            <div className="w-16 h-6 bg-white rounded-full shadow-md relative flex justify-center">
              <div className="absolute -top-4 w-12 h-6 bg-amber-200 rounded-full"></div>
              <div
                className="absolute bottom-1 w-3 h-8 bg-amber-100 opacity-80"
                style={{ clipPath: "polygon(50% 0, 100% 100%, 0% 100%)" }}
              ></div>
              <div className="absolute bottom-4 w-4 h-4 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Right UFO */}
          <div className="absolute right-6 top-0">
            <div className="w-20 h-8 bg-white rounded-full shadow-md relative flex justify-center">
              <div className="absolute -top-5 w-16 h-8 bg-amber-300 rounded-full"></div>
              <div
                className="absolute bottom-1 w-4 h-12 bg-amber-100 opacity-80"
                style={{ clipPath: "polygon(50% 0, 100% 100%, 0% 100%)" }}
              ></div>
              <div className="absolute bottom-6 w-5 h-5 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Spacer to allow UFOs to float above */}
          <div className="h-32"></div>

          {/* Error message box */}
          <div className="bg-amber-300 rounded-lg p-4 text-center text-white shadow-md mx-4">
            <h2 className="text-xl font-bold mb-1">Whoops ...</h2>
            <p className="mb-4 text-sm">
              We&apos;re unable to find the data
              <br />
              that you&apos;re looking for
            </p>
            <button className="bg-white text-amber-500 w-full py-2 rounded-md font-medium transition-colors hover:bg-amber-50 text-sm">
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
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
