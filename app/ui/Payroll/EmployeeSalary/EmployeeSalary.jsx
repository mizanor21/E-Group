"use client";
import React from "react";
import EmployeeSalaryTable from "./EmployeeSalaryTable";
import { useEmployeeData } from "@/app/data/DataFetch";

const EmployeeSalary = () => {
  const { data: empSalary } = useEmployeeData([]);
  return (
    <div>
      <EmployeeSalaryTable employees={empSalary} />
    </div>
  );
};

export default EmployeeSalary;
