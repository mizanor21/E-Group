import { useFormContext } from "react-hook-form"
import { BanknotesIcon, BuildingLibraryIcon, CreditCardIcon } from "@heroicons/react/24/outline"

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

const PaymentInfo = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    (<div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          id="bankName"
          label="Bank Name"
          type="text"
          icon={BuildingLibraryIcon}
          validation={register("bankName", { required: "Bank name is required" })}
          error={errors.bankName} />
        <InputField
          id="accountNumber"
          label="Account Number"
          type="text"
          icon={CreditCardIcon}
          validation={register("accountNumber", { required: "Account number is required" })}
          error={errors.accountNumber} />
        <InputField
          id="ifscCode"
          label="IFSC Code"
          type="text"
          icon={BanknotesIcon}
          validation={register("ifscCode", { required: "IFSC code is required" })}
          error={errors.ifscCode} />
        <div>
          <label
            htmlFor="paymentMethod"
            className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Payment Method
          </label>
          <select
            id="paymentMethod"
            {...register("paymentMethod", { required: "Payment method is required" })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            <option value="">Select a payment method</option>
            <option value="bankTransfer">Bank Transfer</option>
            <option value="check">Check</option>
            <option value="cash">Cash</option>
          </select>
          {errors.paymentMethod && <p className="mt-1 text-sm text-red-600">{errors.paymentMethod.message}</p>}
        </div>
      </div>
    </div>)
  );
}

export default PaymentInfo

