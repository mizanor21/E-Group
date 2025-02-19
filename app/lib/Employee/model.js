import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    // Basic Information
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    dob: { type: Date, required: true },
    employeeID: { type: String, required: true, unique: true },
    gender: { type: String },
    nationality: { type: String },
    bloodGroup: { type: String },
    religion: { type: String },
    
    // Address Information
    presentAddress1: { type: String, required: true },
    presentAddress2: { type: String },
    presentCity: { type: String, required: true },
    presentDivision: { type: String, required: true },
    presentPostOrZipCode: { type: String, required: true },
    permanentAddress1: { type: String },
    permanentAddress2: { type: String },
    permanentCity: { type: String },
    permanentDivision: { type: String },
    permanentPostOrZipCode: { type: String },

    // Job Information
    department: { type: String, required: true },
    actualJob: { type: String },
    currentJob: { type: String, required: true },
    project: { type: String },
    employeeType: { type: String, required: true, enum: ["hourly", "daily", "monthly", "others"] },
    experience: { type: Number },
    qualification: { type: String, required: true },

    // Payment & Compensation
    basicPay: { type: Number, required: true },
    commission: { type: Number, default: 0 },
    accAllowance: { type: Number, default: 0 },
    foodAllowance: { type: Number, default: 0 },
    telephoneAllowance: { type: Number, default: 0 },
    transportAllowance: { type: Number, default: 0 },
    overTimeHours: { type: Number, default: 0 },
    holidayOT: { type: Number, default: 0 },
    annualLeave: { type: String },

    // Banking Information
    bankName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    paymentMethod: { type: String },

    // Work Timing
    firstShiftStart: { type: String },
    firstShiftEnd: { type: String },
    dailyRate: { type: Number },
    hourlyRate: { type: Number },
    deadline: { type: Date },

    // Customer Billing
    customerName: { type: String },
    customerWorkingHours: { type: Number },
    customerRate: { type: Number },

    // Vendor Billing
    vendorName: { type: String },
    vendorWorkingHours: { type: Number },
    vendorRate: { type: Number },

    // Documents & Proofs
    documents: { type: [String] }, // File uploads stored as URLs
    fileFolder: { type: [String] },
    visaProof: { type: [String] },
    
    // Identification
    passportNumber: { type: String },
    passportWith: { type: String },
    passportIssueDate: { type: Date },
    passportExpiryDate: { type: Date },
    rpIdNumber: { type: String },
    rpIdIssueDate: { type: Date },
    rpIdExpiryDate: { type: Date },
    licenseNumber: { type: String },
    licenseExpiryDate: { type: Date },
    medicalCardNumber: { type: String },
    medicalCardExpiryDate: { type: Date },
    insuranceNumber: { type: String },
    insuranceExpiryDate: { type: Date },
    healthCardNumber: { type: String },
    healthCardExpiryDate: { type: Date },
    nocExpiryDate: { type: Date },

    // Hiring Information
    hiredFrom: { type: String },
    hiredFromDate: { type: Date },
    hiredFromDocuments: { type: [String] },
    hiredFromExpiryDate: { type: Date },
    hiredBy: { type: String },
    hiredByDate: { type: Date },
    hiredByDocuments: { type: [String] },
    hiredByExpiryDate: { type: Date },

    // Sponsor Information
    sponsor: { type: String },
    sponsorIdNumber: { type: String },

    // Visa Information
    visaType: { type: String },
    visaEntryDate: { type: Date },
    visaExpiryDate: { type: Date },

    // Miscellaneous
    fingerprintDate: { type: Date },
    medicalDate: { type: Date },
    settlementDate: { type: Date },
    offDay: { type: String },
    remarks: { type: String, default: "NAN" },
  },
  {
    timestamps: true,
  },
);

export const Employees =
  mongoose.models.Employees || mongoose.model("Employees", employeeSchema);
