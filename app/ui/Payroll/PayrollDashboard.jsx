"use client";
import React from "react";
import SalarySummary from "./SalarySummary";
import AnnualPayrollSummary from "./AnnualPayrollSummary";
import EmployeeTabs from "./EmployeeTabs";
import { useSalaryData } from "@/app/data/DataFetch";

const PayrollDashboard = () => {
  const { data, loading, error } = useSalaryData();
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-5">
        <SalarySummary data={data} loading={loading} error={error} />
        <AnnualPayrollSummary />
      </div>
      <EmployeeTabs />
    </div>
  );
};

export default PayrollDashboard;
