import CreateSalary from "@/app/ui/Payroll/EmployeeSalary/CreateSalary/CreateSalary";
import React from "react";

const create_salary = ({ params }) => {
  return (
    <div>
      <CreateSalary id={params.id} />
    </div>
  );
};

export default create_salary;
