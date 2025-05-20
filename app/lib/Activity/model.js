import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    }
  },
  { timestamps: true }
);

export const ActivityTrack =
  mongoose.models.ActivityTrack || mongoose.model("ActivityTrack", activitySchema);