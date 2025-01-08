"use client";

import EmployeeTable from "./EmployeeTable";
import { useEmployeeData } from "@/app/data/DataFetch";

export default function Employee() {
  const { data: employees } = useEmployeeData([]);

  return <EmployeeTable employees={employees} />;
}
