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
        errors[name] ? "border-red-500" : "border-gray-300"
      }`}
      placeholder={placeholder}
    />
    {errors[name] && (
      <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
    )}
  </div>
);

const HRDetails = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("HR Details Submitted:", data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <h3 className="text-2xl font-bold text-gray-800">Add HR Information</h3>

      <div className="grid grid-cols-3 gap-5">
        {/* Passport Information */}
        <div className="border-2 border-dashed p-5 rounded-md">
          <h4 className="text-xl font-semibold text-gray-700 mb-4">
            Passport Information
          </h4>
          <div className="grid grid-cols-1 gap-6">
            <InputField
              label="Passport Number"
              type="text"
              register={register}
              name="passportNumber"
              validation={{ required: "Passport Number is required" }}
              placeholder="Enter your valid passport number"
              errors={errors}
            />
            <InputField
              label="Passport With"
              type="text"
              register={register}
              name="passportWith"
              validation={{ required: "Passport With is required" }}
              placeholder="Enter valid information"
              errors={errors}
            />
            <InputField
              label="Passport Issue Date"
              type="date"
              register={register}
              name="passportIssueDate"
              validation={{ required: "Passport Issue Date is required" }}
              errors={errors}
            />
            <InputField
              label="Passport Expiry Date"
              type="date"
              register={register}
              name="passportExpiryDate"
              validation={{ required: "Passport Expiry Date is required" }}
              errors={errors}
            />
            <InputField
              label="RP / ID Number"
              type="text"
              register={register}
              name="rpIdNumber"
              validation={{ required: "RP / ID Number is required" }}
              placeholder="Enter your RP/ID number"
              errors={errors}
            />
            <InputField
              label="RP/ID Issue Date"
              type="date"
              register={register}
              name="rpIdIssueDate"
              validation={{ required: "RP/ID Issue Date is required" }}
              errors={errors}
            />
            <InputField
              label="RP/ID Expiry Date"
              type="date"
              register={register}
              name="rpIdExpiryDate"
              validation={{ required: "RP/ID Expiry Date is required" }}
              errors={errors}
            />
            <InputField
              label="Sponsor"
              type="text"
              register={register}
              name="sponsor"
              validation={{ required: "Sponsor is required" }}
              placeholder="Enter sponsor information"
              errors={errors}
            />
            <InputField
              label="Sponsor ID Number"
              type="text"
              register={register}
              name="sponsorIdNumber"
              validation={{ required: "Sponsor ID Number is required" }}
              placeholder="Enter sponsor ID number"
              errors={errors}
            />
          </div>
        </div>

        {/* License Information */}
        <div className="border-2 border-dashed p-5 rounded-md">
          <h4 className="text-xl font-semibold text-gray-700 mb-4">
            License Information
          </h4>
          <div className="grid grid-cols-1 gap-6">
            <InputField
              label="License Number"
              type="text"
              register={register}
              name="licenseNumber"
              validation={{ required: "License Number is required" }}
              placeholder="Enter valid license number"
              errors={errors}
            />
            <InputField
              label="License Expiry Date"
              type="date"
              register={register}
              name="licenseExpiryDate"
              validation={{ required: "License Expiry Date is required" }}
              errors={errors}
            />
            <InputField
              label="Medical Card Number"
              type="text"
              register={register}
              name="medicalCardNumber"
              validation={{ required: "Medical Card Number is required" }}
              placeholder="Enter medical card number"
              errors={errors}
            />
            <InputField
              label="Medical Card Expiry Date"
              type="date"
              register={register}
              name="medicalCardExpiryDate"
              validation={{ required: "Medical Card Expiry Date is required" }}
              errors={errors}
            />
            <InputField
              label="Insurance Number"
              type="text"
              register={register}
              name="insuranceNumber"
              validation={{ required: "Insurance Number is required" }}
              placeholder="Enter insurance number"
              errors={errors}
            />
            <InputField
              label="Insurance Expiry Date"
              type="date"
              register={register}
              name="insuranceExpiryDate"
              validation={{ required: "Insurance Expiry Date is required" }}
              errors={errors}
            />
            <InputField
              label="Health Card Number"
              type="text"
              register={register}
              name="healthCardNumber"
              validation={{ required: "Health Card Number is required" }}
              placeholder="Enter health card number"
              errors={errors}
            />
            <InputField
              label="Health Card Expiry Date"
              type="date"
              register={register}
              name="healthCardExpiryDate"
              validation={{ required: "Health Card Expiry Date is required" }}
              errors={errors}
            />
            <InputField
              label="Contract #"
              type="text"
              register={register}
              name="contractNumber"
              validation={{ required: "Contract # is required" }}
              placeholder="Enter contract number"
              errors={errors}
            />
          </div>
        </div>

        {/* Other Information */}
        <div className="border-2 border-dashed p-5 rounded-md">
          <h4 className="text-xl font-semibold text-gray-700 mb-4">
            Other Information
          </h4>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Documents
              </label>
              <input
                type="file"
                {...register("documents", {
                  required: "Documents are required",
                })}
                className={`border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full ${
                  errors.documents ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.documents && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.documents.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                File Folder
              </label>
              <input
                type="file"
                {...register("fileFolder")}
                className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
              />
            </div>
            <InputField
              label="Ticket Duration"
              type="text"
              register={register}
              name="ticketDuration"
              validation={{ required: "Ticket Duration is required" }}
              placeholder="Select duration"
              errors={errors}
            />
            <InputField
              label="Annual Leave"
              type="number"
              register={register}
              name="annualLeave"
              validation={{ required: "Annual Leave is required" }}
              placeholder="Enter leave days"
              errors={errors}
            />
            <InputField
              label="Last Ticket"
              type="date"
              register={register}
              name="lastTicket"
              validation={{ required: "Last Ticket is required" }}
              errors={errors}
            />
            <InputField
              label="Off Day"
              type="text"
              register={register}
              name="offDay"
              validation={{ required: "Off Day is required" }}
              placeholder="Select off day"
              errors={errors}
            />
            <InputField
              label="Settlement Date"
              type="date"
              register={register}
              name="settlementDate"
              validation={{ required: "Settlement Date is required" }}
              errors={errors}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Save HR Details
      </button>
    </form>
  );
};

export default HRDetails;
