import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    accommodation: { type: String, default: "NAN" },
    actualJob: { type: String },
    bloodGroup: { type: String },
    currentJob: { type: String },
    department: { type: String },
    dob: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    employeeID: { type: String, required: true, unique: true },
    experience: { type: String },
    firstName: { type: String, required: true },
    gender: { type: String },
    isSameAddress: { type: Array, default: [] },
    lastName: { type: String },
    nationality: { type: String },
    permanentAddress1: { type: String },
    permanentAddress2: { type: String },
    permanentCity: { type: String },
    permanentDivision: { type: String },
    permanentPostOrZipCode: { type: String },
    phoneNumber: { type: String },
    presentAddress1: { type: String },
    presentAddress2: { type: String },
    presentCity: { type: String },
    presentDivision: { type: String },
    presentPostOrZipCode: { type: String },
    profilePhoto: { type: String },
    project: { type: String },
    qualification: { type: String },
    religion: { type: String },
    remarks: { type: String, default: "NAN" },
    role: { type: String },
  },
  { timestamps: true }
);

export const Employees =
  mongoose.models.Employees || mongoose.model("Employees", employeeSchema);
