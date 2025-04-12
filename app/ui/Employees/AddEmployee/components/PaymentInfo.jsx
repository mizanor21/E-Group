"use client";
import { useFormContext, useWatch } from "react-hook-form"
import {
  BanknotesIcon,
  ClockIcon,
  UserIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  TruckIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline"
import { useState } from "react"
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


const PaymentInfo = () => {
  const { data: requiredFieldData, isLoading } = useEmployeeFieldData([]);
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext()
  const [showExtra, setShowExtra] = useState(false)

  const employeeType = useWatch({
    control,
    name: "employeeType",
    defaultValue: "hourly",
  })

  // Extract field requirements from API data
  const getFieldRequirement = (fieldId) => {
    if (!requiredFieldData || requiredFieldData.length === 0) return false;
    return requiredFieldData[0][fieldId] === "true";
  };

  // Create dynamic validation based on field requirements
  const createValidation = (fieldId, additionalValidation = {}) => {
    const isRequired = getFieldRequirement(fieldId);
    const validation = isRequired 
      ? { required: `${fieldId} is required`, ...additionalValidation } 
      : { ...additionalValidation };
    
    return register(fieldId, validation);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    (<div className="space-y-8">
      {/* Employee Work Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-6">Employee Work Information</h3>

        <div className="space-y-6">
          {/* Employee Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Employee Type {getFieldRequirement("employeeType") && <span className="text-red-500">*</span>}
            </label>
            <div className="flex space-x-4">
              {["hourly", "daily", "monthly", "others"].map((type) => (
                <label key={type} className="inline-flex items-center">
                  <input
                    type="radio"
                    {...createValidation("employeeType")}
                    value={type}
                    className="form-radio h-4 w-4 text-blue-600" />
                  <span className="ml-2 capitalize">{type}</span>
                </label>
              ))}
            </div>
            {errors.employeeType && <p className="text-sm text-red-600">{errors.employeeType.message}</p>}
          </div>

          {/* Payment Fields based on Employee Type */}
          {employeeType === "hourly" && (
            <InputField
              id="hourlyRate"
              label="Hourly Rate"
              type="number"
              icon={CurrencyDollarIcon}
              validation={createValidation("hourlyRate")}
              error={errors.hourlyRate}
              isRequired={getFieldRequirement("hourlyRate")}
            />
          )}

          {employeeType === "daily" && (
            <InputField
              id="dailyRate"
              label="Daily Rate"
              type="number"
              icon={CurrencyDollarIcon}
              validation={createValidation("dailyRate")}
              error={errors.dailyRate}
              isRequired={getFieldRequirement("dailyRate")}
            />
          )}

          {employeeType === "monthly" && (
            <InputField
              id="basicPay"
              label="Basic Pay"
              type="number"
              icon={CurrencyDollarIcon}
              validation={createValidation("basicPay")}
              error={errors.basicPay}
              isRequired={getFieldRequirement("basicPay")}
            />
          )}

          {/* Extra Options */}
          <div className="space-y-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={showExtra}
                onChange={(e) => setShowExtra(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600" />
              <span className="ml-2">Extra (Optional)</span>
            </label>

            {showExtra && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField
                  id="accAllowance"
                  label="ACC Allowance"
                  type="number"
                  icon={BanknotesIcon}
                  validation={createValidation("accAllowance")}
                  error={errors.accAllowance}
                  isRequired={getFieldRequirement("accAllowance")}
                />
                <InputField
                  id="foodAllowance"
                  label="Food Allowance"
                  type="number"
                  icon={BanknotesIcon}
                  validation={createValidation("foodAllowance")}
                  error={errors.foodAllowance}
                  isRequired={getFieldRequirement("foodAllowance")}
                />
                <InputField
                  id="telephoneAllowance"
                  label="Telephone Allowance"
                  type="number"
                  icon={PhoneIcon}
                  validation={createValidation("telephoneAllowance")}
                  error={errors.telephoneAllowance}
                  isRequired={getFieldRequirement("telephoneAllowance")}
                />
                <InputField
                  id="transportAllowance"
                  label="Transport Allowance"
                  type="number"
                  icon={TruckIcon}
                  validation={createValidation("transportAllowance")}
                  error={errors.transportAllowance}
                  isRequired={getFieldRequirement("transportAllowance")}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Vendor Billing Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-6">
          Vendor Billing Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            id="vendorName"
            label="Vendor Name"
            type="text"
            icon={BuildingOfficeIcon}
            validation={createValidation("vendorName")}
            error={errors.vendorName}
            isRequired={getFieldRequirement("vendorName")}
          />
          <InputField
            id="vendorWorkingHours"
            label="Working Hours"
            type="number"
            icon={ClockIcon}
            validation={createValidation("vendorWorkingHours")}
            error={errors.vendorWorkingHours}
            isRequired={getFieldRequirement("vendorWorkingHours")}
          />
          <InputField
            id="vendorRate"
            label="Rate"
            type="number"
            icon={CurrencyDollarIcon}
            validation={createValidation("vendorRate")}
            error={errors.vendorRate}
            isRequired={getFieldRequirement("vendorRate")}
          />
        </div>
      </div>
      {/* Customer Billing Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-6">
          Customer Billing Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            id="customerName"
            label="Customer Name"
            type="text"
            icon={UserIcon}
            validation={createValidation("customerName")}
            error={errors.customerName}
            isRequired={getFieldRequirement("customerName")}
          />
          <InputField
            id="customerWorkingHours"
            label="Working Hours"
            type="number"
            icon={ClockIcon}
            validation={createValidation("customerWorkingHours")}
            error={errors.customerWorkingHours}
            isRequired={getFieldRequirement("customerWorkingHours")}
          />
          <InputField
            id="customerRate"
            label="Rate"
            type="number"
            icon={CurrencyDollarIcon}
            validation={createValidation("customerRate")}
            error={errors.customerRate}
            isRequired={getFieldRequirement("customerRate")}
          />
        </div>
      </div>
    </div>)
  );
}

export default PaymentInfo