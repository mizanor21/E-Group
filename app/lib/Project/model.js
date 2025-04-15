// import mongoose from "mongoose";

// const projectSchema = new mongoose.Schema(
//   {
//     project: String,
//     location: String,
//     category: String,
//   },
//   { timestamps: true }
// );

// export const Project =
//   mongoose.models.Projects || mongoose.model("Projects", projectSchema);


// models/Project.js
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  }
});

const companySchema = new mongoose.Schema({
  
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  companyShortName: {
    type: String,
    required: [true, 'Company short name is required'],
    trim: true,
    unique: true
  },
  projects: {
    type: [projectSchema],
    default: [] // Empty array by default
  }
});

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: [true, 'Group name is required'],
    unique: true,
    trim: true,
  },
  companies: {
    type: [companySchema],
    default: [] // Empty array by default
  }
});

export const Project = mongoose.models.Projects || mongoose.model('Projects', groupSchema);