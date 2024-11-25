"use client";
import React from "react";
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
  // Chart data
  const chartData = {
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
        data: [300, 500, 400, 450, 500, 350, 400, 420, 480, 530, 500, 550],
        backgroundColor: "#1E90FF", // Blue color for net salary
      },
      {
        label: "Loan",
        data: [50, 100, 80, 120, 60, 70, 90, 50, 100, 150, 100, 200],
        backgroundColor: "#9370DB", // Purple color for loan
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Position of the legend
      },
      title: {
        display: true,
        text: "Annual Payroll Summary", // Chart title
      },
    },
    scales: {
      x: {
        type: "category", // Ensure the x-axis is categorical
        title: {
          display: true,
          text: "Months", // X-axis title
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount (in thousands)", // Y-axis title
        },
      },
    },
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default AnnualPayrollSummary;
