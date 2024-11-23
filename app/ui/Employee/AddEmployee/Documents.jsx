"use client";
import React from "react";
import { useForm } from "react-hook-form";

const Documents = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    console.log("Documents:", data);
    reset(); // Reset form after submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800">Documents</h3>
      <div>
        <label className="block text-sm font-medium text-gray-600">
          Upload Resume
        </label>
        <input
          type="file"
          {...register("resume", { required: "Resume is required" })}
          className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Save Documents
      </button>
    </form>
  );
};

export default Documents;
