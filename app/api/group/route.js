import { connectToDB } from "@/app/lib/connectToDB";
import { Group } from "@/app/lib/Group/model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const group = await Group.find();
  const response = NextResponse.json(group);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export async function POST(req) {
  try {
    const edgeData = await req.json();

    // Connect to the database
    await connectToDB();
    await Group.create(edgeData);
    return NextResponse.json(
      { message: "Group data created" },
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
    const deletedGroup = await Group.findByIdAndDelete(id);
    if (!deletedGroup) {
      return NextResponse.json(
        { message: "Group data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Group data deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete Group data" },
      { status: 500 }
    );
  }
}
