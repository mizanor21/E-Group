"use client"

import { useForm } from "react-hook-form"
import { Modal } from "./modal"


export function InvestmentForm({ onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: "",
      voucherNo: "",
      submissionDate: "",
      mode: "Cash",
      amount: 0,
      investmentType: "",
      issueDate: "",
      maturityDate: "",
      status: "Active",
    },
  })

  const onSubmit = (data) => {
    console.log(data)
    onClose()
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Add Investment">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            {...register("date")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
        </div>

        <div>
          <label htmlFor="investorName" className="block text-sm font-medium text-gray-700">
            Investor Name
          </label>
          <input
            type="text"
            id="investorName"
            {...register("investorName")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.investorName && <p className="mt-1 text-sm text-red-600">{errors.investorName.message}</p>}
        </div>

        <div>
          <label htmlFor="voucherNo" className="block text-sm font-medium text-gray-700">
            Voucher No
          </label>
          <input
            type="text"
            id="voucherNo"
            {...register("voucherNo")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.voucherNo && <p className="mt-1 text-sm text-red-600">{errors.voucherNo.message}</p>}
        </div>

        <div>
          <label htmlFor="submissionDate" className="block text-sm font-medium text-gray-700">
            Submission Date
          </label>
          <input
            type="date"
            id="submissionDate"
            {...register("submissionDate")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.submissionDate && <p className="mt-1 text-sm text-red-600">{errors.submissionDate.message}</p>}
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State
          </label>
          <input
            type="text"
            id="state"
            {...register("state")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
        </div>

        <div>
          <label htmlFor="mode" className="block text-sm font-medium text-gray-700">
            Mode
          </label>
          <select
            id="mode"
            {...register("mode")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="Cleared">Cleared</option>
            <option value="Pending">Pending</option>
            <option value="Bounced">Bounced</option>
          </select>
          {errors.mode && <p className="mt-1 text-sm text-red-600">{errors.mode.message}</p>}
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            {...register("amount", { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </form>
    </Modal>
  )
}

