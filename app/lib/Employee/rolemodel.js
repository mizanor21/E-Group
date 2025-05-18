import mongoose from "mongoose"

const employeeRoleSchema = new mongoose.Schema({
  // Basic Information
  employeeRole: { type: String, required: true },

}, {
  timestamps: true,
})

export const EmployeeRole = mongoose.models.EmployeeRole || mongoose.model("EmployeeRole", employeeRoleSchema)