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