import { connectToDB } from "@/app/lib/connectToDB";
import { Employees } from "@/app/lib/Employee/model";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { id } = params;
  const updateData = await req.json();

  await connectToDB();

  try {
    const updatedEmployees = await Employees.findByIdAndUpdate(id, updateData, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures model validation
    });

    if (!updatedEmployees) {
      return NextResponse.json(
        { message: "Employees data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Data Successfully Updated", data: updatedEmployees },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update Updated Employees data:", error);
    return NextResponse.json(
      { message: "Failed to update Updated Employees data" },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  const { id } = params;
  await connectToDB();
  const employee = await Employees.findOne({ _id: id });
  if (!employee) {
    return NextResponse.json(
      { message: "Employees data not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(employee, { status: 200 });
}
