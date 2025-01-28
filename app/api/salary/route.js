import { connectToDB } from "@/app/lib/connectToDB";
import Salaries from "@/app/lib/EmployeeSalary/modal";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDB();
    const salaryData = await req.json();

    const { employeeId, name, month, ...salaryDetails } = salaryData;

    let employee = await Salaries.findOne({ employeeId });

    if (!employee) {
      employee = new Salaries({ employeeId, name, salaries: [] });
    }
    // Ensure salaries is an array
    if (!Array.isArray(employee.salaries)) {
      employee.salaries = [];
    }

    // Find the index of the existing salary for the given month, if any
    const existingSalaryIndex = employee.salaries.findIndex(
      (salary) => salary.month === month
    );

    const newSalary = {
      month,
      workingDays: salaryDetails.workingDays,
      baseSalary: salaryDetails.baseSalary,
      overtime: salaryDetails.overtime,
      allowances: salaryDetails.allowances,
      deductions: salaryDetails.deductions,
      otherEarnings: salaryDetails.otherEarnings,
      netSalary: salaryDetails.netSalary,
    };

    if (existingSalaryIndex !== -1) {
      // Update existing salary
      employee.salaries[existingSalaryIndex] = newSalary;
    } else {
      // Add new salary
      employee.salaries.push(newSalary);
    }

    await employee.save();

    return NextResponse.json(
      { message: "Salary created/updated successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating/updating salary:", error);
    return NextResponse.json(
      { error: "Error creating/updating salary", details: error.message },
      { status: 500 }
    );
  }
}
