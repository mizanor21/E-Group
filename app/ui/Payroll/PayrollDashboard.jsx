import React from "react";
import SalarySummary from "./SalarySummary";
import AnnualPayrollSummary from "./AnnualPayrollSummary";
import EmployeeSalary from "./EmployeeSalary/EmployeeSalary";

const PayrollDashboard = () => {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-5">
        <SalarySummary />
        <AnnualPayrollSummary />
      </div>
      <EmployeeSalary />
    </div>
  );
};

export default PayrollDashboard;
