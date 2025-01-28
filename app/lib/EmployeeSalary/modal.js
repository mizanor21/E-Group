import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
  },
  workingDays: {
    type: Number,
    required: true,
  },
  baseSalary: {
    type: Number,
    required: true,
  },
  overtime: {
    normal: {
      hours: Number,
      earning: Number,
    },
    holiday: {
      hours: Number,
      earning: Number,
    },
  },
  allowances: {
    allowances: Number,
    specialAllowances: Number,
    accommodation: Number,
    foodAllowance: Number,
    telephoneAllowance: Number,
    transportAllowance: Number,
    total: Number,
  },
  deductions: {
    numberOfLeave: Number,
    dedFines: Number,
    dedDoc: Number,
    dedOthers: Number,
    total: Number,
  },
  otherEarnings: {
    advRecovery: Number,
    arrearPayments: Number,
    currentBalance: Number,
    total: Number,
  },
  netSalary: {
    type: Number,
    required: true,
  },
});

const employeeSalarySchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  salaries: {
    type: [salarySchema],
    default: [],
  },
});

const Salaries =
  mongoose.models.Salaries || mongoose.model("Salaries", employeeSalarySchema);

export default Salaries;
