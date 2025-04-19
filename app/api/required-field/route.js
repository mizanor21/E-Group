import { connectToDB } from "@/app/lib/connectToDB";
import { EmployeeField } from "@/app/lib/Employee/required-field";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const data = await EmployeeField.find();
  const response = NextResponse.json(data);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export async function PATCH(request) {
  try {
    await connectToDB();

    const data = await request.json();
    
    const updatedFields = await EmployeeField.findOneAndUpdate(
      {}, 
      { $set: data },
      { new: true, upsert: true }
    );

    return Response.json(updatedFields, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: "Failed to update required fields" },
      { status: 500 }
    );
  }
}