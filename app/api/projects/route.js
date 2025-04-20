import { connectToDB } from "@/app/lib/connectToDB";
import { Project } from "@/app/lib/Project/model";
import { NextResponse } from "next/server";

// Helper function to handle errors
const handleError = (error, message) => {
  console.error(message, error);
  return NextResponse.json(
    { message: `${message}: ${error.message || error}` },
    { status: 500 }
  );
};

// GET all projects
export async function GET() {
  try {
    await connectToDB();
    const projects = await Project.find();
    return NextResponse.json(projects);
  } catch (error) {
    return handleError(error, "Failed to fetch projects");
  }
}

// POST - Create new group, company or project
export async function POST(req) {
  try {
    const { type, groupId, companyId, ...data } = await req.json();
    await connectToDB();

    let result;
    switch (type) {
      case 'group':
        result = await Project.create({ groupName: data.groupName, companies: [] });
        break;
      case 'company':
        result = await Project.findByIdAndUpdate(
          groupId,
          { $push: { companies: { 
            companyName: data.companyName,
            companyShortName: data.companyShortName,
            projects: []
          }}},
          { new: true }
        );
        break;
      case 'project':
        result = await Project.findOneAndUpdate(
          { _id: groupId, 'companies._id': companyId },
          { $push: { 'companies.$.projects': { projectName: data.projectName } } },
          { new: true }
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
        { message: "Parent not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleError(error, "Failed to create item");
  }
}

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

// DELETE - Remove group, company or project
export async function DELETE(req) {
  try {
    const { type, groupId, companyId, projectId } = await req.json();
    await connectToDB();

    let result;

    switch (type) {
      case 'group':
        result = await Project.findByIdAndDelete(groupId);
        break;
      case 'company':
        result = await Project.findByIdAndUpdate(
          groupId,
          { $pull: { companies: { _id: companyId } } },
          { new: true }
        );
        break;
      case 'project':
        result = await Project.findOneAndUpdate(
          { _id: groupId, 'companies._id': companyId },
          { $pull: { 'companies.$.projects': { _id: projectId } } },
          { new: true }
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

    return NextResponse.json(
      { message: "Item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Failed to delete item");
  }
}