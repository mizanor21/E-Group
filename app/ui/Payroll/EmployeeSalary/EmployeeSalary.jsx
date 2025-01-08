"use client";
import React from "react";
import EmployeeSalaryTable from "./EmployeeSalaryTable";
import { useEmployeeData } from "@/app/data/DataFetch";

const EmployeeSalary = () => {
  // const empSalary = Array.from({ length: 100 }, (_, index) => ({
  //   id: index + 1,
  //   name: "Mahbub Jamil",
  //   regNo: "10001",
  //   opBal: "0.00",
  //   salary: "0.00",
  //   overtime: "0.00",
  //   allowance: "0",
  //   grossPay: "0.00",
  //   deduction: "0.00",
  //   other: "0.00",
  //   netPayable: "0.00",
  //   paid: "0.00",
  // }));

  const { data: empSalary } = useEmployeeData([]);
  return (
    <div>
      <EmployeeSalaryTable employees={empSalary} />
    </div>
  );
};

export default EmployeeSalary;
