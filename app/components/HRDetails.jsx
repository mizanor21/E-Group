"use client";
import { useFormContext } from "react-hook-form"
import { CalendarIcon, IdentificationIcon, DocumentTextIcon, CreditCardIcon } from "@heroicons/react/24/outline"

const InputField = ({
  id,
  label,
  type,
  icon: Icon,
  placeholder,
  validation,
  error
}) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative rounded-md shadow-sm">
      {Icon && (
        <div
          className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <input
        id={id}
        type={type}
        className={`${Icon ? "pl-10" : "pl-3"} block w-full sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
          error ? "border-red-300" : ""
        }`}
        placeholder={placeholder}
        {...validation} />
    </div>
    {error && <p className="text-sm text-red-600">{error.message}</p>}
  </div>
)

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            id="passportNumber"
            label="Passport Number"
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
            validation={register("passportIssueDate", { required: "Issue date is required" })}
            error={errors.passportIssueDate} />
          <InputField
            id="passportExpiryDate"
            label="Passport Expiry Date"
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
            validation={register("rpIdNumber", { required: "RP/ID number is required" })}
            error={errors.rpIdNumber} />
          <InputField
            id="rpIdIssueDate"
            label="RP/ID Issue Date"
            type="date"
            icon={CalendarIcon}
            validation={register("rpIdIssueDate", { required: "Issue date is required" })}
            error={errors.rpIdIssueDate} />
          <InputField
            id="rpIdExpiryDate"
            label="RP/ID Expiry Date"
            type="date"
            icon={CalendarIcon}
            validation={register("rpIdExpiryDate", { required: "Expiry date is required" })}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            id="licenseNumber"
            label="License Number"
            type="text"
            icon={IdentificationIcon}
            placeholder="Enter valid license number"
            validation={register("licenseNumber", { required: "License number is required" })}
            error={errors.licenseNumber} />
          <InputField
            id="licenseExpiryDate"
            label="License Expiry Date"
            type="date"
            icon={CalendarIcon}
            validation={register("licenseExpiryDate", { required: "Expiry date is required" })}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

