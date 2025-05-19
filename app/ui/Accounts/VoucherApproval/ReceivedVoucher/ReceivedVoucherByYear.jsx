'use client'

import { useState } from 'react';
import { useReceivedVouchersByYearData } from "@/app/data/DataFetch";

const ReceivedVoucherByYear = () => {
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  
  const { data, error, isLoading, mutate } = useReceivedVouchersByYearData({
    params: { year: selectedYear }
  });

  const currentYear = 2024
  const yearOptions = Array.from({ length: 52 }, (_, i) => currentYear + i);

  return (
    <div className="space-y-4 border">
      <div className="flex justify-between items-center gap-4">
        {data && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">
              Received Vouchers for {selectedYear}
            </h2>
          </div>
        )}
        <div className="">
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
      </div>

      {isLoading && <div>Loading data...</div>}
      {error && <div className="text-red-500">Error: {error.message}</div>}

      {data && (
        <div className="mt-6">
          {data.length}
        </div>
      )}
    </div>
  );
};

export default ReceivedVoucherByYear;