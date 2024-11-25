import React from "react";
import SalarySummary from "./SalarySummary";
import AnnualPayrollSummary from "./AnnualPayrollSummary";

const PayrollDashboard = () => {
  return (
    <div className="grid grid-cols-2 gap-5">
      <SalarySummary />
      <AnnualPayrollSummary />
    </div>
  );
};

export default PayrollDashboard;
