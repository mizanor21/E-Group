import { useFormContext } from "react-hook-form"
import {
  BriefcaseIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  CalendarIcon,
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

const HRDetails = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    (<div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">HR Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          id="department"
          label="Department"
          type="text"
          icon={BuildingOfficeIcon}
          validation={register("department", { required: "Department is required" })}
          error={errors.department} />
        <InputField
          id="position"
          label="Position"
          type="text"
          icon={BriefcaseIcon}
          validation={register("position", { required: "Position is required" })}
          error={errors.position} />
        <InputField
          id="startDate"
          label="Start Date"
          type="date"
          icon={CalendarIcon}
          validation={register("startDate", { required: "Start date is required" })}
          error={errors.startDate} />
        <InputField
          id="salary"
          label="Salary"
          type="number"
          icon={CurrencyDollarIcon}
          validation={register("salary", { required: "Salary is required" })}
          error={errors.salary} />
        <InputField
          id="education"
          label="Highest Education"
          type="text"
          icon={AcademicCapIcon}
          validation={register("education", { required: "Education is required" })}
          error={errors.education} />
      </div>
    </div>)
  );
}

export default HRDetails

