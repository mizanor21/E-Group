import { useFormContext } from "react-hook-form"
import { UserIcon, EnvelopeIcon, PhoneIcon, CalendarIcon } from "@heroicons/react/24/outline"

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

const EmployeeBasicInfo = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    (<div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h2>
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
          id="dateOfBirth"
          label="Date of Birth"
          type="date"
          icon={CalendarIcon}
          validation={register("dateOfBirth", { required: "Date of birth is required" })}
          error={errors.dateOfBirth} />
      </div>
    </div>)
  );
}

export default EmployeeBasicInfo

