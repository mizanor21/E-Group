"use client";
import React from "react";
import { useForm } from "react-hook-form";

const InputField = ({
  label,
  type,
  register,
  name,
  validation,
  placeholder,
  errors,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-600">{label}</label>
    <input
      type={type}
      {...register(name, validation)}
      className={`border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full ${
        errors?.[name] ? "border-red-500" : "border-gray-300"
      }`}
      placeholder={placeholder}
    />
    {errors?.[name] && (
      <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
    )}
  </div>
);

const FileUploadField = ({ label, register, name, validation, errors }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600">{label}</label>
    <input
      type="file"
      {...register(name, validation)}
      className={`border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full ${
        errors?.[name] ? "border-red-500" : "border-gray-300"
      }`}
    />
    {errors?.[name] && (
      <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
    )}
  </div>
);

const SelectField = ({
  label,
  register,
  name,
  options,
  validation,
  errors,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-600">{label}</label>
    <select
      {...register(name, validation)}
      className={`border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full ${
        errors?.[name] ? "border-red-500" : "border-gray-300"
      }`}
    >
      <option value="">Select {label}</option>
      {options.map((option, idx) => (
        <option key={idx} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {errors?.[name] && (
      <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
    )}
  </div>
);

const Documents = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Document Form Submitted:", data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <h3 className="text-2xl font-bold text-gray-800">
        Add Document Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Hired From */}
        <div className="border-2 border-dashed p-5 rounded-md space-y-6">
          <h4 className="text-xl font-semibold text-gray-700 mb-4">
            Hired From
          </h4>
          <InputField
            label="Hired From"
            type="text"
            register={register}
            name="hiredFrom"
            validation={{ required: "Hired From is required" }}
            placeholder="Enter full name you hired from"
            errors={errors}
          />
          <InputField
            label="Contact Full Name"
            type="text"
            register={register}
            name="hiredFromContactName"
            validation={{ required: "Contact Full Name is required" }}
            placeholder="Enter full name"
            errors={errors}
          />
          <InputField
            label="Contact Number"
            type="text"
            register={register}
            name="hiredFromContactNumber"
            validation={{ required: "Contact Number is required" }}
            placeholder="Enter contact number"
            errors={errors}
          />
          <InputField
            label="Date"
            type="date"
            register={register}
            name="hiredFromDate"
            validation={{ required: "Date is required" }}
            errors={errors}
          />
          <InputField
            label="Expiry Date"
            type="date"
            register={register}
            name="hiredFromExpiryDate"
            validation={{ required: "Expiry Date is required" }}
            errors={errors}
          />
          <FileUploadField
            label="Documents"
            register={register}
            name="hiredFromDocuments"
            validation={{ required: "Documents are required" }}
            errors={errors}
          />
        </div>

        {/* Hired By */}
        <div className="border-2 border-dashed p-5 rounded-md space-y-6">
          <h4 className="text-xl font-semibold text-gray-700 mb-4">Hired By</h4>
          <InputField
            label="Hired By"
            type="text"
            register={register}
            name="hiredBy"
            validation={{ required: "Hired By is required" }}
            placeholder="Enter full name you hired by"
            errors={errors}
          />
          <InputField
            label="Contact Full Name"
            type="text"
            register={register}
            name="hiredByContactName"
            validation={{ required: "Contact Full Name is required" }}
            placeholder="Enter full name"
            errors={errors}
          />
          <InputField
            label="Contact Number"
            type="text"
            register={register}
            name="hiredByContactNumber"
            validation={{ required: "Contact Number is required" }}
            placeholder="Enter contact number"
            errors={errors}
          />
          <InputField
            label="Date"
            type="date"
            register={register}
            name="hiredByDate"
            validation={{ required: "Date is required" }}
            errors={errors}
          />
          <InputField
            label="Expiry Date"
            type="date"
            register={register}
            name="hiredByExpiryDate"
            validation={{ required: "Expiry Date is required" }}
            errors={errors}
          />
          <FileUploadField
            label="Documents"
            register={register}
            name="hiredByDocuments"
            validation={{ required: "Documents are required" }}
            errors={errors}
          />
          <InputField
            label="NOC Expiry Date"
            type="date"
            register={register}
            name="nocExpiryDate"
            validation={{ required: "NOC Expiry Date is required" }}
            errors={errors}
          />
        </div>

        {/* VISA Information */}
        <div className="border-2 border-dashed p-5 rounded-md space-y-6">
          <h4 className="text-xl font-semibold text-gray-700 mb-4">
            VISA Information
          </h4>
          <FileUploadField
            label="VISA Proof"
            register={register}
            name="visaProof"
            validation={{ required: "VISA Proof is required" }}
            errors={errors}
          />
          <SelectField
            label="VISA Type"
            register={register}
            name="visaType"
            options={[
              { label: "Work Visa", value: "work" },
              { label: "Tourist Visa", value: "tourist" },
              { label: "Business Visa", value: "business" },
            ]}
            validation={{ required: "VISA Type is required" }}
            errors={errors}
          />
          <InputField
            label="Entry Date"
            type="date"
            register={register}
            name="visaEntryDate"
            validation={{ required: "Entry Date is required" }}
            errors={errors}
          />
          <InputField
            label="VISA Expiry Date"
            type="date"
            register={register}
            name="visaExpiryDate"
            validation={{ required: "VISA Expiry Date is required" }}
            errors={errors}
          />
          <InputField
            label="Medical Date"
            type="date"
            register={register}
            name="visaMedicalDate"
            validation={{ required: "Medical Date is required" }}
            errors={errors}
          />
          <InputField
            label="Fingerprint Date"
            type="date"
            register={register}
            name="visaFingerprintDate"
            validation={{ required: "Fingerprint Date is required" }}
            errors={errors}
          />
          <InputField
            label="Deadline"
            type="date"
            register={register}
            name="visaDeadline"
            validation={{ required: "Deadline is required" }}
            errors={errors}
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Save Document Information
      </button>
    </form>
  );
};

export default Documents;
