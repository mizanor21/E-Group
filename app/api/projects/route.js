import { connectToDB } from "@/app/lib/connectToDB";
import { Project } from "@/app/lib/Project/model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const project = await Project.find();
  const response = NextResponse.json(project);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export async function POST(req) {
  try {
    const edgeData = await req.json();

    // Connect to the database
    await connectToDB();
    await Project.create(edgeData);
    return NextResponse.json(
      { message: "Project data created" },
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
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return NextResponse.json(
        { message: "Project data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Project data deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete Project data" },
      { status: 500 }
    );
  }
}
