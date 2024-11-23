"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const AddEmployee = () => {
  const [employeeID] = useState(`EMP${Date.now()}`); // Auto-generate Employee ID
  const [activeTab, setActiveTab] = useState("employeeInfo"); // Manage active tab
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Handle form submission
  const onSubmit = (data) => {
    console.log("Form Data Submitted:", data);
    alert("Form submitted successfully!");
    reset(); // Reset form after submission
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const nationalities = [
    "United States",
    "India",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Other",
  ];

  const roles = ["Admin", "HR", "Developer", "Manager", "Other"];
  const religions = ["Christianity", "Islam", "Hinduism", "Buddhism", "Other"];

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
      {/* Tabs */}
      <div className="flex gap-6 border-b pb-2 mb-6 text-gray-600">
        <button
          onClick={() => setActiveTab("employeeInfo")}
          className={`${
            activeTab === "employeeInfo"
              ? "border-b-4 border-blue-500 text-blue-500"
              : "hover:text-blue-500"
          } pb-2 font-medium`}
        >
          Employee Information
        </button>
        <button
          onClick={() => setActiveTab("hrDetails")}
          className={`${
            activeTab === "hrDetails"
              ? "border-b-4 border-blue-500 text-blue-500"
              : "hover:text-blue-500"
          } pb-2 font-medium`}
        >
          HR Details
        </button>
        <button
          onClick={() => setActiveTab("documents")}
          className={`${
            activeTab === "documents"
              ? "border-b-4 border-blue-500 text-blue-500"
              : "hover:text-blue-500"
          } pb-2 font-medium`}
        >
          Documents
        </button>
        <button
          onClick={() => setActiveTab("paymentInfo")}
          className={`${
            activeTab === "paymentInfo"
              ? "border-b-4 border-blue-500 text-blue-500"
              : "hover:text-blue-500"
          } pb-2 font-medium`}
        >
          Payment Information
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {activeTab === "employeeInfo" && (
          <div>
            {/* Header */}
            <h3 className="text-2xl font-bold text-gray-800">
              Basic Information
            </h3>

            {/* Form Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upload Section */}
              <div className="flex flex-col items-center pt-20 border border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                <div className="bg-gray-200 rounded-full h-24 w-24 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm8 2a2 2 0 110 4 2 2 0 010-4zm-4 9a4 4 0 100-8 4 4 0 000 8z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm text-center">
                  Drag & Drop or Click to Upload
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Allowed formats: JPG, JPEG, PNG | Max size: 2MB
                </p>
                <input
                  type="file"
                  {...register("profilePhoto", {
                    required: "Profile photo is required",
                  })}
                  className="mt-2 w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                />
                {errors.profilePhoto && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.profilePhoto.message}
                  </p>
                )}
              </div>

              {/* Input Fields */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    First Name
                  </label>
                  <input
                    type="text"
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                    className={`border px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Last Name
                  </label>
                  <input
                    type="text"
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                    className={`border px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "Invalid email address",
                      },
                    })}
                    className={`border px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10,15}$/,
                        message: "Phone number must be 10-15 digits",
                      },
                    })}
                    className={`border px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full ${
                      errors.phoneNumber ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter phone number"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Gender
                  </label>
                  <select
                    {...register("gender", {
                      required: "Gender is required",
                    })}
                    className={`border px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full ${
                      errors.gender ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.gender.message}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    {...register("dob", {
                      required: "Date of birth is required",
                    })}
                    className={`border px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full ${
                      errors.dob ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.dob.message}
                    </p>
                  )}
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Blood Group
                  </label>
                  <select
                    {...register("bloodGroup", {
                      required: "Blood Group is required",
                    })}
                    className={`border px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full ${
                      errors.bloodGroup ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select BloodGroup</option>
                    {bloodGroups.map((group, index) => (
                      <option key={index} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                  {errors.bloodGroup && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.bloodGroup.message}
                    </p>
                  )}
                </div>

                {/* Nationality */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Nationality
                  </label>
                  <select
                    {...register("nationality", {
                      required: "Nationality is required",
                    })}
                    className={`border px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full ${
                      errors.nationality ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select nationality</option>
                    {nationalities.map((nation, index) => (
                      <option key={index} value={nation}>
                        {nation}
                      </option>
                    ))}
                  </select>
                  {errors.nationality && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.nationality.message}
                    </p>
                  )}
                </div>

                {/* Religion */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Religion
                  </label>
                  <select
                    {...register("religion", {
                      required: "Religion is required",
                    })}
                    className={`border px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full ${
                      errors.religion ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select religion</option>
                    {religions.map((religion, index) => (
                      <option key={index} value={religion}>
                        {religion}
                      </option>
                    ))}
                  </select>
                  {errors.religion && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.religion.message}
                    </p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Role
                  </label>
                  <select
                    {...register("role", {
                      required: "Role is required",
                    })}
                    className={`border px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full ${
                      errors.role ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select role</option>
                    {roles.map((role, index) => (
                      <option key={index} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.role.message}
                    </p>
                  )}
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Department
                  </label>
                  <input
                    type="text"
                    {...register("department", {
                      required: "Department is required",
                    })}
                    className={`border px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full ${
                      errors.department ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter Department"
                  />
                  {errors.department && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.department.message}
                    </p>
                  )}
                </div>

                {/* Employee ID (Read-Only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    {...register("employeeID", {
                      required: "Employee ID is required",
                    })}
                    value={employeeID}
                    readOnly
                    className="border px-4 py-2 rounded-lg bg-gray-100 shadow-sm w-full"
                  />
                </div>

                {/* Project/Company */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Project/Company
                  </label>
                  <input
                    type="text"
                    {...register("project", {
                      required: "Project/Company is required",
                    })}
                    className={`border px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full ${
                      errors.project ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter project/company"
                  />
                  {errors.project && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.project.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "hrDetails" && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              HR Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Department
                </label>
                <input
                  type="text"
                  {...register("department")}
                  className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
                  placeholder="Enter department"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Role
                </label>
                <input
                  type="text"
                  {...register("role")}
                  className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
                  placeholder="Enter role"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Documents
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Upload Photo
              </label>
              <input
                type="file"
                {...register("photo")}
                className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
              />
            </div>
          </div>
        )}

        {activeTab === "paymentInfo" && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Payment Information
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Bank Account
              </label>
              <input
                type="text"
                {...register("bankAccount")}
                className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
                placeholder="Enter bank account"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Save Information
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
