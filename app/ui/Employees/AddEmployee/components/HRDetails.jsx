"use client";
import { useFormContext } from "react-hook-form"
import { CalendarIcon, IdentificationIcon, DocumentTextIcon, CreditCardIcon } from "@heroicons/react/24/outline"
import { useEmployeeFieldData } from "@/app/data/DataFetch"

const InputField = ({ id, label, type, icon: Icon, validation, error, isRequired }) => (
  <div className="w-full">
    {/* Label */}
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label} {isRequired && <span className="text-red-500">*</span>}
    </label>

    {/* Input Wrapper */}
    <div className="relative">
      {/* Icon */}
      {Icon && (
        <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      )}
      
      {/* Input Field */}
      <input
        id={id}
        type={type}
        {...validation}
        className={`w-full px-4 py-2 ${Icon ? 'pl-10' : 'pl-4'} border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:text-white transition-all duration-300 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600"}`}
        placeholder={`Enter ${label.toLowerCase()}...`}
      />
    </div>

    {/* Error Message */}
    {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
  </div>
);

const HRDetails = () => {
  const { data: requiredFieldData, isLoading } = useEmployeeFieldData([]) // Fetch required field data
  const {
    register,
    formState: { errors },
  } = useFormContext()

  // Extract field requirements from API data
  const getFieldRequirement = (fieldId) => {
    if (!requiredFieldData || requiredFieldData.length === 0) return false
    return requiredFieldData[0][fieldId] === "true"
  }

  // Create dynamic validation based on field requirements
  const createValidation = (fieldId) => {
    const isRequired = getFieldRequirement(fieldId)
    return register(fieldId, isRequired ? { required: `${fieldId} is required` } : {})
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Passport Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-6">Passport Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            id="passportNumber"
            label="Passport Number"
            type="text"
            icon={IdentificationIcon}
            validation={createValidation("passportNumber")}
            error={errors.passportNumber}
            isRequired={getFieldRequirement("passportNumber")}
          />
          <InputField
            id="passportWith"
            label="Passport With"
            type="text"
            validation={createValidation("passportWith")}
            error={errors.passportWith}
            isRequired={getFieldRequirement("passportWith")}
          />
          <InputField
            id="passportIssueDate"
            label="Passport Issue Date"
            type="date"
            icon={CalendarIcon}
            validation={createValidation("passportIssueDate")}
            error={errors.passportIssueDate}
            isRequired={getFieldRequirement("passportIssueDate")}
          />
          <InputField
            id="passportExpiryDate"
            label="Passport Expiry"
            type="date"
            icon={CalendarIcon}
            validation={createValidation("passportExpiryDate")}
            error={errors.passportExpiryDate}
            isRequired={getFieldRequirement("passportExpiryDate")}
          />
          <InputField
            id="rpIdNumber"
            label="RP / ID Number"
            type="text"
            icon={IdentificationIcon}
            validation={createValidation("rpIdNumber")}
            error={errors.rpIdNumber}
            isRequired={getFieldRequirement("rpIdNumber")}
          />
          <InputField
            id="rpIdIssueDate"
            label="RP/ID Issue Date"
            type="date"
            icon={CalendarIcon}
            validation={createValidation("rpIdIssueDate")}
            error={errors.rpIdIssueDate}
            isRequired={getFieldRequirement("rpIdIssueDate")}
          />
          <InputField
            id="rpIdExpiryDate"
            label="RP/ID Expiry Date"
            type="date"
            icon={CalendarIcon}
            validation={createValidation("rpIdExpiryDate")}
            error={errors.rpIdExpiryDate}
            isRequired={getFieldRequirement("rpIdExpiryDate")}
          />
          <InputField
            id="sponsor"
            label="Sponsor"
            type="text"
            validation={createValidation("sponsor")}
            error={errors.sponsor}
            isRequired={getFieldRequirement("sponsor")}
          />
          <InputField
            id="sponsorIdNumber"
            label="Sponsor ID Number"
            type="text"
            icon={IdentificationIcon}
            validation={createValidation("sponsorIdNumber")}
            error={errors.sponsorIdNumber}
            isRequired={getFieldRequirement("sponsorIdNumber")}
          />
        </div>
      </div>
      {/* License Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-6">License Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            id="licenseNumber"
            label="License Number"
            type="text"
            icon={IdentificationIcon}
            validation={createValidation("licenseNumber")}
            error={errors.licenseNumber}
            isRequired={getFieldRequirement("licenseNumber")}
          />
          <InputField
            id="licenseExpiryDate"
            label="License Expiry Date"
            type="date"
            icon={CalendarIcon}
            validation={createValidation("licenseExpiryDate")}
            error={errors.licenseExpiryDate}
            isRequired={getFieldRequirement("licenseExpiryDate")}
          />
          <InputField
            id="medicalCardNumber"
            label="Medical Card Number"
            type="text"
            icon={CreditCardIcon}
            validation={createValidation("medicalCardNumber")}
            error={errors.medicalCardNumber}
            isRequired={getFieldRequirement("medicalCardNumber")}
          />
          <InputField
            id="medicalCardExpiryDate"
            label="Medical Card Expiry Date"
            type="date"
            icon={CalendarIcon}
            validation={createValidation("medicalCardExpiryDate")}
            error={errors.medicalCardExpiryDate}
            isRequired={getFieldRequirement("medicalCardExpiryDate")}
          />
          <InputField
            id="insuranceNumber"
            label="Insurance Number"
            type="text"
            icon={IdentificationIcon}
            validation={createValidation("insuranceNumber")}
            error={errors.insuranceNumber}
            isRequired={getFieldRequirement("insuranceNumber")}
          />
          <InputField
            id="insuranceExpiryDate"
            label="Insurance Expiry Date"
            type="date"
            icon={CalendarIcon}
            validation={createValidation("insuranceExpiryDate")}
            error={errors.insuranceExpiryDate}
            isRequired={getFieldRequirement("insuranceExpiryDate")}
          />
          <InputField
            id="healthCardNumber"
            label="Health Card Number"
            type="text"
            icon={CreditCardIcon}
            validation={createValidation("healthCardNumber")}
            error={errors.healthCardNumber}
            isRequired={getFieldRequirement("healthCardNumber")}
          />
          <InputField
            id="healthCardExpiryDate"
            label="Health Card Expiry Date"
            type="date"
            icon={CalendarIcon}
            validation={createValidation("healthCardExpiryDate")}
            error={errors.healthCardExpiryDate}
            isRequired={getFieldRequirement("healthCardExpiryDate")}
          />
          <InputField
            id="contractNumber"
            label="Contract #"
            type="text"
            icon={DocumentTextIcon}
            validation={createValidation("contractNumber")}
            error={errors.contractNumber}
            isRequired={getFieldRequirement("contractNumber")}
          />
        </div>
      </div>
      {/* Other Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-6">Other Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            id="ticketDuration"
            label="Ticket Duration"
            type="text"
            validation={createValidation("ticketDuration")}
            error={errors.ticketDuration}
            isRequired={getFieldRequirement("ticketDuration")}
          />
          <InputField
            id="annualLeave"
            label="Annual Leave"
            type="number"
            validation={createValidation("annualLeave")}
            error={errors.annualLeave}
            isRequired={getFieldRequirement("annualLeave")}
          />
          <InputField
            id="lastTicket"
            label="Last Ticket"
            type="date"
            icon={CalendarIcon}
            validation={createValidation("lastTicket")}
            error={errors.lastTicket}
            isRequired={getFieldRequirement("lastTicket")}
          />
          <InputField
            id="offDay"
            label="Off Day"
            type="text"
            validation={createValidation("offDay")}
            error={errors.offDay}
            isRequired={getFieldRequirement("offDay")}
          />
          <InputField
            id="settlementDate"
            label="Settlement Date"
            type="date"
            icon={CalendarIcon}
            validation={createValidation("settlementDate")}
            error={errors.settlementDate}
            isRequired={getFieldRequirement("settlementDate")}
          />
        </div>
      </div>
    </div>
  );
}

export default HRDetails