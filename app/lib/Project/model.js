import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    project: String,
    location: String,
    category: String,
  },
  { timestamps: true }
);

export const Project =
  mongoose.models.Projects || mongoose.model("Projects", projectSchema);
