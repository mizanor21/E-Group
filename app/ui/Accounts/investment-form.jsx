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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              {...register("date")}
              className="input-style"
            />
            {errors.date && <p className="error-text">{errors.date.message}</p>}
          </div>

          <div>
            <label htmlFor="investorName" className="block text-sm font-medium text-gray-700">
              Investor Name
            </label>
            <input
              type="text"
              id="investorName"
              {...register("investorName")}
              className="input-style"
            />
            {errors.investorName && <p className="error-text">{errors.investorName.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="voucherNo" className="block text-sm font-medium text-gray-700">
              Voucher No
            </label>
            <input
              type="text"
              id="voucherNo"
              {...register("voucherNo")}
              className="input-style"
            />
            {errors.voucherNo && <p className="error-text">{errors.voucherNo.message}</p>}
          </div>

          <div>
            <label htmlFor="submissionDate" className="block text-sm font-medium text-gray-700">
              Submission Date
            </label>
            <input
              type="date"
              id="submissionDate"
              {...register("submissionDate")}
              className="input-style"
            />
            {errors.submissionDate && <p className="error-text">{errors.submissionDate.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="mode" className="block text-sm font-medium text-gray-700">
            Mode
          </label>
          <select id="mode" {...register("mode")} className="input-style">
            <option value="Cleared">Cleared</option>
            <option value="Pending">Pending</option>
            <option value="Bounced">Bounced</option>
          </select>
          {errors.mode && <p className="error-text">{errors.mode.message}</p>}
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            {...register("amount", { valueAsNumber: true })}
            className="input-style"
          />
          {errors.amount && <p className="error-text">{errors.amount.message}</p>}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Submit
          </button>
        </div>
      </form>
    </Modal>
  )
}
