import { connectToDB } from "@/app/lib/connectToDB";
import { Employees } from "@/app/lib/Employee/model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const employees = await Employees.find();
  const response = NextResponse.json(employees);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export async function POST(req) {
  try {
    const edgeData = await req.json();

    // Connect to the database
    await connectToDB();
    await Employees.create(edgeData);
    return NextResponse.json(
      { message: "Employees data created" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating edge data:", error);
    return NextResponse.json(
      { message: "Failed to create edge data" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    await connectToDB();
    const deletedEmployees = await Employees.findByIdAndDelete(id);
    if (!deletedEmployees) {
      return NextResponse.json(
        { message: "Employees data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Employees data deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete Employees data" },
      { status: 500 }
    );
  }
}
