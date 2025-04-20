import { connectToDB } from "@/app/lib/connectToDB";
import { Project } from "@/app/lib/Project/model";
import { NextResponse } from "next/server";

// PATCH - Update group, company or project
export async function PATCH(req) {
  try {
    const { type, groupId, companyId, projectId, ...data } = await req.json();
    await connectToDB();

    let update = {};
    let result;

    switch (type) {
      case 'group':
        result = await Project.findByIdAndUpdate(
          groupId,
          { groupName: data.groupName },
          { new: true }
        );
        break;
      case 'company':
        result = await Project.findOneAndUpdate(
          { _id: groupId, 'companies._id': companyId },
          { 
            $set: { 
              'companies.$.companyName': data.companyName,
              'companies.$.companyShortName': data.companyShortName
            } 
          },
          { new: true }
        );
        break;
      case 'project':
        result = await Project.findOneAndUpdate(
          { _id: groupId, 'companies._id': companyId, 'companies.projects._id': projectId },
          { $set: { 'companies.$[company].projects.$[project].projectName': data.projectName } },
          { 
            new: true,
            arrayFilters: [
              { 'company._id': companyId },
              { 'project._id': projectId }
            ]
          }
        );
        break;
      default:
        return NextResponse.json(
          { message: "Invalid type specified" },
          { status: 400 }
        );
    }

    if (!result) {
      return NextResponse.json(
        { message: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    return handleError(error, "Failed to update item");
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
