"use client";
import { useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useSalaryData } from "@/app/data/DataFetch";

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UFOErrorScreen = () => {
  return (
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
  );
};

const AnnualPayrollSummary = () => {
  const { data, isLoading, error } = useSalaryData();
  const currentYear = new Date().getFullYear();

  // Get available years from the data
  const availableYears = useMemo(() => {
    if (!data || data.length === 0) return [currentYear];

    const years = new Set();
    data.forEach((employee) => {
      employee.salaries.forEach((salary) => {
        const year = parseInt(salary.month.split("-")[0]);
        years.add(year);
      });
    });

    return Array.from(years).sort((a, b) => b - a); // Sort descending
  }, [data, currentYear]);

  // State for selected year
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const monthsData = Array(12).fill(0);

    data.forEach((employee) => {
      employee.salaries.forEach((salary) => {
        const [year, month] = salary.month.split("-").map(Number);
        if (year === selectedYear) {
          monthsData[month - 1] += salary.netSalary;
        }
      });
    });

    // Check if we have any data for the selected year
    const hasData = monthsData.some((value) => value > 0);
    if (!hasData) return null;

    return {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Net Salary",
          data: monthsData,
          backgroundColor: "#1E90FF", // Blue color for net salary
        },
      ],
    };
  }, [data, selectedYear]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Annual Salary Summary ${selectedYear}`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
        },
      },
      y: {
        title: {
          display: true,
          text: "Net Salary (QAR)",
        },
        beginAtZero: true,
      },
    },
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading payroll data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-red-500 font-medium">Error loading salary data</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 bg-white rounded-lg shadow">
      {/* Year selector */}
      <div className="flex justify-between items-center">
        <div className=""></div>
        <div className="">
          <select
            id="year-select"
            value={selectedYear}
            onChange={handleYearChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart or no data message */}
      {chartData ? (
        <Bar data={chartData} options={chartOptions} />
      ) : (
        <UFOErrorScreen />
      )}
    </div>
  );
};

export default AnnualPayrollSummary;
