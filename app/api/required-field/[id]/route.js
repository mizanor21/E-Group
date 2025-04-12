import { connectToDB } from "@/app/lib/connectToDB";
import { EmployeeField } from "@/app/lib/Employee/required-field";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { id } = params;
  const updateData = await req.json();

  await connectToDB();

  try {
    const data = await EmployeeField.findByIdAndUpdate(id, updateData, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures model validation
    });

    if (!data) {
      return NextResponse.json(
        { message: "data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Data Successfully Updated", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to Updated data:", error);
    return NextResponse.json(
      { message: "Failed to update Updated data" },
      { status: 500 }
    );
  }
}