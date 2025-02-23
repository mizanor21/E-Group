"use client"

import { useForm } from "react-hook-form"
import { Modal } from "./modal"
import axios from "axios";
import toast from "react-hot-toast";
// import { toast } from "react-toastify";

export function IncomeForm({ onClose }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: "",
      voucherNo: "",
      submissionDate: "",
      mode: "Cash",
      amount: "",
      customerName: "",
      issueDate: "",
      dueDate: "",
      status: "Cleared",
    },
  });

  const mode = watch("mode");
  const status = watch("status");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/income", data);
      toast.success("Income added successfully!");
      console.log(response.data);
      onClose();
    } catch (error) {
      toast.error("There was an error submitting the form.");
      console.error("There was an error submitting the form:", error);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Add Income">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Date */}
          <div>
            <label className="block text-gray-600 text-sm font-medium">Date</label>
            <input type="date" {...register("date", { required: true })} className="input-style" />
            {errors.date && <span className="text-red-500 text-xs">Date is required</span>}
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-gray-600 text-sm font-medium">Customer Name</label>
            <input type="text" {...register("customerName", { required: true })} placeholder="Enter Customer Name" className="input-style" />
            {errors.customerName && <span className="text-red-500 text-xs">Customer Name is required</span>}
          </div>

          {/* Voucher No */}
          <div>
            <label className="block text-gray-600 text-sm font-medium">Voucher No.</label>
            <input type="text" {...register("voucherNo")} placeholder="Enter Voucher/Cheque Number" className="input-style" />
          </div>

          {/* Issue Date */}
          <div>
            <label className="block text-gray-600 text-sm font-medium">Issue Date</label>
            <input type="date" {...register("issueDate")} className="input-style" />
          </div>

          {/* Submission Date */}
          <div>
            <label className="block text-gray-600 text-sm font-medium">Submission Date</label>
            <input type="date" {...register("submissionDate")} className="input-style" />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-gray-600 text-sm font-medium">Due Date</label>
            <input type="date" {...register("dueDate")} className="input-style" />
          </div>

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

          {/* Amount */}
          <div className="col-span-2">
            <label className="block text-gray-600 text-sm font-medium">Amount</label>
            <input type="number" {...register("amount", { required: true })} placeholder="Enter the value of the payment" className="input-style" />
            {errors.amount && <span className="text-red-500 text-xs">Amount is required</span>}
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg text-lg font-semibold hover:bg-green-700 transition">
          Save All Changes
        </button>
      </form>
    </Modal>
  );
}
