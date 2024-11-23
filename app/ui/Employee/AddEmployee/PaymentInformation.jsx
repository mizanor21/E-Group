"use client";
import React from "react";
import { useForm } from "react-hook-form";

const PaymentInformation = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    console.log("Payment Information:", data);
    reset(); // Reset form after submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800">Payment Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Bank Name
          </label>
          <input
            type="text"
            {...register("bankName", { required: "Bank name is required" })}
            className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
            placeholder="Enter Bank Name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Account Number
          </label>
          <input
            type="text"
            {...register("accountNumber", {
              required: "Account number is required",
            })}
            className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
            placeholder="Enter Account Number"
          />
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Save Payment Information
      </button>
    </form>
  );
};

export default PaymentInformation;
