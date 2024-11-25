"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const PaymentInformation = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      basicPay: 0,
      overtimeHours: 0,
      holidayHours: 0,
      commission: 0,
      accAllowance: 0,
      foodAllowance: 0,
      telephoneAllowance: 0,
      transportAllowance: 0,
    },
  });

  const [showExtras, setShowExtras] = useState(false);

  // Watch values for dynamic calculations
  const watchFields = watch();
  const basicPay = parseFloat(watchFields.basicPay) || 0;
  const overtimeHours = parseFloat(watchFields.overtimeHours) || 0;
  const holidayHours = parseFloat(watchFields.holidayHours) || 0;
  const commissionPercentage = parseFloat(watchFields.commission) || 0;
  const allowances = {
    accAllowance: parseFloat(watchFields.accAllowance) || 0,
    foodAllowance: parseFloat(watchFields.foodAllowance) || 0,
    telephoneAllowance: parseFloat(watchFields.telephoneAllowance) || 0,
    transportAllowance: parseFloat(watchFields.transportAllowance) || 0,
  };

  // Calculate Total Pay
  const calculateTotalPay = () => {
    const overtimePay = (basicPay / 208) * 1.25 * overtimeHours;
    const holidayPay = (basicPay / 208) * 1.5 * holidayHours;
    const commissionPay = (basicPay * commissionPercentage) / 100;
    const totalAllowances = Object.values(allowances).reduce(
      (sum, value) => sum + value,
      0
    );
    return (
      basicPay + overtimePay + holidayPay + commissionPay + totalAllowances
    );
  };

  const onSubmit = (data) => {
    const totalPay = calculateTotalPay();
    console.log("Form Submitted:", { ...data, totalPay });
    alert(`Total Pay: ${totalPay.toFixed(2)}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <h3 className="text-2xl font-bold text-gray-800">
        Add Employee Work Information
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Employee Work Information */}
        <div className="col-span-1 border-2 border-dashed p-5 rounded-md">
          <h4 className="text-xl font-semibold text-gray-700 mb-4">
            Employee Work Information
          </h4>
          <div className="grid grid-cols-1 gap-6">
            {/* Employee Type */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Employee Type *
              </label>
              <div className="flex space-x-2">
                {["Hourly", "Daily", "Monthly", "Others"].map((type) => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value={type}
                      {...register("employeeType", {
                        required: "Employee Type is required",
                      })}
                      className="mr-1"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
              {errors.employeeType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.employeeType.message}
                </p>
              )}
            </div>

            {/* Shifts */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                First Shift *
              </label>
              <div className="flex space-x-2">
                <input
                  type="time"
                  {...register("firstShiftStart", {
                    required: "Start time is required",
                  })}
                  className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-1/2"
                />
                <input
                  type="time"
                  {...register("firstShiftEnd", {
                    required: "End time is required",
                  })}
                  className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-1/2"
                />
              </div>
            </div>

            {/* Basic Pay */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Basic Pay *
              </label>
              <input
                type="number"
                {...register("basicPay", { required: "Basic Pay is required" })}
                className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
                placeholder="Enter basic pay"
              />
              {errors.basicPay && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.basicPay.message}
                </p>
              )}
            </div>

            {/* Extra Fields Toggle */}
            <div className="mt-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  onChange={() => setShowExtras(!showExtras)}
                  className="mr-2"
                />
                <span className="font-medium text-gray-600">
                  Extra (Optional)
                </span>
              </label>
            </div>

            {showExtras && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {/* Over Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Over Time Hours (Normal @1.25)
                  </label>
                  <input
                    type="number"
                    {...register("overtimeHours")}
                    className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
                    placeholder="Enter hours"
                  />
                </div>

                {/* Holiday OT */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Holiday OT (@1.50)
                  </label>
                  <input
                    type="number"
                    {...register("holidayHours")}
                    className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
                    placeholder="Enter hours"
                  />
                </div>

                {/* Commission */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Commission (%)
                  </label>
                  <input
                    type="number"
                    {...register("commission")}
                    className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
                    placeholder="Enter percentage"
                  />
                </div>

                {/* Allowances */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    ACC Allowance
                  </label>
                  <input
                    type="number"
                    {...register("accAllowance")}
                    className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Food Allowance
                  </label>
                  <input
                    type="number"
                    {...register("foodAllowance")}
                    className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Telephone Allowance
                  </label>
                  <input
                    type="number"
                    {...register("telephoneAllowance")}
                    className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Transport Allowance
                  </label>
                  <input
                    type="number"
                    {...register("transportAllowance")}
                    className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
                    placeholder="Enter amount"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-2 space-y-5">
          {/* Vendor Billing Information */}
          <div className="border-2 border-dashed p-5 rounded-md">
            <h4 className="text-xl font-semibold text-gray-700 mb-4">
              Vendor Billing Information *
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Vendor Name *
                </label>
                <input
                  type="text"
                  {...register("vendorName", {
                    required: "Vendor Name is required",
                  })}
                  className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
                  placeholder="Enter vendor name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Working Hours *
                  </label>
                  <input
                    type="number"
                    {...register("vendorWorkingHours", {
                      required: "Working Hours are required",
                    })}
                    className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
                    placeholder="Enter hours"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Rate *
                  </label>
                  <input
                    type="number"
                    {...register("vendorRate", {
                      required: "Rate is required",
                    })}
                    className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
                    placeholder="Enter rate"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Customer Billing Information */}
          <div className="border-2 border-dashed p-5 rounded-md">
            <h4 className="text-xl font-semibold text-gray-700 mb-4">
              Customer Billing Information *
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Customer Name *
                </label>
                <input
                  type="text"
                  {...register("customerName", {
                    required: "Customer Name is required",
                  })}
                  className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
                  placeholder="Enter customer name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Working Hours *
                  </label>
                  <input
                    type="number"
                    {...register("customerWorkingHours", {
                      required: "Working Hours are required",
                    })}
                    className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
                    placeholder="Enter hours"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Rate *
                  </label>
                  <input
                    type="number"
                    {...register("customerRate", {
                      required: "Rate is required",
                    })}
                    className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
                    placeholder="Enter rate"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Total Pay */}
      <div className="mt-6">
        <h4 className="text-lg font-bold text-gray-700">
          Total Pay: {calculateTotalPay().toFixed(2)}
        </h4>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90"
      >
        Save Information
      </button>
    </form>
  );
};

export default PaymentInformation;
