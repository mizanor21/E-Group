"use client";

import { useEffect, useState } from "react";
import EmployeeTable from "./EmployeeTable";

export default function Employee() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/employees")
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  return <EmployeeTable employees={employees} />;
}
