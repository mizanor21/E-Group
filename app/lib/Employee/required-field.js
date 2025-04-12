import mongoose from "mongoose"

const employeeFieldSchema = new mongoose.Schema({
  // Basic Information
  firstName: { type: Boolean },
  lastName: { type: Boolean },
  eEmail: { type: Boolean },
  phoneNumber: { type: Boolean },
  dob: { type: Boolean },
  employeeID: { type: Boolean },
  gender: { type: Boolean },
  nationality: { type: Boolean },
  bloodGroup: { type: Boolean },
  religion: { type: Boolean },

  // Address Information
  presentAddress1: { type: Boolean },
  presentAddress2: { type: Boolean },
  presentCity: { type: Boolean },
  presentDivision: { type: Boolean },
  presentPostOrZipCode: { type: Boolean },
  permanentAddress1: { type: Boolean },
  permanentAddress2: { type: Boolean },
  permanentCity: { type: Boolean },
  permanentDivision: { type: Boolean },
  permanentPostOrZipCode: { type: Boolean },
  isSameAddress: { type: Boolean },

  // Job Information
  department: { type: Boolean },
  actualJob: { type: Boolean },
  currentJob: { type: Boolean },
  project: { type: Boolean },
  employeeType: { type: Boolean },
  experience: { type: Boolean },
  qualification: { type: Boolean },
  role: { type: Boolean },

  // Payment & Compensation
  basicPay: { type: Boolean },
  hourlyRate: { type: Boolean },
  dailyRate: { type: Boolean },
  commission: { type: Boolean },
  accAllowance: { type: Boolean },
  foodAllowance: { type: Boolean },
  telephoneAllowance: { type: Boolean },
  transportAllowance: { type: Boolean },
  overTimeHours: { type: Boolean },
  holidayOT: { type: Boolean },
  annualLeave: { type: Boolean },

  // Customer Billing
  customerName: { type: Boolean },
  customerWorkingHours: { type: Boolean },
  customerRate: { type: Boolean },

  // Vendor Billing
  vendorName: { type: Boolean },
  vendorWorkingHours: { type: Boolean },
  vendorRate: { type: Boolean },

  // Documents & Proofs
  passportProof: { type: Boolean },
  rpIdProof: { type: Boolean },
  visaProof: { type: Boolean },
  hiredFromDocuments: { type: Boolean },
  hiredByDocuments: { type: Boolean },

  // Identification
  passportNumber: { type: Boolean },
  passportWith: { type: Boolean },
  passportIssueDate: { type: Boolean },
  passportExpiryDate: { type: Boolean },
  rpIdNumber: { type: Boolean },
  rpIdIssueDate: { type: Boolean },
  rpIdExpiryDate: { type: Boolean },
  licenseNumber: { type: Boolean },
  licenseExpiryDate: { type: Boolean },
  medicalCardNumber: { type: Boolean },
  medicalCardExpiryDate: { type: Boolean },
  insuranceNumber: { type: Boolean },
  insuranceExpiryDate: { type: Boolean },
  healthCardNumber: { type: Boolean },
  healthCardExpiryDate: { type: Boolean },
  contractNumber: { type: Boolean },
  nocExpiryDate: { type: Boolean },

  // Hiring Information
  hiredFrom: { type: Boolean },
  contactFullName: { type: Boolean },
  contactNumber: { type: Boolean },
  hiredFromDate: { type: Boolean },
  hiredFromExpiryDate: { type: Boolean },
  hiredBy: { type: Boolean },
  hiredByContactName: { type: Boolean },
  hiredByContactNumber: { type: Boolean },
  hiredByDate: { type: Boolean },
  hiredByExpiryDate: { type: Boolean },

  // Sponsor Information
  sponsor: { type: Boolean },
  sponsorIdNumber: { type: Boolean },

  // Visa Information
  visaType: { type: Boolean },
  visaEntryDate: { type: Boolean },
  visaExpiryDate: { type: Boolean },

  // Miscellaneous
  fingerprintDate: { type: Boolean },
  medicalDate: { type: Boolean },
  settlementDate: { type: Boolean },
  offDay: { type: Boolean },
  remarks: { type: Boolean },
  accommodation: { type: Boolean },
  ticketDuration: { type: Boolean },
  lastTicket: { type: Boolean },
}, {
  timestamps: true,
})

export const EmployeeField = mongoose.models.EmployeeField || mongoose.model("EmployeeField", employeeFieldSchema)
