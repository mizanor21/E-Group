import { connectToDB } from "@/app/lib/connectToDB";
import { EmployeeField } from "@/app/lib/Employee/required-field";


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