"use client"

import { useForm } from "react-hook-form"
import { Modal } from "./modal"
import axios from "axios";
import toast from "react-hot-toast";

export function WithdrawForm({ onClose }) {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      voucherNo: "",
      investorName: "",
      submissionDate: "",
      mode: "Cash",
      amount: 0,
      issueDate: "",
      status: "Cleared",
    },
  })

  const mode = watch("mode");
  const status = watch("status");

  const onSubmit = async(data) => {
    try {
      const response = await axios.post("/api/withdraw", data);
      toast.success("Withdraw added successfully!");
      onClose();
    } catch (error) {
      toast.error("There was an error submitting the form.");
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Withdraw">
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
              Withdrawer
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

        <div className="grid grid-cols-2 gap-4">
          {/* Mode */}
        <div>
            <label className="block text-gray-600 text-sm font-medium">Mode</label>
            <select {...register("mode")} className={`input-style bg-${mode === "Cash" ? "red" : mode === "Check" ? "blue" : "green"}-500 text-white`}>
              <option value="Cash">Cash</option>
              <option value="Check">Check</option>
              <option value="Online">Online</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-gray-600 text-sm font-medium">Status</label>
            <select {...register("status")} className={`input-style bg-${status === "Cleared" ? "green" : status === "Pending" ? "yellow" : "red"}-500 text-white`}>
              <option value="Cleared">Cleared</option>
              <option value="Pending">Pending</option>
              <option value="Bounced">Bounced</option>
            </select>
          </div>
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
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </Modal>
  )
}
