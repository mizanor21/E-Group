import { connectToDB } from "@/app/lib/connectToDB";
import { Group } from "@/app/lib/Group/model";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { id } = params;
  const updateData = await req.json();

  await connectToDB();

  try {
    const updatedGroup = await Group.findByIdAndUpdate(id, updateData, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures model validation
    });

    if (!updatedGroup) {
      return NextResponse.json(
        { message: "Group data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Data Successfully Updated", data: updatedGroup },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update Updated Group data:", error);
    return NextResponse.json(
      { message: "Failed to update Updated Group data" },
      { status: 500 }
    );
  }
}

export async function GET({ params }) {
  const { id } = params;
  await connectToDB();
  const group = await Group.findOne({ _id: id });
  if (!group) {
    return NextResponse.json(
      { message: "Group data not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(group, { status: 200 });
}
