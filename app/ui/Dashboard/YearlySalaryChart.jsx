"use client";

import { useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const YearlySalaryChart = ({ salaryData }) => {
  // Process the salary data
  const processedData = useMemo(() => {
    const groupedData = {};

    salaryData?.forEach((employee) => {
      employee.salaries.forEach((salary) => {
        const year = salary.month.split("-")[0]; // Extract year (e.g., "2025")
        const month = salary.month.split("-")[1]; // Extract month (e.g., "01", "02")

        if (!groupedData[year]) {
          groupedData[year] = {};
        }

        if (!groupedData[year][month]) {
          groupedData[year][month] = 0;
        }

        groupedData[year][month] += salary.netSalary; // Summing up net salaries for all employees
      });
    });

    return groupedData;
  }, [salaryData]);

  // Extract years
  const years = useMemo(
    () => Object.keys(processedData).sort(),
    [processedData]
  );

  // Default to the latest year
  const [selectedYear, setSelectedYear] = useState(
    years[years.length - 1] || ""
  );

  // Chart Data
  const chartData = useMemo(() => {
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
          label: "Total Salary",
          data: Array.from({ length: 12 }, (_, index) => {
            const month = String(index + 1).padStart(2, "0"); // Convert to "01", "02", etc.
            return processedData[selectedYear]?.[month] || 0;
          }),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    };
  }, [selectedYear, processedData]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `Total Salaries for ${selectedYear}` },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Total Salary (USD)" },
      },
    },
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Yearly Salary Overview
        </h3>
        <select
          className="bg-gray-200 text-sm px-4 py-2 rounded-lg shadow-sm hover:bg-gray-300"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full h-64">
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
};

export default YearlySalaryChart;
