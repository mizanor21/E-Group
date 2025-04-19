"use client";
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import {
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useEmployeeRequiredFieldData } from "@/app/data/DataFetch";

const InputField = ({ id, label, type, icon: Icon, validation, error, isRequired }) => (
  <div className="w-full">
    {/* Label */}
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
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
          ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
        placeholder={`Enter ${label.toLowerCase()}...`}
      />
    </div>

    {/* Error Message */}
    {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
  </div>
);

const FileUpload = ({ id, label, validation, error, setValue, isRequired }) => {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file));
      
      // Begin upload to Cloudinary
      setUploading(true);
      
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "habson"); // Replace with your Cloudinary upload preset

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dov6k7xdk/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        setFileUrl(data.secure_url);
        
        // Update the form value with the Cloudinary URL
        setValue(id, data.secure_url);
        
        toast.success(`${label} uploaded successfully`);
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error(`Failed to upload ${label}`);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-sm text-gray-500">Uploading...</p>
            </div>
          ) : preview ? (
            <div className="flex flex-col items-center">
              <img
                src={preview}
                alt="File preview"
                className="h-32 object-contain mb-2"
              />
              <span className="text-sm text-gray-500">
                {fileUrl ? "Uploaded to Cloudinary" : "Processing..."}
              </span>
            </div>
          ) : (
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          )}
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor={id}
              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <span>{fileUrl ? "Change file" : "Upload a file"}</span>
              <input
                id={id}
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
          {fileUrl && (
            <p className="text-xs text-green-500 break-all mt-1">
              File uploaded: {fileUrl.substring(0, 30)}...
            </p>
          )}
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

