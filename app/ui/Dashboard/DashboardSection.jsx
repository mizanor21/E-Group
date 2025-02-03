import React from "react";

const DashboardSection = ({
  stats = [],
  feed = [],
  meetings = [],
  payments = [],
  employees = [],
}) => {
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
              <p className="text-sm mt-2 opacity-75">
                +{stat.percentage}% Increase
              </p>
            </div>
            <div className="text-6xl opacity-20">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Salary & Expense Chart */}
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Salary & Expense
          </h3>
          <button className="bg-gray-200 text-sm px-4 py-2 rounded-lg shadow-sm hover:bg-gray-300">
            Yearly
          </button>
        </div>
        <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-lg border-dashed border-2 border-gray-300">
          <p className="text-gray-400">[Insert Chart Here]</p>
        </div>
      </div>

      {/* Payment Vouchers and Employee List */}
      <div className="grid grid-cols-2 gap-8">
        {/* Payment Vouchers */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Payment Vouchers
          </h3>
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-3 font-medium text-gray-700">S/N</th>
                <th className="py-2 px-3 font-medium text-gray-700">
                  Memo Title
                </th>
                <th className="py-2 px-3 font-medium text-gray-700">
                  Sent From
                </th>
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
                      payment.status === "Pending"
                        ? "text-orange-600"
                        : "text-green-600"
                    }`}
                  >
                    {payment.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
      </div>

      {/* Activity Feed and Meetings */}
      <div className="grid grid-cols-2 gap-8">
        {/* Activity Feed */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Activity Feed
            </h3>
            <button className="bg-gray-100 text-sm px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200">
              All Activity
            </button>
          </div>
          <div className="space-y-4">
            {feed.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    <span className="font-medium">{item.name}</span>{" "}
                    {item.action}{" "}
                    <span className="font-semibold text-gray-700">
                      {item.target}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">{item.time}</p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Meetings */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Meetings</h3>
            <button className="bg-gray-100 text-sm px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200">
              Create New
            </button>
          </div>
          <div className="space-y-4">
            {meetings.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="bg-gray-100 p-4 rounded-lg text-center w-14">
                  <p className="text-sm font-semibold text-orange-500">
                    {item.day}
                  </p>
                  <p className="text-xl font-bold text-gray-800">{item.date}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
