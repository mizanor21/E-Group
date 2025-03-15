import mongoose from "mongoose"

const employeeSchema = new mongoose.Schema({
  // Basic Information
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  dob: { type: Date},
  employeeID: { type: String, required: true, unique: true },
  gender: { type: String },
  nationality: { type: String },
  bloodGroup: { type: String },
  religion: { type: String },

  // Address Information
  presentAddress1: { type: String, required: true },
  presentAddress2: { type: String },
  presentCity: { type: String, required: true },
  presentDivision: { type: String },
  presentPostOrZipCode: { type: String },
  permanentAddress1: { type: String },
  permanentAddress2: { type: String },
  permanentCity: { type: String },
  permanentDivision: { type: String },
  permanentPostOrZipCode: { type: String },
  isSameAddress: { type: Boolean, default: false },

  // Job Information
  department: { type: String },
  actualJob: { type: String },
  currentJob: { type: String},
  project: { type: String },
  employeeType: { type: String, required: true, enum: ["hourly", "daily", "monthly", "others"] },
  experience: { type: String },
  qualification: { type: String },
  role: { type: String },

  // Payment & Compensation
  basicPay: { type: Number },
  hourlyRate: { type: Number },
  dailyRate: { type: Number },
  commission: { type: Number, default: 0 },
  accAllowance: { type: Number, default: 0 },
  foodAllowance: { type: Number, default: 0 },
  telephoneAllowance: { type: Number, default: 0 },
  transportAllowance: { type: Number, default: 0 },
  overTimeHours: { type: Number, default: 0 },
  holidayOT: { type: Number, default: 0 },
  annualLeave: { type: String },


  // Customer Billing
  customerName: { type: String },
  customerWorkingHours: { type: Number },
  customerRate: { type: Number },

  // Vendor Billing
  vendorName: { type: String },
  vendorWorkingHours: { type: Number },
  vendorRate: { type: Number },

  // Documents & Proofs
  passportProof: { type: String },
  rpIdProof: { type: String },
  visaProof: { type: String },
  hiredFromDocuments: { type: String },
  hiredByDocuments: { type: String },
  

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
  contractNumber: { type: String },
  nocExpiryDate: { type: Date },

  // Hiring Information
  hiredFrom: { type: String },
  contactFullName: { type: String },
  contactNumber: { type: String },
  hiredFromDate: { type: Date },
  // hiredFromDocuments: { type: [String] },
  hiredFromExpiryDate: { type: Date },
  hiredBy: { type: String },
  hiredByContactName: { type: String },
  hiredByContactNumber: { type: String },
  hiredByDate: { type: Date },
  // hiredByDocuments: { type: [String] },
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
  accommodation: { type: String },
  ticketDuration: { type: String },
  lastTicket: { type: Date },
}, {
  timestamps: true,
})

export const Employees = mongoose.models.Employees || mongoose.model("Employees", employeeSchema)