const Documents = () => {
  const { data: requiredFieldData, isLoading } = useEmployeeRequiredFieldData([]);
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  // Extract field requirements from API data
  const getFieldRequirement = (fieldId) => {
    if (!requiredFieldData || requiredFieldData.length === 0) return false;
    return requiredFieldData[0][fieldId] === "true";
  };

  // Create dynamic validation based on field requirements
  const createValidation = (fieldId) => {
    const isRequired = getFieldRequirement(fieldId);
    return register(fieldId, isRequired ? { required: `${fieldId} is required` } : {});
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* VISA Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-6">VISA Information</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label
              htmlFor="visaType"
              className="block text-sm font-medium text-gray-700"
            >
              VISA Type {getFieldRequirement("visaType") && <span className="text-red-500">*</span>}
            </label>
            <select
              id="visaType"
              {...createValidation("visaType")}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600"
            >
              <option value="">Select VISA Type</option>
              <option value="tourist">Tourist</option>
              <option value="business">Business</option>
              <option value="work">Work</option>
              <option value="student">Student</option>
            </select>
            {errors.visaType && (
              <p className="text-sm text-red-600">{errors.visaType.message}</p>
            )}
          </div>
          <InputField
            id="visaEntryDate"
            label="Entry Date"
            type="date"
            icon={CalendarIcon}
            validation={createValidation("visaEntryDate")}
            error={errors.visaEntryDate}
            isRequired={getFieldRequirement("visaEntryDate")}
          />
          <InputField
            id="visaExpiryDate"
            label="VISA Expiry Date"
            type="date"
            icon={CalendarIcon}
            validation={createValidation("visaExpiryDate")}
            error={errors.visaExpiryDate}
            isRequired={getFieldRequirement("visaExpiryDate")}
          />
          <InputField
            id="medicalDate"
            label="Medical Date"
            type="date"
            icon={CalendarIcon}
            validation={createValidation("medicalDate")}
            error={errors.medicalDate}
            isRequired={getFieldRequirement("medicalDate")}
          />
          <InputField
            id="fingerprintDate"
            label="Fingerprint Date"
            type="date"
            icon={CalendarIcon}
            validation={createValidation("fingerprintDate")}
            error={errors.fingerprintDate}
            isRequired={getFieldRequirement("fingerprintDate")}
          />
          <InputField
            id="deadline"
            label="Deadline"
            type="date"
            icon={CalendarIcon}
            validation={createValidation("deadline")}
            error={errors.deadline}
            isRequired={getFieldRequirement("deadline")}
          />
        </div>
      </div>

      {/* Hired From */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-6">Hired From</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            id="hiredFrom"
            label="Hired From"
            type="text"
            icon={UserIcon}
            validation={createValidation("hiredFrom")}
            error={errors.hiredFrom}
            isRequired={getFieldRequirement("hiredFrom")}
          />
          <InputField
            id="contactFullName"
            label="Contact Full Name"
            type="text"
            icon={UserIcon}
            validation={createValidation("contactFullName")}
            error={errors.contactFullName}
            isRequired={getFieldRequirement("contactFullName")}
          />
          <InputField
            id="contactNumber"
            label="Contact Number"
            type="tel"
            icon={PhoneIcon}
            validation={createValidation("contactNumber")}
            error={errors.contactNumber}
            isRequired={getFieldRequirement("contactNumber")}
          />
          <InputField
            id="hiredFromDate"
            label="Date"
            type="date"
            icon={CalendarIcon}
            validation={createValidation("hiredFromDate")}
            error={errors.hiredFromDate}
            isRequired={getFieldRequirement("hiredFromDate")}
          />
          <InputField
            id="hiredFromExpiryDate"
            label="Expiry Date"
            type="date"
            icon={CalendarIcon}
            validation={createValidation("hiredFromExpiryDate")}
            error={errors.hiredFromExpiryDate}
            isRequired={getFieldRequirement("hiredFromExpiryDate")}
          />
        </div>
      </div>
      
      {/* Hired By */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-6">Hired By</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <InputField
            id="hiredBy"
            label="Hired By"
            type="text"
            icon={UserIcon}
            validation={createValidation("hiredBy")}
            error={errors.hiredBy}
            isRequired={getFieldRequirement("hiredBy")}
          />
          <InputField
            id="hiredByContactName"
            label="Contact Full Name"
            type="text"
            icon={UserIcon}
            validation={createValidation("hiredByContactName")}
            error={errors.hiredByContactName}
            isRequired={getFieldRequirement("hiredByContactName")}
          />
          <InputField
            id="hiredByContactNumber"
            label="Contact Number"
            type="tel"
            icon={PhoneIcon}
            validation={createValidation("hiredByContactNumber")}
            error={errors.hiredByContactNumber}
            isRequired={getFieldRequirement("hiredByContactNumber")}
          />
          <InputField
            id="hiredByDate"
            label="Date"
            type="date"
            icon={CalendarIcon}
            validation={createValidation("hiredByDate")}
            error={errors.hiredByDate}
            isRequired={getFieldRequirement("hiredByDate")}
          />
          <InputField
            id="hiredByExpiryDate"
            label="Expiry Date"
            type="date"
            icon={CalendarIcon}
            validation={createValidation("hiredByExpiryDate")}
            error={errors.hiredByExpiryDate}
            isRequired={getFieldRequirement("hiredByExpiryDate")}
          />
          <InputField
            id="nocExpiryDate"
            label="NOC Expiry Date"
            type="date"
            icon={CalendarIcon}
            validation={createValidation("nocExpiryDate")}
            error={errors.nocExpiryDate}
            isRequired={getFieldRequirement("nocExpiryDate")}
          />
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-6">Documents</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <FileUpload
            id="visaProof"
            label="VISA Proof"
            validation={createValidation("visaProof")}
            error={errors.visaProof}
            setValue={setValue}
            isRequired={getFieldRequirement("visaProof")}
          />
          <FileUpload
            id="passportProof"
            label="Passport Proof"
            validation={createValidation("passportProof")}
            error={errors.passportProof}
            setValue={setValue}
            isRequired={getFieldRequirement("passportProof")}
          />
          <FileUpload
            id="rpIdProof"
            label="RP/ID Proof"
            validation={createValidation("rpIdProof")}
            error={errors.rpIdProof}
            setValue={setValue}
            isRequired={getFieldRequirement("rpIdProof")}
          />      
          <FileUpload
            id="hiredFromDocuments"
            label="Hired From Document"
            validation={createValidation("hiredFromDocuments")}
            error={errors.hiredFromDocuments}
            setValue={setValue}
            isRequired={getFieldRequirement("hiredFromDocuments")}
          />
          <FileUpload
            id="hiredByDocuments"
            label="Hired By Document"
            validation={createValidation("hiredByDocuments")}
            error={errors.hiredByDocuments}
            setValue={setValue}
            isRequired={getFieldRequirement("hiredByDocuments")}
          />
        </div>
      </div>
    </div>
  );
};

export default Documents;