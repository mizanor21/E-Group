import React from "react";

const SalarySummary = () => {
  const data = [
    {
      title: "Gross salary this month",
      value: "5,205,350.00",
      trend: "+2% more than last month",
      iconColor: "bg-yellow-100 text-yellow-600",
      trendColor: "text-green-500",
    },
    {
      title: "Net salary this month",
      value: "4,550,350.00",
      trend: "+2.1% more than last month",
      iconColor: "bg-blue-100 text-blue-600",
      trendColor: "text-green-500",
    },
    {
      title: "Overtime this month",
      value: "150,350.00",
      trend: "-1.5% less than last month",
      iconColor: "bg-purple-100 text-purple-600",
      trendColor: "text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((item, index) => (
        <div
          key={index}
          className="p-6 bg-white rounded-lg shadow flex items-center justify-between"
        >
          <div>
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-sm text-gray-500">{item.title}</p>
            <p className={`text-sm mt-2 ${item.trendColor}`}>{item.trend}</p>
          </div>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${item.iconColor}`}
          >
            {/* Placeholder icon */}
            <span className="text-2xl">📊</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SalarySummary;
