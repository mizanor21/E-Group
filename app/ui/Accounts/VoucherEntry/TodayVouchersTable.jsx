'use client'
import { Edit, Eye, Check, Trash2 } from "lucide-react";

const TodayVouchersTable = () => {
  return (
    <div className="bg-white rounded-md shadow-sm mt-4 p-4">
      <h3 className="text-lg font-medium mb-4">Your voucher today</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 border text-left text-sm">Tr. Date</th>
              <th className="p-2 border text-left text-sm">Tr. No</th>
              <th className="p-2 border text-left text-sm">Tr. Type</th>
              <th className="p-2 border text-left text-sm">Branch</th>
              <th className="p-2 border text-left text-sm">voucher number</th>
              <th className="p-2 border text-left text-sm">Amount (FC)</th>
              <th className="p-2 border text-left text-sm">Amount (BDT)</th>
              <th className="p-2 border text-left text-sm">Status</th>
              <th className="p-2 border text-left text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Sample data for demo */}
            <tr>
              <td className="p-2 border">20-Aug-2024</td>
              <td className="p-2 border">TR-001</td>
              <td className="p-2 border">Bank Payment</td>
              <td className="p-2 border">Mirpur DOHS</td>
              <td className="p-2 border">DV-01-00001101</td>
              <td className="p-2 border">-</td>
              <td className="p-2 border">500.00</td>
              <td className="p-2 border">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">Approved</span>
              </td>
              <td className="p-2 border">
                <div className="flex space-x-1">
                  <button className="bg-blue-500 text-white p-1 rounded-full">
                    <Edit size={16} />
                  </button>
                  <button className="bg-cyan-500 text-white p-1 rounded-full">
                    <Eye size={16} />
                  </button>
                  <button className="bg-green-500 text-white p-1 rounded-full">
                    <Check size={16} />
                  </button>
                  <button className="bg-red-500 text-white p-1 rounded-full">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="p-2 border">20-Aug-2024</td>
              <td className="p-2 border">TR-002</td>
              <td className="p-2 border">Cash Payment</td>
              <td className="p-2 border">Mirpur DOHS</td>
              <td className="p-2 border">DV-01-00001102</td>
              <td className="p-2 border">-</td>
              <td className="p-2 border">1,250.00</td>
              <td className="p-2 border">
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">Pending</span>
              </td>
              <td className="p-2 border">
                <div className="flex space-x-1">
                  <button className="bg-blue-500 text-white p-1 rounded-full">
                    <Edit size={16} />
                  </button>
                  <button className="bg-cyan-500 text-white p-1 rounded-full">
                    <Eye size={16} />
                  </button>
                  <button className="bg-green-500 text-white p-1 rounded-full">
                    <Check size={16} />
                  </button>
                  <button className="bg-red-500 text-white p-1 rounded-full">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="p-2 border">21-Aug-2024</td>
              <td className="p-2 border">TR-003</td>
              <td className="p-2 border">Transfer</td>
              <td className="p-2 border">Mirpur DOHS</td>
              <td className="p-2 border">DV-01-00001103</td>
              <td className="p-2 border">50.00 USD</td>
              <td className="p-2 border">5,500.00</td>
              <td className="p-2 border">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">Approved</span>
              </td>
              <td className="p-2 border">
                <div className="flex space-x-1">
                  <button className="bg-blue-500 text-white p-1 rounded-full">
                    <Edit size={16} />
                  </button>
                  <button className="bg-cyan-500 text-white p-1 rounded-full">
                    <Eye size={16} />
                  </button>
                  <button className="bg-green-500 text-white p-1 rounded-full">
                    <Check size={16} />
                  </button>
                  <button className="bg-red-500 text-white p-1 rounded-full">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TodayVouchersTable;