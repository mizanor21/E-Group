import { connectToDB } from "@/app/lib/connectToDB";
import { Project } from "@/app/lib/Project/model";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { id } = params;
  const updateData = await req.json();

  await connectToDB();

  try {
    const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures model validation
    });

    if (!updatedProject) {
      return NextResponse.json(
        { message: "Project data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Data Successfully Updated", data: updatedProject },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update Updated Project data:", error);
    return NextResponse.json(
      { message: "Failed to update Updated Project data" },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  const { id } = params;
  await connectToDB();
  const project = await Project.findOne({ _id: id });
  if (!project) {
    return NextResponse.json(
      { message: "Project data not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(project, { status: 200 });
}
