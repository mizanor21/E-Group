"use client";
import { useFormContext } from "react-hook-form"
import { CalendarIcon, UserIcon, PhoneIcon, DocumentTextIcon } from "@heroicons/react/24/outline"

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

const Documents = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    (<div className="space-y-8">
      {/* Hired From */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-6">Hired From</h3>
        <div className="grid grid-cols-1 gap-6">
          <InputField
            id="hiredFrom"
            label="Hired From"
            type="text"
            icon={UserIcon}
            placeholder="Enter full name you hired from"
            validation={register("hiredFrom", { required: "Hired from is required" })}
            error={errors.hiredFrom} />
          <InputField
            id="contactFullName"
            label="Contact Full Name"
            type="text"
            icon={UserIcon}
            placeholder="Enter full name"
            validation={register("contactFullName")}
            error={errors.contactFullName} />
          <InputField
            id="contactNumber"
            label="Contact Number"
            type="tel"
            icon={PhoneIcon}
            placeholder="Enter contact number"
            validation={register("contactNumber")}
            error={errors.contactNumber} />
          <InputField
            id="hiredFromDate"
            label="Date"
            type="date"
            icon={CalendarIcon}
            validation={register("hiredFromDate")}
            error={errors.hiredFromDate} />
          <InputField
            id="hiredFromExpiryDate"
            label="Expiry Date"
            type="date"
            icon={CalendarIcon}
            validation={register("hiredFromExpiryDate")}
            error={errors.hiredFromExpiryDate} />
          <FileUpload
            id="hiredFromDocuments"
            label="Documents"
            validation={register("hiredFromDocuments")}
            error={errors.hiredFromDocuments} />
        </div>
      </div>
      {/* Hired By */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-6">Hired By</h3>
        <div className="grid grid-cols-1 gap-6">
          <InputField
            id="hiredBy"
            label="Hired By"
            type="text"
            icon={UserIcon}
            placeholder="Enter full name you hired by"
            validation={register("hiredBy", { required: "Hired by is required" })}
            error={errors.hiredBy} />
          <InputField
            id="hiredByContactName"
            label="Contact Full Name"
            type="text"
            icon={UserIcon}
            placeholder="Enter full name"
            validation={register("hiredByContactName")}
            error={errors.hiredByContactName} />
          <InputField
            id="hiredByContactNumber"
            label="Contact Number"
            type="tel"
            icon={PhoneIcon}
            placeholder="Enter contact number"
            validation={register("hiredByContactNumber")}
            error={errors.hiredByContactNumber} />
          <InputField
            id="hiredByDate"
            label="Date"
            type="date"
            icon={CalendarIcon}
            validation={register("hiredByDate")}
            error={errors.hiredByDate} />
          <InputField
            id="hiredByExpiryDate"
            label="Expiry Date"
            type="date"
            icon={CalendarIcon}
            validation={register("hiredByExpiryDate")}
            error={errors.hiredByExpiryDate} />
          <FileUpload
            id="hiredByDocuments"
            label="Documents"
            validation={register("hiredByDocuments")}
            error={errors.hiredByDocuments} />
          <InputField
            id="nocExpiryDate"
            label="NOC Expiry Date"
            type="date"
            icon={CalendarIcon}
            validation={register("nocExpiryDate")}
            error={errors.nocExpiryDate} />
        </div>
      </div>
      {/* VISA Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-6">VISA Information</h3>
        <div className="grid grid-cols-1 gap-6">
          <FileUpload
            id="visaProof"
            label="VISA Proof"
            validation={register("visaProof")}
            error={errors.visaProof} />
          <div className="space-y-1">
            <label htmlFor="visaType" className="block text-sm font-medium text-gray-700">
              VISA Type
            </label>
            <select
              id="visaType"
              {...register("visaType")}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option value="">Select VISA Type</option>
              <option value="tourist">Tourist</option>
              <option value="business">Business</option>
              <option value="work">Work</option>
              <option value="student">Student</option>
            </select>
            {errors.visaType && <p className="text-sm text-red-600">{errors.visaType.message}</p>}
          </div>
          <InputField
            id="visaEntryDate"
            label="Entry Date"
            type="date"
            icon={CalendarIcon}
            validation={register("visaEntryDate")}
            error={errors.visaEntryDate} />
          <InputField
            id="visaExpiryDate"
            label="VISA Expiry Date"
            type="date"
            icon={CalendarIcon}
            validation={register("visaExpiryDate")}
            error={errors.visaExpiryDate} />
          <InputField
            id="medicalDate"
            label="Medical Date"
            type="date"
            icon={CalendarIcon}
            validation={register("medicalDate")}
            error={errors.medicalDate} />
          <InputField
            id="fingerprintDate"
            label="Fingerprint Date"
            type="date"
            icon={CalendarIcon}
            validation={register("fingerprintDate")}
            error={errors.fingerprintDate} />
          <InputField
            id="deadline"
            label="Deadline"
            type="date"
            icon={CalendarIcon}
            validation={register("deadline")}
            error={errors.deadline} />
        </div>
      </div>
    </div>)
  );
}

export default Documents

