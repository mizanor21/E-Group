import mongoose from "mongoose";

const withdrawSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    investorName: {
      type: String,
      required: true,
    },
    voucherNo: {
      type: String,
      required: true,
    },
    submissionDate: {
      type: Date,
    },
    mode: {
      type: String,
      enum: ["Cash", "Check", "Online"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Cleared", "Pending", "Bounced"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Withdraw =
  mongoose.models.Withdraw || mongoose.model("Withdraw", withdrawSchema);