import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
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
    amount: {
      type: Number,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Cleared", "Pending", "Bounced"],
      required: true,
    },
  },
  { timestamps: true }
);

export const Expense =
  mongoose.models.Expense || mongoose.model("Expense", expenseSchema);