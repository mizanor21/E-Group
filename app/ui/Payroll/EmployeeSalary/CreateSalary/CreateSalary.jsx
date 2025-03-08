"use client";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { CiEdit } from "react-icons/ci";
import CreateSalaryModal from "./CreateSalaryModal";
import { IoArrowRedoOutline } from "react-icons/io5";
import { useEmployeeDetailsData } from "@/app/data/DataFetch";
import { GoArrowLeft } from "react-icons/go";
import Link from "next/link";
import { IoCalculator } from "react-icons/io5";
import { MdOutlineAttachMoney } from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa";
import { GiTakeMyMoney } from "react-icons/gi";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { TbCurrencyDollarOff } from "react-icons/tb";

const calculateSalaryByType = (
  employeeType,
  data,
  workingDays,
  numberOfLeave = 0
) => {
  const {
    basicPay = 0,
    hourlyRate = 0,
    dailyRate = 0,
    commission = 0,
    accAllowance = 0,
    foodAllowance = 0,
    telephoneAllowance = 0,
    transportAllowance = 0,
  } = data;

  let baseSalary = 0;
  const standardWorkingHours = 8; // Standard daily working hours

  // Calculate actual working days after deducting leaves
  const actualWorkingDays = Math.max(0, workingDays - numberOfLeave);

  switch (employeeType?.toLowerCase()) {
    case "hourly":
      // For hourly employees, workingDays is actually the number of working hours
      baseSalary = hourlyRate * workingDays;
      break;

    case "daily":
      // For daily employees, deduct the days they were on leave
      baseSalary = dailyRate * actualWorkingDays;
      break;

    case "monthly":
      // For monthly employees, calculate the per-day rate and deduct for leaves
      const monthlyDailyRate = basicPay / workingDays;
      baseSalary = basicPay - monthlyDailyRate * numberOfLeave;
      break;

    default:
      baseSalary = 0;
  }

  // Add fixed allowances - these are typically not affected by leaves
  const totalAllowances = [
    accAllowance,
    foodAllowance,
    telephoneAllowance,
    transportAllowance,
  ].reduce((sum, allowance) => sum + (Number(allowance) || 0), 0);

  // Add commission if applicable
  const totalCommission = Number(commission) || 0;

  return {
    baseSalary,
    totalAllowances,
    totalCommission,
    grossSalary: baseSalary + totalAllowances + totalCommission,
    actualWorkingDays,
  };
};

