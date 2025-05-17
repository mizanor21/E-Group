import mongoose from "mongoose";

const chartOfAccountsSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    parentAccount: {
      type: String,
    },
    accountType: {
      type: String,
      enum: ["Assets", "Equity", "Liabilities", "Income", "Expense"], // Changed to string values
    },
    ledgerType: {
      type: String,
      enum: ["Child", "Parent"], // Changed to string values
      default: "Parent"
    },
    level: {
      type: Number,
      min: 1,
      default: 1
    },
    editable: {
      type: Boolean,
      default: true
    },
    deletable: {
      type: Boolean,
      default: true
    },
    createdBy: {
      name: {
        type: String,
      },
      email: {
        type: String,
      }
    },
    editedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);


export const ChartOfAccounts =
  mongoose.models.ChartOfAccounts || mongoose.model("ChartOfAccounts", chartOfAccountsSchema);