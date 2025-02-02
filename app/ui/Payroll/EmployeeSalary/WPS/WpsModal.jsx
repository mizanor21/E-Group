import { RxCross1 } from "react-icons/rx";
import React from "react";
import WpsTable from "./WpsTabel";
import { useSalaryData } from "@/app/data/DataFetch";

const WpsModal = ({ closeModal }) => {
  const { data: empSalary, error, isLoading } = useSalaryData();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-3/4 lg:w-1/2 p-4 relative">
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <span className="text-gray-600">Loading data...</span>
          </div>
        )}

        {/* Error Handling */}
        {error && (
          <div className="text-red-500 text-center py-5">
            Failed to load data: {error.message}
          </div>
        )}

        {/* Data Table */}
        {!isLoading && !error && empSalary && (
          <WpsTable employees={empSalary} closeModal={closeModal} />
        )}
      </div>
    </div>
  );
};

export default WpsModal;
