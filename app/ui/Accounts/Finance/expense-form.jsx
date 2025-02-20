"use client";

import { useForm } from "react-hook-form";
import { Modal } from "./modal";
import toast from "react-hot-toast";
import axios from "axios";

export function ExpenseForm({ onClose }) {
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
      status: "Pending",
    },
  });

  const mode = watch("mode");
  const status = watch("status");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/expenses", data);
      toast.success("Expense added successfully!");
      console.log(response.data);
      onClose();
    } catch (error) {
      toast.error("There was an error submitting the form.");
      console.error("There was an error submitting the form:", error);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Add Expense">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Input Fields */}
          {[
            { label: "Date", name: "date", type: "date" },
            { label: "Customer Name", name: "customerName", type: "text", placeholder: "Enter Customer Name" },
            { label: "Voucher No.", name: "voucherNo", type: "text", placeholder: "Enter Voucher/Cheque Number" },
            { label: "Issue Date", name: "issueDate", type: "date" },
            { label: "Submission Date", name: "submissionDate", type: "date" },
            { label: "Due Date", name: "dueDate", type: "date" },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className="block text-gray-600 text-sm font-medium">{label}</label>
              <input
                type={type}
                {...register(name, { required: name !== "voucherNo" })}
                placeholder={placeholder}
                className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              />
              {errors[name] && <span className="text-red-500 text-xs">{label} is required</span>}
            </div>
          ))}

          {/* Mode Selection */}
          <div>
            <label className="block text-gray-600 text-sm font-medium">Mode</label>
            <select
              {...register("mode")}
              className="w-full p-2 border rounded-md shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="Cash">Cash</option>
              <option value="Check">Check</option>
              <option value="Online">Online</option>
            </select>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-gray-600 text-sm font-medium">Status</label>
            <select
              {...register("status")}
              className="w-full p-2 border rounded-md shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="Cleared">Cleared</option>
              <option value="Pending">Pending</option>
              <option value="Bounced">Bounced</option>
            </select>
          </div>

          {/* Amount */}
          <div className="col-span-2">
            <label className="block text-gray-600 text-sm font-medium">Amount</label>
            <input
              type="number"
              {...register("amount", { required: true })}
              placeholder="Enter the value of the payment"
              className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            />
            {errors.amount && <span className="text-red-500 text-xs">Amount is required</span>}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
        >
          Save All Changes
        </button>
      </form>
    </Modal>
  );
}
