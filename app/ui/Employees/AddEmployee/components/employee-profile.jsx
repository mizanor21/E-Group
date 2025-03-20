"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useProjectData } from "@/app/data/DataFetch";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

const EmployeeProfileUpdate = ({ employeeData, employeeId }) => {
  const { data: projects } = useProjectData([]);

  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState(employeeData || null);
  const [activeTab, setActiveTab] = useState("personal");

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: employeeData || {},
  });

  const isSameAddress = watch("isSameAddress", false);

  // Fetch employee data if not provided as prop
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/employees/${employeeId}`);
        setEmployee(response.data);
        reset(response.data); // Set form values
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch employee data");
        setLoading(false);
      }
    };

    if (!employeeData && employeeId) {
      fetchEmployee();
    }
  }, [employeeId, reset, employeeData]);

  // Set form values when employeeData prop changes
  useEffect(() => {
    if (employeeData) {
      setEmployee(employeeData);
      reset(employeeData);
    }
  }, [employeeData, reset]);

  // Handle address sync when isSameAddress is checked
  useEffect(() => {
    if (isSameAddress) {
      const presentAddress1 = watch("presentAddress1");
      const presentAddress2 = watch("presentAddress2");
      const presentCity = watch("presentCity");
      const presentDivision = watch("presentDivision");
      const presentPostOrZipCode = watch("presentPostOrZipCode");

      setValue("permanentAddress1", presentAddress1);
      setValue("permanentAddress2", presentAddress2);
      setValue("permanentCity", presentCity);
      setValue("permanentDivision", presentDivision);
      setValue("permanentPostOrZipCode", presentPostOrZipCode);
    }
  }, [isSameAddress, setValue, watch]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await axios.patch(`/api/employees/${employeeId || employee._id}`, data);
      toast.success("Employee profile updated successfully");
      setLoading(false);
    } catch (error) {
      toast.error("Failed to update employee profile");
      setLoading(false);
    }
  };

  if (loading && !employee) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading employee data...
      </div>
    );
  }

  const tabClasses = "px-4 py-2 text-sm font-medium rounded-t-lg";
  const activeTabClasses = `${tabClasses} bg-blue-600 text-white`;
  const inactiveTabClasses = `${tabClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`;

  // Helper function to format dates for input fields
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
  };

  const FileUpload = ({ id, label, validation, error, setValue }) => {
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [fileUrl, setFileUrl] = useState("");

    const handleFileChange = async (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setPreview(URL.createObjectURL(file));

        // Begin upload to Cloudinary
        setUploading(true);

        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "habson"); // Replace with your Cloudinary upload preset

          const response = await fetch(
            "https://api.cloudinary.com/v1_1/dov6k7xdk/image/upload",
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error("Upload failed");
          }

          const data = await response.json();
          setFileUrl(data.secure_url);

          // Update the form value with the Cloudinary URL
          setValue(id, data.secure_url);
        } catch (error) {
          console.error("Error uploading file:", error);
          toast.error(`Failed to upload ${label}`);
        } finally {
          setUploading(false);
        }
      }
    };

    return (
      <div className="space-y-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-sm text-gray-500">Uploading...</p>
              </div>
            ) : preview ? (
              <div className="flex flex-col items-center">
                <img
                  src={preview}
                  alt="File preview"
                  className="h-32 object-contain mb-2"
                />
                <span className="text-sm text-gray-500">
                  {fileUrl ? "Uploaded to Cloudinary" : "Processing..."}
                </span>
              </div>
            ) : (
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            )}
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor={id}
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span>{fileUrl ? "Change file" : "Upload a file"}</span>
                <input
                  id={id}
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">JPG, PNG up to 10MB</p>
            {fileUrl && (
              <p className="text-xs text-green-500 break-all mt-1">
                File uploaded: {fileUrl.substring(0, 30)}...
              </p>
            )}
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error.message}</p>}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Update Employee Profile
      </h1>

      {/* Tabs */}
      <div className="flex mb-6 space-x-2 border-b">
        <button
          type="button"
          className={
            activeTab === "personal" ? activeTabClasses : inactiveTabClasses
          }
          onClick={() => setActiveTab("personal")}
        >
          Personal Information
        </button>
        <button
          type="button"
          className={
            activeTab === "address" ? activeTabClasses : inactiveTabClasses
          }
          onClick={() => setActiveTab("address")}
        >
          Address
        </button>
        <button
          type="button"
          className={
            activeTab === "employment" ? activeTabClasses : inactiveTabClasses
          }
          onClick={() => setActiveTab("employment")}
        >
          Employment
        </button>
        <button
          type="button"
          className={
            activeTab === "documents" ? activeTabClasses : inactiveTabClasses
          }
          onClick={() => setActiveTab("documents")}
        >
          Documents
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Personal Information Tab */}
        {activeTab === "personal" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <Controller
                name="firstName"
                control={control}
                rules={{ required: "First name is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <Controller
                name="lastName"
                control={control}
                rules={{ required: "Last name is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <Controller
                name="dob"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <input
                    {...field}
                    type="date"
                    value={formatDate(value)}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Employee ID
              </label>
              <Controller
                name="employeeID"
                control={control}
                rules={{ required: "Employee ID is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              />
              {errors.employeeID && (
                <p className="text-red-500 text-xs">
                  {errors.employeeID.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nationality
              </label>
              <Controller
                name="nationality"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Blood Group
              </label>
              <Controller
                name="bloodGroup"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Religion
              </label>
              <Controller
                name="religion"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              />
            </div>
          </div>
        )}

        {/* Address Tab */}
        {activeTab === "address" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Present Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address Line 1
                </label>
                <Controller
                  name="presentAddress1"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address Line 2
                </label>
                <Controller
                  name="presentAddress2"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <Controller
                  name="presentCity"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Division/State
                </label>
                <Controller
                  name="presentDivision"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Postal/Zip Code
                </label>
                <Controller
                  name="presentPostOrZipCode"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                />
              </div>
            </div>

            <div className="mt-4 mb-4">
              <Controller
                name="isSameAddress"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isSameAddress"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isSameAddress"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Same as Present Address
                    </label>
                  </div>
                )}
              />
            </div>

            {!isSameAddress && (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Permanent Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Address Line 1
                    </label>
                    <Controller
                      name="permanentAddress1"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Address Line 2
                    </label>
                    <Controller
                      name="permanentAddress2"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <Controller
                      name="permanentCity"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Division/State
                    </label>
                    <Controller
                      name="permanentDivision"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Postal/Zip Code
                    </label>
                    <Controller
                      name="permanentPostOrZipCode"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Employment Tab */}
        {activeTab === "employment" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Actual Job
              </label>
              <Controller
                name="actualJob"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Current Job
              </label>
              <Controller
                name="currentJob"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Project
              </label>
              <Controller
                name="project"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a project</option>
                    {projects?.map((p) => (
                      <option key={p._id} value={p.project}>
                        {p?.project}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Employee Type
              </label>
              <Controller
                name="employeeType"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select type</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                    <option value="others">Others</option>
                  </select>
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Experience
              </label>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Qualification
              </label>
              <Controller
                name="qualification"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select role</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="employee">Employee</option>
                    <option value="contractor">Contractor</option>
                  </select>
                )}
              />
            </div>

            {employee.employeeType === "hourly" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Hourly Rate
                </label>
                <Controller
                  name="hourlyRate"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                />
              </div>
            )}
            {employee.employeeType === "daily" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Daily Rate{" "}
                </label>
                <Controller
                  name="dailyRate"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                />
              </div>
            )}
            {employee.employeeType === "monthly" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Basic Pay
                </label>
                <Controller
                  name="basicPay"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                />
              </div>
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div className="bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Document Information
            </h2>

            {/* Document Information Section */}
            <div className="bg-gray-50 p-5 rounded-lg mb-8">
              <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Passport & ID Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">
                    Passport Number
                  </label>
                  <Controller
                    name="passportNumber"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Enter passport number"
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">
                    Passport Issuing Authority
                  </label>
                  <Controller
                    name="passportWith"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Enter issuing authority"
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">
                    Passport Issue Date
                  </label>
                  <Controller
                    name="passportIssueDate"
                    control={control}
                    render={({ field: { value, onChange, ...field } }) => (
                      <input
                        {...field}
                        type="date"
                        value={formatDate(value)}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">
                    Passport Expiry Date
                  </label>
                  <Controller
                    name="passportExpiryDate"
                    control={control}
                    render={({ field: { value, onChange, ...field } }) => (
                      <input
                        {...field}
                        type="date"
                        value={formatDate(value)}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">
                    RP ID Number
                  </label>
                  <Controller
                    name="rpIdNumber"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Enter RP ID number"
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">
                    RP ID Issue Date
                  </label>
                  <Controller
                    name="rpIdIssueDate"
                    control={control}
                    render={({ field: { value, onChange, ...field } }) => (
                      <input
                        {...field}
                        type="date"
                        value={formatDate(value)}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">
                    RP ID Expiry Date
                  </label>
                  <Controller
                    name="rpIdExpiryDate"
                    control={control}
                    render={({ field: { value, onChange, ...field } }) => (
                      <input
                        {...field}
                        type="date"
                        value={formatDate(value)}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="bg-gray-50 p-5 rounded-lg">
              <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Document Uploads
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                <div className="border rounded-lg overflow-hidden bg-white">
                  <div className="p-4 border-b bg-gray-50">
                    <h4 className="font-medium text-gray-700">VISA Proof</h4>
                  </div>
                  <div className="p-4">
                    {employee?.visaProof ? (
                      <div className="mb-4">
                        <div className="relative rounded-md overflow-hidden bg-gray-100">
                          <Image
                            src={employee.visaProof}
                            width={300}
                            height={300}
                            alt="VISA Proof"
                            className="w-full max-h-[500px] object-contain"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 mb-4">
                        No document uploaded
                      </div>
                    )}
                    <FileUpload
                      id="visaProof"
                      label="Upload VISA Document"
                      validation={register("visaProof")}
                      error={errors.visaProof}
                      setValue={setValue}
                    />
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden bg-white">
                  <div className="p-4 border-b bg-gray-50">
                    <h4 className="font-medium text-gray-700">
                      Passport Proof
                    </h4>
                  </div>
                  <div className="p-4">
                    {employee?.passportProof ? (
                      <div className="mb-4">
                        <div className="relative rounded-md overflow-hidden bg-gray-100">
                          <Image
                            src={employee.passportProof}
                            width={300}
                            height={300}
                            alt="Passport Proof"
                            className="w-full max-h-[500px] object-contain"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 mb-4">
                        No document uploaded
                      </div>
                    )}
                    <FileUpload
                      id="passportProof"
                      label="Upload Passport Document"
                      validation={register("passportProof")}
                      error={errors.passportProof}
                      setValue={setValue}
                    />
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden bg-white">
                  <div className="p-4 border-b bg-gray-50">
                    <h4 className="font-medium text-gray-700">RP/ID Proof</h4>
                  </div>
                  <div className="p-4">
                    {employee?.rpIdProof ? (
                      <div className="mb-4">
                        <div className="relative rounded-md overflow-hidden bg-gray-100">
                          <Image
                            src={employee.rpIdProof}
                            width={300}
                            height={300}
                            alt="RP/ID Proof"
                            className="w-full max-h-[500px] object-contain"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 mb-4">
                        No document uploaded
                      </div>
                    )}
                    <FileUpload
                      id="rpIdProof"
                      label="Upload RP/ID Document"
                      validation={register("rpIdProof")}
                      error={errors.rpIdProof}
                      setValue={setValue}
                    />
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden bg-white">
                  <div className="p-4 border-b bg-gray-50">
                    <h4 className="font-medium text-gray-700">
                      Hired From Document
                    </h4>
                  </div>
                  <div className="p-4">
                    {employee?.hiredFromDocuments ? (
                      <div className="mb-4">
                        <div className="relative rounded-md overflow-hidden bg-gray-100">
                          <Image
                            src={employee.hiredFromDocuments}
                            width={300}
                            height={300}
                            alt="Hired From Document"
                            className="w-full max-h-[500px] object-contain"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 mb-4">
                        No document uploaded
                      </div>
                    )}
                    <FileUpload
                      id="hiredFromDocuments"
                      label="Upload Hired From Document"
                      validation={register("hiredFromDocuments")}
                      error={errors.hiredFromDocuments}
                      setValue={setValue}
                    />
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden bg-white">
                  <div className="p-4 border-b bg-gray-50">
                    <h4 className="font-medium text-gray-700">
                      Hired By Document
                    </h4>
                  </div>
                  <div className="p-4">
                    {employee?.hiredByDocuments ? (
                      <div className="mb-4">
                        <div className="relative rounded-md overflow-hidden bg-gray-100">
                          <Image
                            src={employee.hiredByDocuments}
                            width={300}
                            height={300}
                            alt="Hired By Document"
                            className="w-full max-h-[500px] object-contain"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 mb-4">
                        No document uploaded
                      </div>
                    )}
                    <FileUpload
                      id="hiredByDocuments"
                      label="Upload Hired By Document"
                      validation={register("hiredByDocuments")}
                      error={errors.hiredByDocuments}
                      setValue={setValue}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => reset(employee)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={!isDirty || loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeProfileUpdate;
