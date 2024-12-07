import React from "react";
import { useForm } from "react-hook-form";

const CompanyModal = ({ data, onClose, onSave }) => {
  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: data || {
      id: "",
      companyName: "",
      location: "",
      category: "",
    },
  });

  // Handle Form Submission
  const onSubmit = (formData) => {
    console.log(formData);
    onSave(formData); // Pass the data to parent
    reset(); // Reset form
    onClose(); // Close modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          {data ? "Edit Company" : "Add New Company"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium">Company Name</label>
            <input
              type="text"
              {...register("companyName", {
                required: "Company name is required",
              })}
              className={`w-full border px-4 py-2 rounded-lg ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.companyName.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium">Location</label>
            <input
              type="text"
              {...register("location", { required: "Location is required" })}
              className={`w-full border px-4 py-2 rounded-lg ${
                errors.location ? "border-red-500" : ""
              }`}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">
                {errors.location.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium">Category</label>
            <input
              type="text"
              {...register("category", { required: "Category is required" })}
              className={`w-full border px-4 py-2 rounded-lg ${
                errors.category ? "border-red-500" : ""
              }`}
            />
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => {
                reset(); // Reset form
                onClose(); // Close modal
              }}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyModal;
