"use client"

import { useState, useEffect } from "react"
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
import { useProjectData } from "@/app/data/DataFetch"

// Project prefix mapping
const PROJECT_PREFIXES = {
  "Project A": "PA",
  "Project B": "PB",
  "Project C": "PC",
  // Add more projects and their prefixes as needed
}

// Function to generate a unique ID
const generateUID = () => {
  return Math.floor(1000 + Math.random() * 9000) // 4-digit number
}

const InputField = ({ id, label, type, icon: Icon, validation, error, disabled = false }) => (
  <div className="w-full">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      )}
      <input
        id={id}
        type={type}
        {...validation}
        disabled={disabled}
        className={`w-full px-4 py-2 pl-10 border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:text-white transition-all duration-300 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600"}
          ${disabled ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed" : ""}`}
        placeholder={`Enter ${label.toLowerCase()}...`}
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
  </div>
)

const SelectField = ({ id, label, options, validation, error, onChange }) => (
  <div className="w-full">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <div className="relative">
      <select
        id={id}
        {...validation}
        onChange={(e) => {
          validation.onChange(e)
          if (onChange) onChange(e)
        }}
        className={`block w-full px-4 py-2 appearance-none border rounded-lg bg-white dark:bg-gray-800 dark:text-white shadow-sm transition-all duration-300 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600"}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.19l3.71-3.96a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0L5.21 8.25a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
  </div>
)

const EmployeeBasicInfo = () => {
  const { data } = useProjectData([]) // Fetch project data
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext()
  const [isSameAddress, setIsSameAddress] = useState(false)
  const [employeeIdGenerated, setEmployeeIdGenerated] = useState(false)

  const watchPresentAddress1 = watch("presentAddress1")
  const watchPresentAddress2 = watch("presentAddress2")
  const watchPresentCity = watch("presentCity")
  const watchPresentDivision = watch("presentDivision")
  const watchPresentPostOrZipCode = watch("presentPostOrZipCode")
  const selectedProject = watch("project")

  // Extract unique project names from the data
  const uniqueProjects = [...new Set(data?.map((item) => item.project))]

  // Create options for the SelectField
  const projectOptions = [
    { value: "", label: "Select Project" }, // Default option
    ...uniqueProjects.map((project) => ({
      value: project,
      label: project,
    })),
  ]

  // Generate employee ID when project changes
  useEffect(() => {
    if (selectedProject) {
      // Get project prefix (use the project name if no mapping exists)
      const prefix = PROJECT_PREFIXES[selectedProject] || selectedProject.substring(0, 2).toUpperCase()

      // Generate a timestamp component (last 2 digits of current year + month)
      const date = new Date()
      const year = date.getFullYear().toString().slice(-2)
      const month = (date.getMonth() + 1).toString().padStart(2, "0")
      const timeComponent = year + month

      // Generate unique ID
      const uid = generateUID()

      // Combine to create employee ID: PREFIX-YYMM-UID
      const employeeId = `${prefix}-${timeComponent}-${uid}`

      // Set the value in the form
      setValue("employeeID", employeeId)
      setEmployeeIdGenerated(true)
    }
  }, [selectedProject, setValue])

  // Handle permanent address same as present address
  useEffect(() => {
    if (isSameAddress) {
      setValue("permanentAddress1", watchPresentAddress1)
      setValue("permanentAddress2", watchPresentAddress2)
      setValue("permanentCity", watchPresentCity)
      setValue("permanentDivision", watchPresentDivision)
      setValue("permanentPostOrZipCode", watchPresentPostOrZipCode)
    }
  }, [
    isSameAddress,
    watchPresentAddress1,
    watchPresentAddress2,
    watchPresentCity,
    watchPresentDivision,
    watchPresentPostOrZipCode,
    setValue,
  ])

  // Handle project change
  const handleProjectChange = (e) => {
    // The employee ID will be automatically generated by the useEffect above
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            id="firstName"
            label="First Name *"
            type="text"
            icon={UserIcon}
            validation={register("firstName", { required: "First name is required" })}
            error={errors.firstName}
          />
          <InputField
            id="lastName"
            label="Last Name"
            type="text"
            icon={UserIcon}
            validation={register("lastName")}
            error={errors.lastName}
          />
          <InputField
            id="email"
            label="Email"
            type="email"
            icon={EnvelopeIcon}
            validation={register("email", {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            error={errors.email}
          />
          <InputField
            id="phoneNumber"
            label="Phone Number"
            type="tel"
            icon={PhoneIcon}
            validation={register("phoneNumber")}
            error={errors.phoneNumber}
          />
          <InputField
            id="dob"
            label="Date of Birth"
            type="date"
            icon={CalendarIcon}
            validation={register("dob")}
            error={errors.dob}
          />
          <SelectField
            id="project"
            label="Project *"
            options={projectOptions}
            validation={register("project", { required: "Project is required" })}
            error={errors.project}
            onChange={handleProjectChange}
          />
          <InputField
            id="employeeID"
            label="Employee ID *"
            type="text"
            icon={IdentificationIcon}
            validation={register("employeeID", { required: "Employee ID is required" })}
            error={errors.employeeID}
            // disabled={employeeIdGenerated} // Disable the field if ID is auto-generated
          />
          <SelectField
            id="gender"
            label="Gender *"
            options={[
              { value: "", label: "Select Gender" },
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ]}
            validation={register("gender", { required: "Gender is required" })}
            error={errors.gender}
          />
          <InputField
            id="nationality"
            label="Nationality *"
            type="text"
            icon={GlobeAltIcon}
            validation={register("nationality", { required: "Nationality is required" })}
            error={errors.nationality}
          />
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
            validation={register("bloodGroup")}
            error={errors.bloodGroup}
          />
          <InputField
            id="religion"
            label="Religion"
            type="text"
            icon={UserIcon}
            validation={register("religion")}
            error={errors.religion}
          />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Address Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            id="presentAddress1"
            label="Present Address Line 1"
            type="text"
            icon={HomeIcon}
            validation={register("presentAddress1")}
            error={errors.presentAddress1}
          />
          <InputField
            id="presentAddress2"
            label="Present Address Line 2"
            type="text"
            icon={HomeIcon}
            validation={register("presentAddress2")}
            error={errors.presentAddress2}
          />
          <InputField
            id="presentCity"
            label="Present City"
            type="text"
            icon={HomeIcon}
            validation={register("presentCity")}
            error={errors.presentCity}
          />
          <InputField
            id="presentDivision"
            label="Present Division/State"
            type="text"
            icon={HomeIcon}
            validation={register("presentDivision")}
            error={errors.presentDivision}
          />
          <InputField
            id="presentPostOrZipCode"
            label="Present Post/Zip Code"
            type="text"
            icon={HomeIcon}
            validation={register("presentPostOrZipCode")}
            error={errors.presentPostOrZipCode}
          />
        </div>

        <div className="mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={isSameAddress}
              onChange={() => setIsSameAddress(!isSameAddress)}
            />
            <span className="ml-2 text-gray-700">Permanent address same as present address</span>
          </label>
        </div>

        {!isSameAddress && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <InputField
              id="permanentAddress1"
              label="Permanent Address Line 1"
              type="text"
              icon={HomeIcon}
              validation={register("permanentAddress1")}
              error={errors.permanentAddress1}
            />
            <InputField
              id="permanentAddress2"
              label="Permanent Address Line 2"
              type="text"
              icon={HomeIcon}
              validation={register("permanentAddress2")}
              error={errors.permanentAddress2}
            />
            <InputField
              id="permanentCity"
              label="Permanent City"
              type="text"
              icon={HomeIcon}
              validation={register("permanentCity")}
              error={errors.permanentCity}
            />
            <InputField
              id="permanentDivision"
              label="Permanent Division/State"
              type="text"
              icon={HomeIcon}
              validation={register("permanentDivision")}
              error={errors.permanentDivision}
            />
            <InputField
              id="permanentPostOrZipCode"
              label="Permanent Post/Zip Code"
              type="text"
              icon={HomeIcon}
              validation={register("permanentPostOrZipCode")}
              error={errors.permanentPostOrZipCode}
            />
          </div>
        )}
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Qualification & Work Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            id="qualification"
            label="Highest Qualification"
            type="text"
            icon={AcademicCapIcon}
            validation={register("qualification")}
            error={errors.qualification}
          />
          <InputField
            id="experience"
            label="Years of Experience"
            type="number"
            icon={BriefcaseIcon}
            validation={register("experience")}
            error={errors.experience}
          />
          <InputField
            id="department"
            label="Department"
            type="text"
            icon={BriefcaseIcon}
            validation={register("department")}
            error={errors.department}
          />
          <InputField
            id="currentJob"
            label="Current Job Title"
            type="text"
            icon={BriefcaseIcon}
            validation={register("currentJob")}
            error={errors.currentJob}
          />
          <InputField
            id="actualJob"
            label="Actual Job Title"
            type="text"
            icon={BriefcaseIcon}
            validation={register("actualJob")}
            error={errors.actualJob}
          />

          <SelectField
            id="role"
            label="Role"
            options={[
              { value: "", label: "Select Role" },
              { value: "employee", label: "Employee" },
              { value: "manager", label: "Manager" },
              { value: "admin", label: "Admin" },
            ]}
            validation={register("role")}
            error={errors.role}
          />
          <InputField
            id="accommodation"
            label="Accommodation"
            type="text"
            icon={HomeIcon}
            validation={register("accommodation")}
            error={errors.accommodation}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
            Remarks
          </label>
          <textarea
            id="remarks"
            {...register("remarks")}
            rows={3}
            className="p-3 text-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
      </div>
    </div>
  )
}

export default EmployeeBasicInfo

