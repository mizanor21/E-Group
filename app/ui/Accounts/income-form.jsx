"use client"

import { useForm } from "react-hook-form"
import { Modal } from "./modal"


export function IncomeForm({ onClose }) {
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
      customerName: "",
      issueDate: "",
      dueDate: "",
      status: "Pending",
    },
  })

  const onSubmit = (data) => {
    console.log(data)
    onClose()
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Add Income">
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
          <label htmlFor="mode" className="block text-sm font-medium text-gray-700">
            Mode
          </label>
          <select
            id="mode"
            {...register("mode")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="Cash">Cash</option>
            <option value="Check">Check</option>
            <option value="Online">Online</option>
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

        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
            Customer Name
          </label>
          <input
            type="text"
            id="customerName"
            {...register("customerName")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.customerName && <p className="mt-1 text-sm text-red-600">{errors.customerName.message}</p>}
        </div>

        <div>
          <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">
            Issue Date
          </label>
          <input
            type="date"
            id="issueDate"
            {...register("issueDate")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.issueDate && <p className="mt-1 text-sm text-red-600">{errors.issueDate.message}</p>}
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            {...register("dueDate")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            {...register("status")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="Cleared">Cleared</option>
            <option value="Pending">Pending</option>
            <option value="Bounced">Bounced</option>
          </select>
          {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>}
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

