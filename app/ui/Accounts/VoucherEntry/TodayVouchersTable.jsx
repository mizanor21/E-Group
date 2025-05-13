'use client'
import { Edit, Eye, Check, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const TodayVouchersTable = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await fetch('/api/vouchers');
        if (!response.ok) {
          throw new Error('Failed to fetch vouchers');
        }
        const data = await response.json();
        setVouchers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatus = (createdAt, updatedAt) => {
    return createdAt === updatedAt ? 'Pending' : 'Approved';
  };

  const calculateTotalAmount = (rows) => {
    return rows.reduce((sum, row) => sum + parseFloat(row.amountBDT || '0'), 0).toFixed(2);
  };

  if (loading) {
    return <div className="text-center py-4">Loading vouchers...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-white rounded-md shadow-sm mt-4 p-4">
      <h3 className="text-lg font-medium mb-4">Today's vouchers</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 border text-left text-sm">Tr. Date</th>
              <th className="p-2 border text-left text-sm">Tr. No</th>
              <th className="p-2 border text-left text-sm">Tr. Type</th>
              <th className="p-2 border text-left text-sm">Project</th>
              <th className="p-2 border text-left text-sm">Expense Head</th>
              <th className="p-2 border text-left text-sm">Paid To</th>
              <th className="p-2 border text-left text-sm">Amount (BDT)</th>
              <th className="p-2 border text-left text-sm">Total Tr.</th>
              <th className="p-2 border text-left text-sm">Status</th>
              <th className="p-2 border text-left text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.length > 0 ? (
              vouchers.flatMap(voucher => {
                const totalAmount = calculateTotalAmount(voucher.voucherRows);
                const voucherStatus = getStatus(voucher.createdAt, voucher.updatedAt);
                
                return voucher.voucherRows.map((row, index) => (
                  <tr key={`${voucher._id}-${row._id}`}>
                    {index === 0 && (
                      <>
                        <td className="p-2 border" rowSpan={voucher.voucherRows.length}>
                          {formatDate(voucher.date)}
                        </td>
                        <td className="p-2 border" rowSpan={voucher.voucherRows.length}>
                          {voucher.lastVoucher}
                        </td>
                        <td className="p-2 border" rowSpan={voucher.voucherRows.length}>
                          {voucher.transitionType}
                        </td>
                        <td className="p-2 border" rowSpan={voucher.voucherRows.length}>
                          {voucher.project}
                        </td>
                      </>
                    )}
                    <td className="p-2 border">{row.expenseHead}</td>
                    <td className="p-2 border">{row.paidTo}</td>
                    <td className="p-2 border">{row.amountBDT}</td>
                    {index === 0 && (
                      <>
                        <td className="p-2 border font-medium" rowSpan={voucher.voucherRows.length}>
                          {totalAmount}
                        </td>
                        <td className="p-2 border" rowSpan={voucher.voucherRows.length}>
                          <span className={`${
                            voucherStatus === 'Approved' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          } text-xs font-medium px-2 py-1 rounded`}>
                            {voucherStatus}
                          </span>
                        </td>
                        <td className="p-2 border" rowSpan={voucher.voucherRows.length}>
                          <div className="flex space-x-1">
                            <button className="bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 transition">
                              <Edit size={16} />
                            </button>
                            <button className="bg-cyan-500 text-white p-1 rounded-full hover:bg-cyan-600 transition">
                              <Eye size={16} />
                            </button>
                            <button className="bg-green-500 text-white p-1 rounded-full hover:bg-green-600 transition">
                              <Check size={16} />
                            </button>
                            <button className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ));
              })
            ) : (
              <tr>
                <td colSpan={10} className="p-4 border text-center text-gray-500">
                  No vouchers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TodayVouchersTable;