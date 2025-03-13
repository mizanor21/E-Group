import { connectToDB } from "@/app/lib/connectToDB";
import { User } from "@/app/lib/User/model";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    let users;
    if (email) {
      users = await User.find({ email }); 
    } else {
      users = await User.find();
    }

    if (email) {
      return NextResponse.json(users[0]);
    } else {
      return NextResponse.json(users);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();

    // Connect to the database
    await connectToDB();
    await User.create(data);
    return NextResponse.json(
      { message: "data created" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating data:", error);
    return NextResponse.json(
      { message: "Failed to create data" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    await connectToDB();
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { message: "data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "data deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete data" },
      { status: 500 }
    );
  }
}
