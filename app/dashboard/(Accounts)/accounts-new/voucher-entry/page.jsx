'use client'
import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { ChevronDown, Plus, Trash2, Edit, Eye, Check, Printer } from "lucide-react";
import toast from "react-hot-toast";

const VoucherManagementUI = () => {
  // Tab state management
  const [activeTab, setActiveTab] = useState("Voucher Entry");
  
  // Sample expense head options
  const expenseHeadOptions = [
    { value: "Mobile Bill-HO", label: "Mobile Bill-HO" },
    { value: "Internet Bill", label: "Internet Bill" },
    { value: "Office Rent", label: "Office Rent" },
    { value: "Utility Bills", label: "Utility Bills" },
    { value: "Travel Expenses", label: "Travel Expenses" },
    { value: "Office Supplies", label: "Office Supplies" },
  ];
  
  // Sample cost center options
  const costCenterOptions = [
    { value: "Project-001", label: "Project-001" },
    { value: "Project-002", label: "Project-002" },
    { value: "Head Office", label: "Head Office" },
    { value: "Branch-Dhaka", label: "Branch-Dhaka" },
    { value: "Branch-Chittagong", label: "Branch-Chittagong" },
  ];
  
  // Form handling with React Hook Form
  const { register, control, watch, setValue, handleSubmit, getValues } = useForm({
    defaultValues: {
      branch: "Mirpur DOHS",
      transitionType: "Bank Payment",
      accountingPeriod: "2024-2025",
      currency: "BDT",
      lastVoucher: "DV-01-00001101",
      date: "20-Aug-2024",
      paidFromBank: "Petty Cash",
      cashCurrentBalance: "BDT: 1,45,723.00",
      voucherRows: [
        {
          expenseHead: "Mobile Bill-HO",
          costCenter: "Project-001",
          ref: "",
          amountFC: "",
          convRate: "",
          amountBDT: "500.00",
          narration: "Paid fro aug'24.",
          cheqRTGS: "",
          paidTo: "Mr. Rahim"
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
  
  // Handle form submission
  const onSubmit = (data) => {
    toast.success("Form submitted successfully!");
    console.log(data);
    // Implementation for form submission would go here
  };
  
  // Add a new row
  const addNewRow = () => {
    append({
      expenseHead: "",
      costCenter: "",
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
        console.log(`Amount in BDT: ${amountBDT}`);
        setValue(`voucherRows.${index}.amountBDT`, amountBDT);
      }
    }
  };

  // Tabs configuration
  const tabs = [
    "Voucher Entry",
    "Received Voucher",
    "Voucher Approval",
    "Fund Transfer",
    "Voucher List"
  ];

  return (
    <div className="bg-slate-50 min-h-screen p-4">
      {/* Tabs Navigation */}
      <div className="flex border-b overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === tab
                ? "border-b-2 border-green-500 text-green-500"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Voucher Entry Content */}
      {activeTab === "Voucher Entry" && (
        <div className="bg-white rounded-md shadow-sm mt-4 p-4">
          <div>
            <h2 className="text-xl font-bold mb-4">Voucher</h2>
            
            {/* Form Header - Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="space-y-1">
                <label className="block text-sm">
                  Branch <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Controller
                    name="branch"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full p-2 border rounded-md appearance-none border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                      >
                        <option value="Mirpur DOHS">Mirpur DOHS</option>
                        <option value="Dhanmondi">Dhanmondi</option>
                        <option value="Gulshan">Gulshan</option>
                      </select>
                    )}
                  />
                  <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm">
                  Transition Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Controller
                    name="transitionType"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full p-2 border rounded-md appearance-none border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                      >
                        <option value="Bank Payment">Bank Payment</option>
                        <option value="Cash Payment">Cash Payment</option>
                        <option value="Transfer">Transfer</option>
                      </select>
                    )}
                  />
                  <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm">
                  Accounting Period <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Controller
                    name="accountingPeriod"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full p-2 border rounded-md appearance-none border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                      >
                        <option value="2024-2025">2024-2025</option>
                        <option value="2023-2024">2023-2024</option>
                      </select>
                    )}
                  />
                  <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm">
                  Currency <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full p-2 border rounded-md appearance-none border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                      >
                        <option value="BDT">BDT</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    )}
                  />
                  <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>
            
            {/* Form Header - Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="space-y-1">
                <label className="block text-sm">
                  Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full p-2 border rounded-md appearance-none border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                      >
                        <option value="20-Aug-2024">20-Aug-2024</option>
                        <option value="21-Aug-2024">21-Aug-2024</option>
                      </select>
                    )}
                  />
                  <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm">
                  Paid From Bank <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Controller
                    name="paidFromBank"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full p-2 border rounded-md appearance-none border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                      >
                        <option value="Petty Cash">Petty Cash</option>
                        <option value="Main Account">Main Account</option>
                      </select>
                    )}
                  />
                  <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm">
                  Cash Current Balance
                </label>
                <input
                  {...register("cashCurrentBalance")}
                  readOnly
                  className="w-full p-2 border rounded-md border-green-300 bg-gray-50"
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm">
                  Your Last Vouch
                </label>
                <input
                  {...register("lastVoucher")}
                  readOnly
                  className="w-full p-2 border rounded-md border-green-300 bg-gray-50"
                />
              </div>
            </div>
            
            {/* Voucher Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-2 border text-left text-sm">
                      Expense Head <span className="text-red-500">*</span>
                    </th>
                    <th className="p-2 border text-left text-sm">Cost Center</th>
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
                        <div className="relative">
                          <Controller
                            name={`voucherRows.${index}.costCenter`}
                            control={control}
                            render={({ field }) => (
                              <select
                                {...field}
                                className="w-full p-1 border border-gray-200 rounded appearance-none pr-8"
                              >
                                <option value="">Select Cost Center</option>
                                {costCenterOptions.map(option => (
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
                          className={`w-full p-1 border border-gray-200 rounded ${
                            selectedCurrency === "BDT" ? "bg-gray-100" : ""
                          }`}
                          placeholder={selectedCurrency === "BDT" ? "N/A" : "Enter amount"}
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          {...register(`voucherRows.${index}.convRate`)}
                          disabled={selectedCurrency === "BDT"}
                          onChange={() => calculateBDTAmount(index)}
                          className={`w-full p-1 border border-gray-200 rounded ${
                            selectedCurrency === "BDT" ? "bg-gray-100" : ""
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
                        {/* File attachment button would be implemented here */}
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
                  // Clear the form
                  fields.forEach((_, index) => {
                    if (index > 0) remove(index);
                  });
                  // Reset the first row
                  setValue("voucherRows.0", {
                    expenseHead: "",
                    accountHead: "",
                    costCenter: "",
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
      )}

      {/* Your voucher today section */}
      <div className="bg-white rounded-md shadow-sm mt-4 p-4">
        <h3 className="text-lg font-medium mb-4">Your voucher today</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 border text-left text-sm">Tr. Date</th>
                <th className="p-2 border text-left text-sm">Tr. No</th>
                <th className="p-2 border text-left text-sm">Tr. Type</th>
                <th className="p-2 border text-left text-sm">Branch</th>
                <th className="p-2 border text-left text-sm">voucher number</th>
                <th className="p-2 border text-left text-sm">Amount (FC)</th>
                <th className="p-2 border text-left text-sm">Amount (BDT)</th>
                <th className="p-2 border text-left text-sm">Status</th>
                <th className="p-2 border text-left text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample data for demo */}
              <tr>
                <td className="p-2 border">20-Aug-2024</td>
                <td className="p-2 border">TR-001</td>
                <td className="p-2 border">Bank Payment</td>
                <td className="p-2 border">Mirpur DOHS</td>
                <td className="p-2 border">DV-01-00001101</td>
                <td className="p-2 border">-</td>
                <td className="p-2 border">500.00</td>
                <td className="p-2 border">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">Approved</span>
                </td>
                <td className="p-2 border">
                  <div className="flex space-x-1">
                    <button className="bg-blue-500 text-white p-1 rounded-full">
                      <Edit size={16} />
                    </button>
                    <button className="bg-cyan-500 text-white p-1 rounded-full">
                      <Eye size={16} />
                    </button>
                    <button className="bg-green-500 text-white p-1 rounded-full">
                      <Check size={16} />
                    </button>
                    <button className="bg-red-500 text-white p-1 rounded-full">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="p-2 border">20-Aug-2024</td>
                <td className="p-2 border">TR-002</td>
                <td className="p-2 border">Cash Payment</td>
                <td className="p-2 border">Mirpur DOHS</td>
                <td className="p-2 border">DV-01-00001102</td>
                <td className="p-2 border">-</td>
                <td className="p-2 border">1,250.00</td>
                <td className="p-2 border">
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">Pending</span>
                </td>
                <td className="p-2 border">
                  <div className="flex space-x-1">
                    <button className="bg-blue-500 text-white p-1 rounded-full">
                      <Edit size={16} />
                    </button>
                    <button className="bg-cyan-500 text-white p-1 rounded-full">
                      <Eye size={16} />
                    </button>
                    <button className="bg-green-500 text-white p-1 rounded-full">
                      <Check size={16} />
                    </button>
                    <button className="bg-red-500 text-white p-1 rounded-full">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="p-2 border">21-Aug-2024</td>
                <td className="p-2 border">TR-003</td>
                <td className="p-2 border">Transfer</td>
                <td className="p-2 border">Mirpur DOHS</td>
                <td className="p-2 border">DV-01-00001103</td>
                <td className="p-2 border">50.00 USD</td>
                <td className="p-2 border">5,500.00</td>
                <td className="p-2 border">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">Approved</span>
                </td>
                <td className="p-2 border">
                  <div className="flex space-x-1">
                    <button className="bg-blue-500 text-white p-1 rounded-full">
                      <Edit size={16} />
                    </button>
                    <button className="bg-cyan-500 text-white p-1 rounded-full">
                      <Eye size={16} />
                    </button>
                    <button className="bg-green-500 text-white p-1 rounded-full">
                      <Check size={16} />
                    </button>
                    <button className="bg-red-500 text-white p-1 rounded-full">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VoucherManagementUI;