'use client'

import { usePaymentVouchersByYearData } from '@/app/data/DataFetch';
import { useState } from 'react';

const PaymentVoucherByYear = () => {
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  
  const { data, error, isLoading, mutate } = usePaymentVouchersByYearData({
    params: { year: selectedYear }
  });

  const currentYear = 2024
  const yearOptions = Array.from({ length: 52 }, (_, i) => currentYear + i);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label htmlFor="year-select" className="font-medium">
          Select Year:
        </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <div>Loading data...</div>}
      {error && <div className="text-red-500">Error: {error.message}</div>}

      {data && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">
            Payment Vouchers for {selectedYear}
          </h2>
          {data.length}
        </div>
      )}
    </div>
  );
};

export default PaymentVoucherByYear;