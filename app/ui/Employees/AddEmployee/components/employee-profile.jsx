"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useProjectData } from "@/app/data/DataFetch";

const EmployeeProfileUpdate = ({ employeeData, employeeId }) => {
  const { data: projects } = useProjectData([]);

  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState(employeeData || null);
  const [activeTab, setActiveTab] = useState("personal");

  const {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Passport Number
              </label>
              <Controller
                name="passportNumber"
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
                Passport With
              </label>
              <Controller
                name="passportWith"
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
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
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
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                RP ID Number
              </label>
              <Controller
                name="rpIdNumber"
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
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
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
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              />
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
