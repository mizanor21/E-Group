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

const InputField = ({
  id,
  label,
  type,
  icon: Icon,
  placeholder,
  validation,
  error,
  required
}) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
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

const TimeInput = ({ id, label, validation, error, required }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={id}
      type="time"
      className={`block w-full sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
        error ? "border-red-300" : ""
      }`}
      {...validation} />
    {error && <p className="text-sm text-red-600">{error.message}</p>}
  </div>
)

const PaymentInfo = () => {
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

  return (
    (<div className="space-y-8">
      {/* Employee Work Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-6">Employee Work Information</h3>

        <div className="space-y-6">
          {/* Employee Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Employee Type <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-4">
              {["hourly", "daily", "monthly", "others"].map((type) => (
                <label key={type} className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("employeeType", { required: "Employee type is required" })}
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
              placeholder="Enter hourly rate"
              validation={register("hourlyRate", { required: "Hourly rate is required" })}
              error={errors.hourlyRate}
              required />
          )}

          {employeeType === "daily" && (
            <InputField
              id="dailyRate"
              label="Daily Rate"
              type="number"
              icon={CurrencyDollarIcon}
              placeholder="Enter daily rate"
              validation={register("dailyRate", { required: "Daily rate is required" })}
              error={errors.dailyRate}
              required />
          )}

          {employeeType === "monthly" && (
            <InputField
              id="basicPay"
              label="Basic Pay"
              type="number"
              icon={CurrencyDollarIcon}
              placeholder="Enter basic pay"
              validation={register("basicPay", { required: "Basic pay is required" })}
              error={errors.basicPay}
              required />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  id="overTimeHours"
                  label="Over Time Hours (Normal @1.25)"
                  type="number"
                  icon={ClockIcon}
                  placeholder="0"
                  validation={register("overTimeHours")}
                  error={errors.overTimeHours} />
                <InputField
                  id="holidayOT"
                  label="Holiday OT (@1.50)"
                  type="number"
                  icon={ClockIcon}
                  placeholder="0"
                  validation={register("holidayOT")}
                  error={errors.holidayOT} />
                <InputField
                  id="commission"
                  label="Commission (%)"
                  type="number"
                  icon={CurrencyDollarIcon}
                  placeholder="0"
                  validation={register("commission")}
                  error={errors.commission} />
                <InputField
                  id="accAllowance"
                  label="ACC Allowance"
                  type="number"
                  icon={BanknotesIcon}
                  placeholder="0"
                  validation={register("accAllowance")}
                  error={errors.accAllowance} />
                <InputField
                  id="foodAllowance"
                  label="Food Allowance"
                  type="number"
                  icon={BanknotesIcon}
                  placeholder="0"
                  validation={register("foodAllowance")}
                  error={errors.foodAllowance} />
                <InputField
                  id="telephoneAllowance"
                  label="Telephone Allowance"
                  type="number"
                  icon={PhoneIcon}
                  placeholder="0"
                  validation={register("telephoneAllowance")}
                  error={errors.telephoneAllowance} />
                <InputField
                  id="transportAllowance"
                  label="Transport Allowance"
                  type="number"
                  icon={TruckIcon}
                  placeholder="0"
                  validation={register("transportAllowance")}
                  error={errors.transportAllowance} />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Vendor Billing Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-6">
          Vendor Billing Information <span className="text-red-500">*</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            id="vendorName"
            label="Vendor Name"
            type="text"
            icon={BuildingOfficeIcon}
            placeholder="Enter vendor name"
            validation={register("vendorName", { required: "Vendor name is required" })}
            error={errors.vendorName}
            required />
          <InputField
            id="vendorWorkingHours"
            label="Working Hours"
            type="number"
            icon={ClockIcon}
            placeholder="Enter hours"
            validation={register("vendorWorkingHours", { required: "Working hours is required" })}
            error={errors.vendorWorkingHours}
            required />
          <InputField
            id="vendorRate"
            label="Rate"
            type="number"
            icon={CurrencyDollarIcon}
            placeholder="Enter rate"
            validation={register("vendorRate", { required: "Rate is required" })}
            error={errors.vendorRate}
            required />
        </div>
      </div>
      {/* Customer Billing Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-6">
          Customer Billing Information <span className="text-red-500">*</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            id="customerName"
            label="Customer Name"
            type="text"
            icon={UserIcon}
            placeholder="Enter customer name"
            validation={register("customerName", { required: "Customer name is required" })}
            error={errors.customerName}
            required />
          <InputField
            id="customerWorkingHours"
            label="Working Hours"
            type="number"
            icon={ClockIcon}
            placeholder="Enter hours"
            validation={register("customerWorkingHours", { required: "Working hours is required" })}
            error={errors.customerWorkingHours}
            required />
          <InputField
            id="customerRate"
            label="Rate"
            type="number"
            icon={CurrencyDollarIcon}
            placeholder="Enter rate"
            validation={register("customerRate", { required: "Rate is required" })}
            error={errors.customerRate}
            required />
        </div>
      </div>
    </div>)
  );
}

export default PaymentInfo