const CreateSalary = ({ id }) => {
  const {
    data: employeeData,
    error,
    isLoading,
  } = useEmployeeDetailsData({ params: { id } });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      // Pre-fill allowance fields if they exist in employeeData
      allowances: employeeData?.allowances || 0,
      specialAllowances: employeeData?.specialAllowances || 0,
      accommodation: employeeData?.accommodation || 0,
      foodAllowance: employeeData?.foodAllowance || 0,
      telephoneAllowance: employeeData?.telephoneAllowance || 0,
      transportAllowance: employeeData?.transportAllowance || 0,
    },
  });

  const [modalData, setModalData] = useState({
    isOpen: false,
    salaryData: null,
  });

  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [activeTab, setActiveTab] = useState("workdays");

  const inputStyle =
    "border rounded-lg p-3 px-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition-all duration-200 hover:border-blue-300";
  const btnStyle =
    "bg-gradient-to-r from-sky-600 to-blue-700 text-white px-10 py-3 rounded-lg text-center hover:from-blue-600 hover:to-sky-600 transition-all duration-300 shadow-md hover:shadow-lg";
  const cardStyle =
    "bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100";

  // Watch all allowance fields to calculate total allowances
  const allowances = watch("allowances") || 0;
  const specialAllowances = watch("specialAllowances") || 0;
  const accommodation = watch("accommodation") || 0;
  const foodAllowance = watch("foodAllowance") || 0;
  const telephoneAllowance = watch("telephoneAllowance") || 0;
  const transportAllowance = watch("transportAllowance") || 0;

  // Calculate total allowances dynamically
  useEffect(() => {
    const totalAllowances =
      Number(allowances) +
      Number(specialAllowances) +
      Number(accommodation) +
      Number(foodAllowance) +
      Number(telephoneAllowance) +
      Number(transportAllowance);

    setValue("allowanceEarning", totalAllowances.toFixed(2));
  }, [
    allowances,
    specialAllowances,
    accommodation,
    foodAllowance,
    telephoneAllowance,
    transportAllowance,
    setValue,
  ]);

  const onSubmit = useCallback(
    (formData) => {
      const workingDays = Number.parseInt(formData.workingDays) || 0;
      const numberOfLeave = Number.parseInt(formData.numberOfLeave) || 0;

      // Calculate base salary based on employee type and actual working days
      const {
        baseSalary,
        totalAllowances,
        totalCommission,
        grossSalary,
        actualWorkingDays,
      } = calculateSalaryByType(
        employeeData.employeeType,
        employeeData,
        workingDays,
        numberOfLeave
      );

      // Calculate overtime
      const normalOverTime = Number.parseFloat(formData.normalOverTime) || 0;
      const holidayOverTime = Number.parseFloat(formData.holidayOverTime) || 0;

      // Calculate OT rates based on employee type
      let normalOTRate, holidayOTRate;

      if (employeeData.employeeType?.toLowerCase() === "hourly") {
        normalOTRate = employeeData.hourlyRate * 1.25; // 1.25x for normal OT
        holidayOTRate = employeeData.hourlyRate * 1.5; // 1.5x for holiday OT
      } else if (employeeData.employeeType?.toLowerCase() === "daily") {
        // For daily employees, calculate from daily rate
        const hourlyRate = employeeData.dailyRate / 8; // Assuming 8-hour workday
        normalOTRate = hourlyRate * 1.25;
        holidayOTRate = hourlyRate * 1.5;
      } else {
        // For monthly employees
        const dailyRate = employeeData.basicPay / workingDays;
        const hourlyRate = dailyRate / 8; // Assuming 8-hour workday
        normalOTRate = hourlyRate * 1.25;
        holidayOTRate = hourlyRate * 1.5;
      }

      const normalOTEarning = normalOverTime * normalOTRate;
      const holidayOTEarning = holidayOverTime * holidayOTRate;

      // Calculate deductions - Handle based on employee type
      let leaveDeduction = 0;
      if (employeeData.employeeType?.toLowerCase() === "monthly") {
        const dailyRate = employeeData.basicPay / workingDays;
        leaveDeduction = dailyRate * numberOfLeave;
      } else if (employeeData.employeeType?.toLowerCase() === "daily") {
        leaveDeduction = employeeData.dailyRate * numberOfLeave;
      }
      // For hourly employees, we don't calculate leave deductions as they only get paid for hours worked

      const otherDeductions = ["dedFines", "dedDoc", "dedOthers"].reduce(
        (sum, key) => sum + (Number.parseFloat(formData[key]) || 0),
        0
      );

      const totalDeductions = otherDeductions; // Leave deduction is already factored into base salary

      // Calculate other earnings
      const otherEarnings =
        (Number.parseFloat(formData.arrearPayments) || 0) -
        (Number.parseFloat(formData.advRecovery) || 0);

      // Calculate net salary
      const netSalary =
        grossSalary +
        normalOTEarning +
        holidayOTEarning +
        otherEarnings -
        totalDeductions;

      // Update form values
      setValue("baseSalary", baseSalary.toFixed(2));
      setValue("normalOverTimeEarning", normalOTEarning.toFixed(2));
      setValue("holidayOverTimeEarning", holidayOTEarning.toFixed(2));
      setValue("allowanceEarning", totalAllowances.toFixed(2));
      setValue("deduction", totalDeductions.toFixed(2));
      setValue("otherEarning", otherEarnings.toFixed(2));
      setValue("netSalary", netSalary.toFixed(2));
    },
    [employeeData, setValue]
  );

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === "change") {
        handleSubmit(onSubmit)();
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, handleSubmit, onSubmit]);

  const openModal = async () => {
    const salaryData = {
      employeeId: employeeData?.employeeID,
      name: employeeData?.firstName + " " + employeeData?.lastName,
      month: month,
      workingDays: Number(watch("workingDays")),
      baseSalary: Number(watch("baseSalary")),
      overtime: {
        normal: {
          hours: Number(watch("normalOverTime")),
          earning: Number(watch("normalOverTimeEarning")),
        },
        holiday: {
          hours: Number(watch("holidayOverTime")),
          earning: Number(watch("holidayOverTimeEarning")),
        },
      },
      allowances: {
        allowances: Number(watch("allowances")),
        specialAllowances: Number(watch("specialAllowances")),
        accommodation: Number(watch("accommodation")),
        foodAllowance: Number(watch("foodAllowance")),
        telephoneAllowance: Number(watch("telephoneAllowance")),
        transportAllowance: Number(watch("transportAllowance")),
        total: Number(watch("allowanceEarning")),
      },
      deductions: {
        numberOfLeave: Number(watch("numberOfLeave")),
        dedFines: Number(watch("dedFines")),
        dedDoc: Number(watch("dedDoc")),
        dedOthers: Number(watch("dedOthers")),
        total: Number(watch("deduction")),
      },
      otherEarnings: {
        advRecovery: Number(watch("advRecovery")),
        arrearPayments: Number(watch("arrearPayments")),
        currentBalance: Number(watch("currentBalance")),
        total: Number(watch("otherEarning")),
      },
      netSalary: Number(watch("netSalary")),
    };

    try {
      const response = await fetch("/api/salary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(salaryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create salary");
      }

      const result = await response.json();
      console.log(result.message);
      setModalData({ isOpen: true, salaryData });
    } catch (error) {
      console.error("Error creating salary:", error);
    }
  };

  const closeModal = () => setModalData({ isOpen: false, salaryData: null });

  // Helper to get the proper label for working days input based on employee type
  const getWorkingDaysLabel = () => {
    if (employeeData?.employeeType?.toLowerCase() === "hourly") {
      return "Total Hours";
    } else {
      return "Total Days (Month)";
    }
  };

  // Helper to get max value for working days input
  const getWorkingDaysMax = () => {
    if (employeeData?.employeeType?.toLowerCase() === "hourly") {
      return undefined; // No upper limit for hours
    } else {
      return 31; // Max days in a month
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 md:p-10 space-y-8 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
        <div className="md:flex justify-between items-center">
          <div>
            <Link
              href={"/dashboard/payroll"}
              className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-4"
            >
              <GoArrowLeft className="mr-2 text-xl" />
              <span>Back to Payroll</span>
            </Link>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#4572ba] to-sky-600 bg-clip-text text-transparent">
              Salary Information
            </h1>
            {employeeData && (
              <div className="mt-3">
                <h3 className="text-xl md:text-2xl font-semibold flex items-center">
                  {employeeData?.firstName} {employeeData?.lastName}
                  <span className="ml-3 text-sm font-normal px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {employeeData?.employeeType || "Employee"}
                  </span>
                </h3>
                <p className="text-gray-500 mt-1">
                  {employeeData?.currentJob} | {employeeData?.department}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Month Selection & Pay Period */}
          <div className={cardStyle}>
            <div className="flex items-center mb-4">
              <FaRegCalendarAlt className="text-blue-600 text-xl mr-3" />
              <h3 className="text-lg font-semibold">Pay Period</h3>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Month
                </label>
                <input
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className={inputStyle}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getWorkingDaysLabel()}
                </label>
                <input
                  {...register("workingDays", {
                    required: "This field is required",
                    min: { value: 1, message: "Value must be at least 1" },
                    max: getWorkingDaysMax()
                      ? {
                          value: getWorkingDaysMax(),
                          message: `Value cannot exceed ${getWorkingDaysMax()}`,
                        }
                      : undefined,
                  })}
                  type="number"
                  className={inputStyle}
                  placeholder={
                    employeeData?.employeeType?.toLowerCase() === "hourly"
                      ? "Enter hours"
                      : "Enter days"
                  }
                />
                {errors.workingDays && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.workingDays.message}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Salary
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  {...register("baseSalary")}
                  type="text"
                  className={`${inputStyle} pl-8 bg-gray-50`}
                  placeholder="Base salary will be calculated automatically"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Tabs for different sections */}
          <div className={cardStyle}>
            <div className="flex border-b overflow-x-auto whitespace-nowrap hide-scrollbar mb-6">
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "workdays"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("workdays")}
              >
                Overtime
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "allowances"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("allowances")}
              >
                Allowances
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "deductions"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("deductions")}
              >
                Deductions
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "others"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("others")}
              >
                Additional Earnings
              </button>
            </div>

            {/* Overtime Tab */}
            {activeTab === "workdays" && (
              <div>
                <div className="flex items-center mb-4">
                  <IoCalculator className="text-blue-600 text-xl mr-3" />
                  <h3 className="text-lg font-semibold">
                    Overtime Calculation
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Normal Day OT (Hours)
                    </label>
                    <input
                      {...register("normalOverTime")}
                      type="number"
                      className={inputStyle}
                      placeholder="Enter hours"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Holiday OT (Hours)
                    </label>
                    <input
                      {...register("holidayOverTime")}
                      type="number"
                      className={inputStyle}
                      placeholder="Enter hours"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Normal OT Earnings
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        {...register("normalOverTimeEarning")}
                        type="text"
                        className={`${inputStyle} pl-8 bg-gray-50`}
                        placeholder="Auto-calculated"
                        readOnly
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Holiday OT Earnings
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        {...register("holidayOverTimeEarning")}
                        type="text"
                        className={`${inputStyle} pl-8 bg-gray-50`}
                        placeholder="Auto-calculated"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "allowances" && (
              <div>
                <div className="flex items-center mb-4">
                  <MdOutlineAttachMoney className="text-blue-600 text-xl mr-3" />
                  <h3 className="text-lg font-semibold">Allowances</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      General Allowances
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        {...register("allowances")}
                        type="text"
                        className={`${inputStyle} pl-8`}
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Allowances
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        {...register("specialAllowances")}
                        type="text"
                        className={`${inputStyle} pl-8`}
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Accommodation
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        {...register("accommodation")}
                        type="text"
                        className={`${inputStyle} pl-8`}
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Food Allowance
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        {...register("foodAllowance")}
                        type="text"
                        className={`${inputStyle} pl-8`}
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telephone Allowance
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        {...register("telephoneAllowance")}
                        type="text"
                        className={`${inputStyle} pl-8`}
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transport Allowance
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        {...register("transportAllowance")}
                        type="text"
                        className={`${inputStyle} pl-8`}
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Allowance Earnings
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      {...register("allowanceEarning")}
                      type="text"
                      className={`${inputStyle} pl-8 bg-blue-50 text-blue-800 font-medium`}
                      placeholder="Auto-calculated"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Deductions Tab */}
            {activeTab === "deductions" && (
              <div>
                <div className="flex items-center mb-4">
                  <TbCurrencyDollarOff className="text-red-600 text-xl mr-3" />
                  <h3 className="text-lg font-semibold">Deductions</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Only show leave input for monthly and daily employees */}
                  {(employeeData?.employeeType?.toLowerCase() === "monthly" ||
                    employeeData?.employeeType?.toLowerCase() === "daily") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Leave Days
                      </label>
                      <input
                        {...register("numberOfLeave")}
                        type="number"
                        className={inputStyle}
                        placeholder="Number of days"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fines
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        {...register("dedFines")}
                        type="text"
                        className={`${inputStyle} pl-8`}
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Documentation Fees
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        {...register("dedDoc")}
                        type="text"
                        className={`${inputStyle} pl-8`}
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Other Deductions
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        {...register("dedOthers")}
                        type="text"
                        className={`${inputStyle} pl-8`}
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Deductions
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      {...register("deduction")}
                      type="text"
                      className={`${inputStyle} pl-8 bg-red-50 text-red-800 font-medium`}
                      placeholder="Auto-calculated"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Additional Earnings Tab */}
            {activeTab === "others" && (
              <div>
                <div className="flex items-center mb-4">
                  <RiMoneyDollarCircleLine className="text-green-600 text-xl mr-3" />
                  <h3 className="text-lg font-semibold">
                    Additional Earnings/Deductions
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Advance Recovery (-)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        {...register("advRecovery")}
                        type="text"
                        className={`${inputStyle} pl-8`}
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arrear Payments (+)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        {...register("arrearPayments")}
                        type="text"
                        className={`${inputStyle} pl-8`}
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Additional Earnings
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      {...register("otherEarning")}
                      type="text"
                      className={`${inputStyle} pl-8 bg-green-50 text-green-800 font-medium`}
                      placeholder="Auto-calculated"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Net Salary */}
        <div className="space-y-6">
          {/* Net Salary Card */}
          <div className={cardStyle}>
            <div className="flex items-center mb-4">
              <GiTakeMyMoney className="text-green-600 text-xl mr-3" />
              <h3 className="text-lg font-semibold">Net Salary</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Net Salary
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    {...register("netSalary")}
                    type="text"
                    className={`${inputStyle} pl-8 bg-green-50 text-green-800 font-medium`}
                    placeholder="Auto-calculated"
                    readOnly
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  handleSubmit(onSubmit)(); // Execute handleSubmit with onSubmit
                  openModal(); // Call openModal
                }}
                className={`${btnStyle} flex items-center justify-center gap-2 w-full`}
              >
                <IoArrowRedoOutline className="text-xl animate-pulse" />
                Create Payslip
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalData.isOpen && (
        <CreateSalaryModal
          closeModal={closeModal}
          salaryData={modalData.salaryData}
        />
      )}
    </div>
  );
};

export default CreateSalary;
