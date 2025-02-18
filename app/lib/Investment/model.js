import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema(
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
      required: true,
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

export const Investment =
  mongoose.models.Investment || mongoose.model("Investment", investmentSchema);