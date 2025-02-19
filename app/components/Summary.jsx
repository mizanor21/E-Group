import { useFormContext } from "react-hook-form"

const SummarySection = ({ title, fields }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">{title}</h3>
    <dl
      className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 md:grid-cols-3">
      {fields.map(([key, value]) => (
        <div key={key} className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">{key}</dt>
          <dd className="mt-1 text-sm text-gray-900">{value || "N/A"}</dd>
        </div>
      ))}
    </dl>
  </div>
)

const formatCurrency = (value) => {
  if (!value) return "N/A"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

const Summary = () => {
  const { getValues } = useFormContext()
  const values = getValues()

  const employeeType = values.employeeType || "N/A"
  const paymentValue =
    employeeType === "hourly" ? values.hourlyRate : employeeType === "daily" ? values.dailyRate : values.basicPay

  return (
    (<div className="bg-white p-6 rounded-lg shadow-md space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Review Information</h2>
      <SummarySection
        title="Basic Information"
        fields={[
          ["First Name", values.firstName],
          ["Last Name", values.lastName],
          ["Email", values.email],
          ["Phone Number", values.phoneNumber],
          ["Date of Birth", values.dob],
          ["Employee ID", values.employeeID],
          ["Gender", values.gender],
          ["Nationality", values.nationality],
          ["Blood Group", values.bloodGroup],
          ["Religion", values.religion],
        ]} />
      <SummarySection
        title="Present Address"
        fields={[
          ["Address Line 1", values.presentAddress1],
          ["Address Line 2", values.presentAddress2],
          ["City", values.presentCity],
          ["Division/State", values.presentDivision],
          ["Post/Zip Code", values.presentPostOrZipCode],
        ]} />
      {!values.isSameAddress && (
        <SummarySection
          title="Permanent Address"
          fields={[
            ["Address Line 1", values.permanentAddress1],
            ["Address Line 2", values.permanentAddress2],
            ["City", values.permanentCity],
            ["Division/State", values.permanentDivision],
            ["Post/Zip Code", values.permanentPostOrZipCode],
          ]} />
      )}
      <SummarySection
        title="Work Information"
        fields={[
          ["Employee Type", employeeType?.charAt(0).toUpperCase() + employeeType?.slice(1)],
          ["Department", values.department],
          ["Position", values.position],
          ["Start Date", values.startDate],
          ["Qualification", values.qualification],
          ["Experience", values.experience],
          ["Current Job", values.currentJob],
          ["Actual Job", values.actualJob],
          ["Project", values.project],
          ["Role", values.role],
        ]} />
      <SummarySection
        title="Payment Information"
        fields={[
          ["Employee Type", employeeType?.charAt(0).toUpperCase() + employeeType?.slice(1)],
          ["First Shift Start", values.firstShiftStart],
          ["First Shift End", values.firstShiftEnd],
          [
            employeeType === "hourly" ? "Hourly Rate" : employeeType === "daily" ? "Daily Rate" : "Basic Pay",
            formatCurrency(paymentValue),
          ],
          ["Over Time Hours", values.overTimeHours],
          ["Holiday OT", values.holidayOT],
          ["Commission", values.commission ? `${values.commission}%` : "N/A"],
          ["ACC Allowance", formatCurrency(values.accAllowance)],
          ["Food Allowance", formatCurrency(values.foodAllowance)],
          ["Telephone Allowance", formatCurrency(values.telephoneAllowance)],
          ["Transport Allowance", formatCurrency(values.transportAllowance)],
        ]} />
      <SummarySection
        title="Vendor Billing Information"
        fields={[
          ["Vendor Name", values.vendorName],
          ["Working Hours", values.vendorWorkingHours],
          ["Rate", formatCurrency(values.vendorRate)],
        ]} />
      <SummarySection
        title="Customer Billing Information"
        fields={[
          ["Customer Name", values.customerName],
          ["Working Hours", values.customerWorkingHours],
          ["Rate", formatCurrency(values.customerRate)],
        ]} />
      <SummarySection
        title="HR Details"
        fields={[
          ["Passport Number", values.passportNumber],
          ["Passport Issue Date", values.passportIssueDate],
          ["Passport Expiry Date", values.passportExpiryDate],
          ["RP/ID Number", values.rpIdNumber],
          ["RP/ID Issue Date", values.rpIdIssueDate],
          ["RP/ID Expiry Date", values.rpIdExpiryDate],
          ["License Number", values.licenseNumber],
          ["License Expiry Date", values.licenseExpiryDate],
          ["Medical Card Number", values.medicalCardNumber],
          ["Medical Card Expiry Date", values.medicalCardExpiryDate],
          ["Insurance Number", values.insuranceNumber],
          ["Insurance Expiry Date", values.insuranceExpiryDate],
          ["Health Card Number", values.healthCardNumber],
          ["Health Card Expiry Date", values.healthCardExpiryDate],
        ]} />
      <SummarySection
        title="Documents"
        fields={[
          ["Resume", values.resume?.[0]?.name],
          ["ID Proof", values.idProof?.[0]?.name],
          ["Address Proof", values.addressProof?.[0]?.name],
          ["Visa Proof", values.visaProof?.[0]?.name],
        ]} />
      <SummarySection
        title="Additional Information"
        fields={[
          ["Ticket Duration", values.ticketDuration],
          ["Annual Leave", values.annualLeave],
          ["Last Ticket", values.lastTicket],
          ["Off Day", values.offDay],
          ["Settlement Date", values.settlementDate],
          ["Remarks", values.remarks],
        ]} />
    </div>)
  );
}

export default Summary

