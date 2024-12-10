import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    group: String,
    location: String,
    category: String,
  },
  { timestamps: true }
);

export const Group =
  mongoose.models.Group || mongoose.model("Group", groupSchema);
