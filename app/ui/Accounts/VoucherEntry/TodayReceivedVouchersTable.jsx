'use client'
import { useVouchersData } from "@/app/data/DataFetch";
import { Edit, Eye, Check, Trash2, Clock, CheckCircle, AlertCircle, FileText, DollarSign } from "lucide-react";
import { useState } from "react";

const TodayReceivedVouchersTable = () => {
  const { data } = useVouchersData([]);
  const [expandedVoucher, setExpandedVoucher] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    voucherNo: true,
    transitionType: true,
    project: true,
    expenseHead: true,
    paidTo: false,
    amount: false,
    rowStatus: false,
    total: true,
    voucherStatus: true,
    action: true
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Use the actual voucher status from the data
  const getVoucherStatus = (voucher) => {
    return voucher.status ? 'Approved' : 'Pending';
  };

  // Get row status based on voucher's global status and individual row status
  const getRowStatus = (voucher, row) => {
    // If voucher is globally approved, all rows are approved
    if (voucher.status === true) {
      return 'Approved';
    }
    
    // Otherwise, check individual row status
    return row.status ? 'Approved' : 'Pending';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Approved':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'Review':
        return <AlertCircle size={16} className="text-amber-600" />;
      case 'Pending':
      default:
        return <Clock size={16} className="text-blue-600" />;
    }
  };

  const calculateTotalAmount = (rows) => {
    return rows.reduce((sum, row) => sum + parseFloat(row.amountBDT || '0'), 0).toFixed(2);
  };

  const toggleVoucherExpand = (voucherId) => {
    if (expandedVoucher === voucherId) {
      setExpandedVoucher(null);
    } else {
      setExpandedVoucher(voucherId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md mt-6 overflow-hidden">
      <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-between items-center">
        <div className="flex items-center">
          <span className="w-2 h-6 bg-blue-500 rounded mr-2"></span>
          <h3 className="text-lg font-semibold text-gray-800">
            Today's Received Vouchers
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {data?.length || 0} vouchers
            </span>
          </h3>
        </div>
        <div className="relative group">
          <button className="text-gray-500 hover:text-gray-800 bg-white p-2 rounded-md shadow-sm border border-gray-200">
            <FileText size={16} />
          </button>
          <div className="absolute right-0 overflow-scroll max-h-[250px] bg-white shadow-lg rounded-md p-3 pb-5 hidden group-hover:block z-10 w-48">
            <p className="text-xs text-gray-500 mb-2">Toggle Columns</p>
            {Object.keys(visibleColumns).map(col => (
              <label key={col} className="flex items-center mb-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={visibleColumns[col]}
                  onChange={() => setVisibleColumns({...visibleColumns, [col]: !visibleColumns[col]})}
                  className="mr-2"
                />
                <span className="text-sm capitalize">{col.replace(/([A-Z])/g, ' $1')}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              {visibleColumns.date && <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tr. Date</th>}
              {visibleColumns.voucherNo && <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tr. No</th>}
              {visibleColumns.transitionType && <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tr. Type</th>}
              {visibleColumns.project && <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Project</th>}
              {visibleColumns.expenseHead && <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Expense Head</th>}
              {visibleColumns.paidTo && <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Paid To</th>}
              {visibleColumns.amount && <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Amount (BDT)</th>}
              {visibleColumns.rowStatus && <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Row Status</th>}
              {visibleColumns.total && <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Total Tr.</th>}
              {visibleColumns.voucherStatus && <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Voucher Status</th>}
              {visibleColumns.action && <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.length > 0 ? (
              data.map(voucher => {
                const totalAmount = calculateTotalAmount(voucher.voucherRows);
                const voucherStatus = getVoucherStatus(voucher);
                const isExpanded = expandedVoucher === voucher._id;
                
                return (
                  <>
                    <tr 
                      key={voucher._id} 
                      className={`cursor-pointer hover:bg-gray-50 ${isExpanded ? 'bg-blue-50' : ''}`}
                      onClick={() => toggleVoucherExpand(voucher._id)}
                    >
                      {visibleColumns.date && <td className="p-3 whitespace-nowrap">{formatDate(voucher.date)}</td>}
                      {visibleColumns.voucherNo && <td className="p-3 whitespace-nowrap font-medium text-gray-800">{voucher.lastVoucher}</td>}
                      {visibleColumns.transitionType && (
                        <td className="p-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            voucher.transitionType.includes('Cash') 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-violet-100 text-violet-800'
                          }`}>
                            {voucher.transitionType}
                          </span>
                        </td>
                      )}
                      {visibleColumns.project && <td className="p-3 whitespace-nowrap text-xs">{voucher.project}</td>}
                      {visibleColumns.expenseHead && <td className="p-3 whitespace-nowrap">Multiple</td>}
                      {visibleColumns.paidTo && <td className="p-3 whitespace-nowrap">Multiple</td>}
                      {visibleColumns.amount && <td className="p-3 whitespace-nowrap">—</td>}
                      {visibleColumns.rowStatus && <td className="p-3 whitespace-nowrap">—</td>}
                      {visibleColumns.total && (
                        <td className="p-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <DollarSign size={14} className="mr-1 text-gray-500" />
                            <span className="font-semibold text-gray-800">{totalAmount}</span>
                          </div>
                        </td>
                      )}
                      {visibleColumns.voucherStatus && (
                        <td className="p-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            voucherStatus === 'Approved' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {getStatusIcon(voucherStatus)}
                            <span className="ml-1">{voucherStatus}</span>
                          </span>
                        </td>
                      )}
                      {visibleColumns.action && (
                        <td className="p-3 whitespace-nowrap">
                          <div className="flex space-x-1">
                            <button className="bg-blue-500 text-white p-1 rounded-md hover:bg-blue-600 transition">
                              <Edit size={14} />
                            </button>
                            <button className="bg-cyan-500 text-white p-1 rounded-md hover:bg-cyan-600 transition">
                              <Eye size={14} />
                            </button>
                            <button className="bg-green-500 text-white p-1 rounded-md hover:bg-green-600 transition">
                              <Check size={14} />
                            </button>
                            <button className="bg-red-500 text-white p-1 rounded-md hover:bg-red-600 transition">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                    {isExpanded && voucher.voucherRows.map((row, rowIndex) => {
                      const rowStatus = getRowStatus(voucher, row);
                      return (
                        <tr key={`${voucher._id}-row-${rowIndex}`} className="bg-gray-50">
                          {visibleColumns.date && <td className="p-3 pl-10 whitespace-nowrap text-xs text-gray-500">—</td>}
                          {visibleColumns.voucherNo && <td className="p-3 whitespace-nowrap text-xs text-gray-500">Row {rowIndex + 1}</td>}
                          {visibleColumns.transitionType && <td className="p-3 whitespace-nowrap text-xs text-gray-500">—</td>}
                          {visibleColumns.project && <td className="p-3 whitespace-nowrap text-xs text-gray-500">—</td>}
                          {visibleColumns.expenseHead && <td className="p-3 whitespace-nowrap text-sm">{row.expenseHead}</td>}
                          {visibleColumns.paidTo && <td className="p-3 whitespace-nowrap text-sm">{row.paidTo}</td>}
                          {visibleColumns.amount && <td className="p-3 whitespace-nowrap text-sm font-medium">{row.amountBDT}</td>}
                          {visibleColumns.rowStatus && (
                            <td className="p-3 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                rowStatus === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {getStatusIcon(rowStatus)}
                                <span className="ml-1">{rowStatus}</span>
                              </span>
                            </td>
                          )}
                          {visibleColumns.total && <td className="p-3 whitespace-nowrap text-xs text-gray-500">—</td>}
                          {visibleColumns.voucherStatus && <td className="p-3 whitespace-nowrap text-xs text-gray-500">—</td>}
                          {visibleColumns.action && <td className="p-3 whitespace-nowrap text-xs text-gray-500">—</td>}
                        </tr>
                      );
                    })}
                  </>
                );
              })
            ) : (
              <tr>
                <td colSpan={Object.values(visibleColumns).filter(Boolean).length} className="p-6 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <AlertCircle size={40} className="text-gray-300 mb-2" />
                    <p>No vouchers found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TodayReceivedVouchersTable;