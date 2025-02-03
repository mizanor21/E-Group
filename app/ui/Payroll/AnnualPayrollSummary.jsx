"use client";
import { useMemo } from "react";
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

const AnnualPayrollSummary = () => {
  const { data, isLoading, error } = useSalaryData();

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const currentYear = new Date().getFullYear();
    const monthsData = Array(12).fill(0);

    data.forEach((employee) => {
      employee.salaries.forEach((salary) => {
        const [year, month] = salary.month.split("-").map(Number);
        if (year === currentYear) {
          monthsData[month - 1] += salary.netSalary;
        }
      });
    });

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
  }, [data]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Annual Payroll Summary ${new Date().getFullYear()}`,
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

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (error)
    return (
      <div className="text-center p-4 text-red-500">
        Error loading salary data
      </div>
    );
  if (!chartData)
    return (
      <div className="text-center p-4">
        No salary data available for the current year
      </div>
    );

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default AnnualPayrollSummary;
