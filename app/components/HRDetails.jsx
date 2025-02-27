"use client";
import { useFormContext } from "react-hook-form"
import { CalendarIcon, IdentificationIcon, DocumentTextIcon, CreditCardIcon } from "@heroicons/react/24/outline"

const InputField = ({ id, label, type, icon: Icon, validation, error }) => (
  <div className="w-full">
    {/* Label */}
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
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
        className={`w-full px-4 py-2 pl-10 border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:text-white transition-all duration-300 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600"}`}
        placeholder={`Enter ${label.toLowerCase()}...`}
      />
    </div>

    {/* Error Message */}
    {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
  </div>
);

const FileUpload = ({ id, label, validation, error }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div
      className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
      <div className="space-y-1 text-center">
        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
        <div className="flex text-sm text-gray-600">
          <label
            htmlFor={id}
            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
            <span>Upload a file</span>
            <input id={id} type="file" className="sr-only" {...validation} />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
      </div>
    </div>
    {error && <p className="text-sm text-red-600">{error.message}</p>}
  </div>
)

const HRDetails = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    (<div className="space-y-8">
      {/* Passport Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-6">Passport Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            id="passportNumber"
            label="Passport Number *"
            type="text"
            icon={IdentificationIcon}
            placeholder="Enter your valid passport number"
            validation={register("passportNumber", { required: "Passport number is required" })}
            error={errors.passportNumber} />
          <InputField
            id="passportWith"
            label="Passport With"
            type="text"
            placeholder="Enter valid information"
            validation={register("passportWith")}
            error={errors.passportWith} />
          <InputField
            id="passportIssueDate"
            label="Passport Issue Date"
            type="date"
            icon={CalendarIcon}
            validation={register("passportIssueDate")}
            error={errors.passportIssueDate} />
          <InputField
            id="passportExpiryDate"
            label="Passport Expiry *"
            type="date"
            icon={CalendarIcon}
            validation={register("passportExpiryDate", { required: "Expiry date is required" })}
            error={errors.passportExpiryDate} />
          <InputField
            id="rpIdNumber"
            label="RP / ID Number"
            type="text"
            icon={IdentificationIcon}
            placeholder="Enter your RP/ID number"
            validation={register("rpIdNumber")}
            error={errors.rpIdNumber} />
          <InputField
            id="rpIdIssueDate"
            label="RP/ID Issue Date"
            type="date"
            icon={CalendarIcon}
            validation={register("rpIdIssueDate")}
            error={errors.rpIdIssueDate} />
          <InputField
            id="rpIdExpiryDate"
            label="RP/ID Expiry Date"
            type="date"
            icon={CalendarIcon}
            validation={register("rpIdExpiryDate")}
            error={errors.rpIdExpiryDate} />
          <InputField
            id="sponsor"
            label="Sponsor"
            type="text"
            placeholder="Enter sponsor information"
            validation={register("sponsor")}
            error={errors.sponsor} />
          <InputField
            id="sponsorIdNumber"
            label="Sponsor ID Number"
            type="text"
            icon={IdentificationIcon}
            placeholder="Enter sponsor ID number"
            validation={register("sponsorIdNumber")}
            error={errors.sponsorIdNumber} />
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
            placeholder="Enter valid license number"
            validation={register("licenseNumber")}
            error={errors.licenseNumber} />
          <InputField
            id="licenseExpiryDate"
            label="License Expiry Date"
            type="date"
            icon={CalendarIcon}
            validation={register("licenseExpiryDate")}
            error={errors.licenseExpiryDate} />
          <InputField
            id="medicalCardNumber"
            label="Medical Card Number"
            type="text"
            icon={CreditCardIcon}
            placeholder="Enter medical card number"
            validation={register("medicalCardNumber")}
            error={errors.medicalCardNumber} />
          <InputField
            id="medicalCardExpiryDate"
            label="Medical Card Expiry Date"
            type="date"
            icon={CalendarIcon}
            validation={register("medicalCardExpiryDate")}
            error={errors.medicalCardExpiryDate} />
          <InputField
            id="insuranceNumber"
            label="Insurance Number"
            type="text"
            icon={IdentificationIcon}
            placeholder="Enter insurance number"
            validation={register("insuranceNumber")}
            error={errors.insuranceNumber} />
          <InputField
            id="insuranceExpiryDate"
            label="Insurance Expiry Date"
            type="date"
            icon={CalendarIcon}
            validation={register("insuranceExpiryDate")}
            error={errors.insuranceExpiryDate} />
          <InputField
            id="healthCardNumber"
            label="Health Card Number"
            type="text"
            icon={CreditCardIcon}
            placeholder="Enter health card number"
            validation={register("healthCardNumber")}
            error={errors.healthCardNumber} />
          <InputField
            id="healthCardExpiryDate"
            label="Health Card Expiry Date"
            type="date"
            icon={CalendarIcon}
            validation={register("healthCardExpiryDate")}
            error={errors.healthCardExpiryDate} />
          <InputField
            id="contractNumber"
            label="Contract #"
            type="text"
            icon={DocumentTextIcon}
            placeholder="Enter contract number"
            validation={register("contractNumber")}
            error={errors.contractNumber} />
        </div>
      </div>
      {/* Other Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-6">Other Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FileUpload
            id="documents"
            label="Documents"
            validation={register("documents")}
            error={errors.documents} />
          <FileUpload
            id="fileFolder"
            label="File Folder"
            validation={register("fileFolder")}
            error={errors.fileFolder} />
          <InputField
            id="ticketDuration"
            label="Ticket Duration"
            type="text"
            placeholder="Select duration"
            validation={register("ticketDuration")}
            error={errors.ticketDuration} />
          <InputField
            id="annualLeave"
            label="Annual Leave"
            type="number"
            placeholder="Enter leave days"
            validation={register("annualLeave")}
            error={errors.annualLeave} />
          <InputField
            id="lastTicket"
            label="Last Ticket"
            type="date"
            icon={CalendarIcon}
            validation={register("lastTicket")}
            error={errors.lastTicket} />
          <InputField
            id="offDay"
            label="Off Day"
            type="text"
            placeholder="Select off day"
            validation={register("offDay")}
            error={errors.offDay} />
          <InputField
            id="settlementDate"
            label="Settlement Date"
            type="date"
            icon={CalendarIcon}
            validation={register("settlementDate")}
            error={errors.settlementDate} />
        </div>
      </div>
    </div>)
  );
}

export default HRDetails

