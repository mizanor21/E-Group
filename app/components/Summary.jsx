import { useFormContext } from "react-hook-form"

const SummarySection = ({ title, fields }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
      {fields.map(([key, value]) => (
        <div key={key} className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">{key}</dt>
          <dd className="mt-1 text-sm text-gray-900">{value || "N/A"}</dd>
        </div>
      ))}
    </dl>
  </div>
)

const Summary = () => {
  const { getValues } = useFormContext()
  const values = getValues()

  return (
    (<div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Summary</h2>
      <SummarySection
        title="Basic Information"
        fields={[
          ["First Name", values.firstName],
          ["Last Name", values.lastName],
          ["Email", values.email],
          ["Phone Number", values.phoneNumber],
          ["Date of Birth", values.dateOfBirth],
        ]} />
      <SummarySection
        title="HR Details"
        fields={[
          ["Department", values.department],
          ["Position", values.position],
          ["Start Date", values.startDate],
          ["Salary", values.salary],
          ["Education", values.education],
        ]} />
      <SummarySection
        title="Documents"
        fields={[
          ["Resume", values.resume?.[0]?.name],
          ["ID Proof", values.idProof?.[0]?.name],
          ["Address Proof", values.addressProof?.[0]?.name],
        ]} />
      <SummarySection
        title="Payment Information"
        fields={[
          ["Bank Name", values.bankName],
          ["Account Number", values.accountNumber],
          ["IFSC Code", values.ifscCode],
          ["Payment Method", values.paymentMethod],
        ]} />
    </div>)
  );
}

export default Summary

