"use client"

import { useState } from "react"
import { useFormContext } from "react-hook-form"
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  IdentificationIcon,
  GlobeAltIcon,
  HomeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline"

const InputField = ({ id, label, type, icon: Icon, validation, error }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative rounded-md shadow-sm">
      <div
        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        id={id}
        type={type}
        {...validation}
        className={`block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
          error ? "border-red-300" : ""
        }`} />
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
  </div>
)

const SelectField = ({ id, label, options, validation, error }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      id={id}
      {...validation}
      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
        error ? "border-red-300" : ""
      }`}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
  </div>
)

const EmployeeBasicInfo = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext()
  const [isSameAddress, setIsSameAddress] = useState(false)

  const watchPresentAddress1 = watch("presentAddress1")
  const watchPresentAddress2 = watch("presentAddress2")
  const watchPresentCity = watch("presentCity")
  const watchPresentDivision = watch("presentDivision")
  const watchPresentPostOrZipCode = watch("presentPostOrZipCode")

  return (
    (<div className="bg-white p-6 rounded-lg shadow-md space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            id="firstName"
            label="First Name"
            type="text"
            icon={UserIcon}
            validation={register("firstName", { required: "First name is required" })}
            error={errors.firstName} />
          <InputField
            id="lastName"
            label="Last Name"
            type="text"
            icon={UserIcon}
            validation={register("lastName", { required: "Last name is required" })}
            error={errors.lastName} />
          <InputField
            id="email"
            label="Email"
            type="email"
            icon={EnvelopeIcon}
            validation={register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            error={errors.email} />
          <InputField
            id="phoneNumber"
            label="Phone Number"
            type="tel"
            icon={PhoneIcon}
            validation={register("phoneNumber", { required: "Phone number is required" })}
            error={errors.phoneNumber} />
          <InputField
            id="dob"
            label="Date of Birth"
            type="date"
            icon={CalendarIcon}
            validation={register("dob", { required: "Date of birth is required" })}
            error={errors.dob} />
          <InputField
            id="employeeID"
            label="Employee ID"
            type="text"
            icon={IdentificationIcon}
            validation={register("employeeID", { required: "Employee ID is required" })}
            error={errors.employeeID} />
          <SelectField
            id="gender"
            label="Gender"
            options={[
              { value: "", label: "Select Gender" },
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ]}
            validation={register("gender", { required: "Gender is required" })}
            error={errors.gender} />
          <InputField
            id="nationality"
            label="Nationality"
            type="text"
            icon={GlobeAltIcon}
            validation={register("nationality", { required: "Nationality is required" })}
            error={errors.nationality} />
          <SelectField
            id="bloodGroup"
            label="Blood Group"
            options={[
              { value: "", label: "Select Blood Group" },
              { value: "A+", label: "A+" },
              { value: "A-", label: "A-" },
              { value: "B+", label: "B+" },
              { value: "B-", label: "B-" },
              { value: "AB+", label: "AB+" },
              { value: "AB-", label: "AB-" },
              { value: "O+", label: "O+" },
              { value: "O-", label: "O-" },
            ]}
            validation={register("bloodGroup", { required: "Blood group is required" })}
            error={errors.bloodGroup} />
          <InputField
            id="religion"
            label="Religion"
            type="text"
            icon={UserIcon}
            validation={register("religion")}
            error={errors.religion} />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Address Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            id="presentAddress1"
            label="Present Address Line 1"
            type="text"
            icon={HomeIcon}
            validation={register("presentAddress1", { required: "Present address is required" })}
            error={errors.presentAddress1} />
          <InputField
            id="presentAddress2"
            label="Present Address Line 2"
            type="text"
            icon={HomeIcon}
            validation={register("presentAddress2")}
            error={errors.presentAddress2} />
          <InputField
            id="presentCity"
            label="Present City"
            type="text"
            icon={HomeIcon}
            validation={register("presentCity", { required: "Present city is required" })}
            error={errors.presentCity} />
          <InputField
            id="presentDivision"
            label="Present Division/State"
            type="text"
            icon={HomeIcon}
            validation={register("presentDivision", { required: "Present division/state is required" })}
            error={errors.presentDivision} />
          <InputField
            id="presentPostOrZipCode"
            label="Present Post/Zip Code"
            type="text"
            icon={HomeIcon}
            validation={register("presentPostOrZipCode", { required: "Present post/zip code is required" })}
            error={errors.presentPostOrZipCode} />
        </div>

        <div className="mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={isSameAddress}
              onChange={() => setIsSameAddress(!isSameAddress)} />
            <span className="ml-2 text-gray-700">Permanent address same as present address</span>
          </label>
        </div>

        {!isSameAddress && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <InputField
              id="permanentAddress1"
              label="Permanent Address Line 1"
              type="text"
              icon={HomeIcon}
              validation={register("permanentAddress1", { required: "Permanent address is required" })}
              error={errors.permanentAddress1} />
            <InputField
              id="permanentAddress2"
              label="Permanent Address Line 2"
              type="text"
              icon={HomeIcon}
              validation={register("permanentAddress2")}
              error={errors.permanentAddress2} />
            <InputField
              id="permanentCity"
              label="Permanent City"
              type="text"
              icon={HomeIcon}
              validation={register("permanentCity", { required: "Permanent city is required" })}
              error={errors.permanentCity} />
            <InputField
              id="permanentDivision"
              label="Permanent Division/State"
              type="text"
              icon={HomeIcon}
              validation={register("permanentDivision", { required: "Permanent division/state is required" })}
              error={errors.permanentDivision} />
            <InputField
              id="permanentPostOrZipCode"
              label="Permanent Post/Zip Code"
              type="text"
              icon={HomeIcon}
              validation={register(
                "permanentPostOrZipCode",
                { required: "Permanent post/zip code is required" }
              )}
              error={errors.permanentPostOrZipCode} />
          </div>
        )}
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Qualification & Work Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            id="qualification"
            label="Highest Qualification"
            type="text"
            icon={AcademicCapIcon}
            validation={register("qualification", { required: "Qualification is required" })}
            error={errors.qualification} />
          <InputField
            id="experience"
            label="Years of Experience"
            type="number"
            icon={BriefcaseIcon}
            validation={register("experience", { required: "Experience is required" })}
            error={errors.experience} />
          <InputField
            id="department"
            label="Department"
            type="text"
            icon={BriefcaseIcon}
            validation={register("department", { required: "Department is required" })}
            error={errors.department} />
          <InputField
            id="currentJob"
            label="Current Job Title"
            type="text"
            icon={BriefcaseIcon}
            validation={register("currentJob", { required: "Current job title is required" })}
            error={errors.currentJob} />
          <InputField
            id="actualJob"
            label="Actual Job Title"
            type="text"
            icon={BriefcaseIcon}
            validation={register("actualJob")}
            error={errors.actualJob} />
          <InputField
            id="project"
            label="Current Project"
            type="text"
            icon={BriefcaseIcon}
            validation={register("project")}
            error={errors.project} />
          <SelectField
            id="role"
            label="Role"
            options={[
              { value: "", label: "Select Role" },
              { value: "employee", label: "Employee" },
              { value: "manager", label: "Manager" },
              { value: "admin", label: "Admin" },
            ]}
            validation={register("role", { required: "Role is required" })}
            error={errors.role} />
          <InputField
            id="accommodation"
            label="Accommodation"
            type="text"
            icon={HomeIcon}
            validation={register("accommodation")}
            error={errors.accommodation} />
        </div>
        <div className="mt-4">
          <label
            htmlFor="remarks"
            className="block text-sm font-medium text-gray-700 mb-1">
            Remarks
          </label>
          <textarea
            id="remarks"
            {...register("remarks")}
            rows={3}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md" />
        </div>
      </div>
    </div>)
  );
}

export default EmployeeBasicInfo

