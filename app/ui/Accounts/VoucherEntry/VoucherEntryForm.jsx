'use client'
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { costCenterOptions, expenseHeadOptions } from "./constants";
import { VoucherFormHeader } from "./VoucherFormControls";

const VoucherEntryForm = () => {
  // Form handling with React Hook Form
  const { register, control, watch, setValue, handleSubmit } = useForm({
    defaultValues: {
      group: '',
      company: '',
      project: '',
      transitionType: "Bank Payment",
      accountingPeriod: "2024-2025",
      currency: "BDT",
      lastVoucher: "DV-01-00001101",
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      paidFromBank: "Petty Cash",
      cashCurrentBalance: "BDT: 1,45,723.00",
      voucherRows: [
        {
          expenseHead: "Mobile Bill-HO",
          ref: "",
          amountFC: "",
          convRate: "",
          amountBDT: "0.00",
          narration: "Paid fro aug'24.",
          cheqRTGS: "",
          paidTo: ""
        }
      ]
    }
  });

  // Field array for dynamic voucher rows
  const { fields, append, remove } = useFieldArray({
    control,
    name: "voucherRows"
  });

  // Watch the currency field to conditionally enable/disable fields
  const selectedCurrency = watch("currency");

  const onSubmit = async (data) => {
    console.log("Form data:", data);
    try {
      const response = await fetch('/api/vouchers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Voucher submitted successfully:", result.data);
        toast.success("Voucher submitted successfully!");
      } else {
        toast.error(result.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Network error.");
      console.error("Submission error:", error);
    }
  };

  // Add a new row
  const addNewRow = () => {
    append({
      expenseHead: "",
      ref: "",
      amountFC: "",
      convRate: "",
      amountBDT: "",
      narration: "",
      cheqRTGS: "",
      paidTo: ""
    });
  };

  // Calculate total amount
  const calculateTotal = () => {
    return fields.reduce((sum, _, index) => {
      const amount = parseFloat(watch(`voucherRows.${index}.amountBDT`) || 0);
      return sum + amount;
    }, 0).toFixed(2);
  };

  // Function to calculate BDT amount based on FC amount and conversion rate
  const calculateBDTAmount = (index) => {
    if (selectedCurrency !== "BDT") {
      const amountFC = parseFloat(watch(`voucherRows.${index}.amountFC`) || 0);
      const convRate = parseFloat(watch(`voucherRows.${index}.convRate`) || 0);

      if (amountFC && convRate) {
        const amountBDT = (amountFC * convRate).toFixed(2);
        setValue(`voucherRows.${index}.amountBDT`, amountBDT);
      }
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm mt-4 p-4">
      <div>
        <h2 className="text-xl font-bold mb-4">Payment Voucher</h2>

        {/* Form Header */}
        <VoucherFormHeader
          control={control}
          register={register}
          watch={watch}
          setValue={setValue}
        />

        {/* Voucher Table */}
        <div className="overflow-x-auto pt-5">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 border text-left text-sm">
                  Expense Head <span className="text-red-500">*</span>
                </th>
                <th className="p-2 border text-left text-sm">Ref.</th>
                <th className="p-2 border text-left text-sm">
                  Amount (FC)
                </th>
                <th className="p-2 border text-left text-sm">
                  Con. Rate
                </th>
                <th className="p-2 border text-left text-sm">
                  Amount (BDT) <span className="text-red-500">*</span>
                </th>
                <th className="p-2 border text-left text-sm">Narration</th>
                <th className="p-2 border text-left text-sm">Cheq/RTGS</th>
                <th className="p-2 border text-left text-sm">Paid To</th>
                <th className="p-2 border text-left text-sm">Attac.</th>
                <th className="p-2 border text-left text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id}>
                  <td className="p-2 border">
                    <div className="relative">
                      <Controller
                        name={`voucherRows.${index}.expenseHead`}
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            className="w-full p-1 border border-gray-200 rounded appearance-none pr-8"
                          >
                            <option value="">Select Expense Head</option>
                            {expenseHeadOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        )}
                      />
                      <ChevronDown className="absolute right-2 top-1.5 h-4 w-4 text-gray-500" />
                    </div>
                  </td>
                  <td className="p-2 border">
                    <input
                      {...register(`voucherRows.${index}.ref`)}
                      className="w-full p-1 border border-gray-200 rounded"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      {...register(`voucherRows.${index}.amountFC`)}
                      disabled={selectedCurrency === "BDT"}
                      onChange={() => calculateBDTAmount(index)}
                      className={`w-full p-1 border border-gray-200 rounded ${selectedCurrency === "BDT" ? "bg-gray-100" : ""
                        }`}
                      placeholder={selectedCurrency === "BDT" ? "N/A" : "Enter amount"}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      {...register(`voucherRows.${index}.convRate`)}
                      disabled={selectedCurrency === "BDT"}
                      onChange={() => calculateBDTAmount(index)}
                      className={`w-full p-1 border border-gray-200 rounded ${selectedCurrency === "BDT" ? "bg-gray-100" : ""
                        }`}
                      placeholder={selectedCurrency === "BDT" ? "N/A" : "Enter rate"}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      {...register(`voucherRows.${index}.amountBDT`)}
                      className="w-full p-1 border border-gray-200 rounded"
                      readOnly={selectedCurrency !== "BDT"}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      {...register(`voucherRows.${index}.narration`)}
                      className="w-full p-1 border border-gray-200 rounded"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      {...register(`voucherRows.${index}.cheqRTGS`)}
                      className="w-full p-1 border border-gray-200 rounded"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      {...register(`voucherRows.${index}.paidTo`)}
                      className="w-full p-1 border border-gray-200 rounded"
                    />
                  </td>
                  <td className="p-2 border text-center">
                    <button type="button" className="bg-gray-200 p-1 rounded-full">
                      <Plus size={16} />
                    </button>
                  </td>
                  <td className="p-2 border">
                    <div className="flex space-x-1">
                      <button
                        type="button"
                        className="bg-green-500 text-white p-1 rounded-full"
                        onClick={addNewRow}
                      >
                        <Plus size={16} />
                      </button>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          className="bg-red-500 text-white p-1 rounded-full"
                          onClick={() => remove(index)}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {/* Total Row */}
              <tr>
                <td className="p-2 border font-medium text-right" colSpan={5}>
                  TOTAL
                </td>
                <td className="p-2 border font-bold">
                  {calculateTotal()}
                </td>
                <td colSpan={5}></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-4 space-x-2">
          <button
            type="button"
            className="bg-cyan-500 text-white px-4 py-2 rounded"
            onClick={() => {
              fields.forEach((_, index) => {
                if (index > 0) remove(index);
              });
              setValue("voucherRows.0", {
                expenseHead: "",
                accountHead: "",
                ref: "",
                amountFC: "",
                convRate: "",
                amountBDT: "",
                narration: "",
                cheqRTGS: "",
                paidTo: ""
              });
            }}
          >
            Clear
          </button>
          <button
            type="button"
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoucherEntryForm;