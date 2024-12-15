import { RxCross1 } from "react-icons/rx";
import React from "react";
import WpsTable from "./WpsTabel";

const WpsModal = ({ closeModal }) => {
  const empSalary = Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    name: "Ali Khan",
    regNo: "10001",
    opBal: "0.00",
    salary: "0.00",
    overtime: "0.00",
    allowance: "0",
    grossPay: "0.00",
    deduction: "0.00",
    other: "0.00",
    netPayable: "0.00",
    paid: "0.00",
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-3/4 lg:w-1/2 p-2">
        <WpsTable employees={empSalary} closeModal={closeModal} />
      </div>
    </div>
  );
};

export default WpsModal;
