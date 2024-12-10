import { connectToDB } from "@/app/lib/connectToDB";
import { Company } from "@/app/lib/Company/model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const company = await Company.find();
  const response = NextResponse.json(company);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export async function POST(req) {
  try {
    const edgeData = await req.json();

    // Connect to the database
    await connectToDB();
    await Company.create(edgeData);
    return NextResponse.json(
      { message: "Company data created" },
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
    const deletedCompany = await Company.findByIdAndDelete(id);
    if (!deletedCompany) {
      return NextResponse.json(
        { message: "Company data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Company data deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete Company data" },
      { status: 500 }
    );
  }
}
