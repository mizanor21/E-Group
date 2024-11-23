"use client";
import React from "react";
import { useForm } from "react-hook-form";

const HRDetails = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    console.log("HR Details:", data);
    reset(); // Reset form after submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800">HR Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Role
          </label>
          <input
            type="text"
            {...register("role", { required: "Role is required" })}
            className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
            placeholder="Enter Role"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Department
          </label>
          <input
            type="text"
            {...register("department", { required: "Department is required" })}
            className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
            placeholder="Enter Department"
          />
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
