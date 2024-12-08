import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    company: String,
    location: String,
    category: String,
  },
  { timestamps: true }
);

export const Company =
  mongoose.models.Company || mongoose.model("Company", companySchema);
