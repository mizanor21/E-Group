import { Company } from "@/app/lib/Company/model";
import { connectToDB } from "@/app/lib/connectToDB";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { id } = params;
  const updateData = await req.json();

  await connectToDB();

  try {
    const updatedCompany = await Company.findByIdAndUpdate(id, updateData, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures model validation
    });

    if (!updatedCompany) {
      return NextResponse.json(
        { message: "Company data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Data Successfully Updated", data: updatedCompany },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update Updated Company data:", error);
    return NextResponse.json(
      { message: "Failed to update Updated Company data" },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  const { id } = params;
  await connectToDB();
  const company = await Company.findOne({ _id: id });
  if (!company) {
    return NextResponse.json(
      { message: "company data not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(company, { status: 200 });
}
