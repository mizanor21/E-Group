'use client'
import { Controller } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import DateSelector from "../../component/DateSelector/DateSelector";

export const VoucherFormHeader = ({ control, register, watch }) => {
    return (
        <>
            {/* /* Form Header - Row 1  */}
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
                                    {Array.from({ length: 2075 - 2023 + 1 }, (_, i) => (
                                        <option key={i} value={`${2023 + i}-${2024 + i}`}>
                                            {2023 + i}-{2024 + i}
                                        </option>
                                    ))}
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

                <DateSelector
                control={control}
                name="date"
                label="Select Date"
                watch={watch}  // Pass the watch function
            />
                {/* <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow">
                </div> */}

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
        </>
    );
};