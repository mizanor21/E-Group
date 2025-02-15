"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { CiEdit } from "react-icons/ci";
import CreateSalaryModal from "./CreateSalaryModal";
import { IoArrowRedoOutline } from "react-icons/io5";
import { useEmployeeDetailsData } from "@/app/data/DataFetch";
import { GoArrowLeft } from "react-icons/go";
import Link from "next/link";

const CreateSalary = ({ id }) => {
  const { data, error, isLoading } = useEmployeeDetailsData({ params: { id } });

  const eID = data?.employeeID;
  const eName = data?.firstName + " " + data?.lastName;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();
  const [modalData, setModalData] = useState({
    isOpen: false,
    salaryData: null,
  });

  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // Default to current month

  const inputStyle =
    "border rounded-md p-3 px-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full";
  const btnStyle =
    "bg-sky-600 text-white px-10 py-3 rounded-md text-center hover:bg-white hover:border hover:border-sky-600 hover:text-sky-600 transition-all duration-500 mt-6";

  const onSubmit = (data) => {
    // Perform calculations
    const basicSalary = 20000; // Assume a basic salary, adjust as needed
    const workingDays = Number.parseInt(data.workingDays) || 0;
    const normalOverTime = Number.parseFloat(data.normalOverTime) || 0;
    const holidayOverTime = Number.parseFloat(data.holidayOverTime) || 0;

    const dailyRate = basicSalary / 30; // Assuming 30 days in a month
    const baseSalary = dailyRate * workingDays;

    const normalOTRate = (dailyRate / 8) * 1.25; // Assume 1.25x rate for normal OT
    const holidayOTRate = (dailyRate / 8) * 1.5; // Assume 1.5x rate for holiday OT
    const normalOTEarning = normalOverTime * normalOTRate;
    const holidayOTEarning = holidayOverTime * holidayOTRate;

    const totalAllowances = [
      "allowances",
      "specialAllowances",
      "accommodation",
      "foodAllowance",
      "telephoneAllowance",
      "transportAllowance",
    ].reduce((sum, key) => sum + (Number.parseFloat(data[key]) || 0), 0);

    const numberOfLeave = Number.parseInt(data.numberOfLeave) || 0;
    const leaveDeduction = numberOfLeave * dailyRate;
    const otherDeductions = ["dedFines", "dedDoc", "dedOthers"].reduce(
      (sum, key) => sum + (Number.parseFloat(data[key]) || 0),
      0
    );
    const totalDeductions = leaveDeduction + otherDeductions;

    const otherEarnings =
      (Number.parseFloat(data.arrearPayments) || 0) -
      (Number.parseFloat(data.advRecovery) || 0);

    const netSalary =
      baseSalary +
      normalOTEarning +
      holidayOTEarning +
      totalAllowances +
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
  };

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === "change") {
        handleSubmit(onSubmit)();
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, handleSubmit, onSubmit]); // Added onSubmit to dependencies

  const openModal = async () => {
    const salaryData = {
      employeeId: eID,
      name: eName,
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
      // Handle error (e.g., show error message to user)
    }
  };

  const closeModal = () => setModalData({ isOpen: false, salaryData: null });

  return (
    <div className="bg-white p-10 space-y-10">
      <h2 className="text-xl md:text-2xl lg:text-4xl text-center font-semibold bg-gradient-to-r from-[#4572ba] to-sky-600  bg-clip-text text-transparent ">
        Salary Information
      </h2>

      {/* Employee Info Section */}
      <div className=" md:flex justify-between items-center">
        <div>
          <button className="mb-3">
            <Link
              href={"/dashboard/payroll"}
              className="text-2xl 2xl:text-3xl "
            >
              <GoArrowLeft />
            </Link>
          </button>
          <h3 className="text-2xl font-bold">
            {data?.firstName} {data?.lastName}
          </h3>
          <p className="text-gray-500">
            {data?.currentJob} | {data?.department}
          </p>
        </div>
        <button className={`flex items-center gap-2 ${btnStyle}`}>
          Edit Information
          <CiEdit className="text-lg" />
        </button>
      </div>

      <hr />

      {/* Month Selection */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold">Salary Month</h4>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className={inputStyle}
        />
      </div>

      {/* Working Days Section */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold">Working Days</h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-start gap-4 border rounded-xl p-5"
        >
          <input
            {...register("workingDays", {
              required: "This field is required",
              min: { value: 1, message: "Value must be at least 1" },
              max: { value: 31, message: "Value cannot exceed 31" },
            })}
            type="number"
            className={inputStyle}
            placeholder="Enter days"
            min="1"
            max="31"
          />
          {errors.workingDays && (
            <p className="text-red-500 text-sm">{errors.workingDays.message}</p>
          )}
          <div>
            <label className="block mb-2">Base Salary (for worked days)</label>
            <input
              {...register("baseSalary")}
              type="text"
              className={inputStyle}
              placeholder="Base salary will be calculated automatically"
              readOnly
            />
          </div>
        </form>
      </div>

      {/* Over Time Section */}
      <div>
        <h4 className="text-lg font-semibold">Over Time</h4>
        <div className="flex justify-between border rounded-xl border-gray-400 p-5">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"
          >
            <div>
              <label className="block mb-2">Normal Day Over Time</label>
              <input
                {...register("normalOverTime")}
                type="number"
                className={inputStyle}
                placeholder="Enter Hours"
              />
            </div>
            <div>
              <label className="block mb-2">Holiday Over Time</label>
              <input
                {...register("holidayOverTime")}
                type="number"
                className={inputStyle}
                placeholder="Enter Hours"
              />
            </div>
            <div>
              <label className="block mb-2">
                Total Normal Over Time Earning
              </label>
              <input
                {...register("normalOverTimeEarning")}
                type="text"
                className={inputStyle}
                placeholder="Leave It Empty It will Auto Generate"
                readOnly
              />
            </div>
            <div>
              <label className="block mb-2">
                Total Holiday Over Time Earning
              </label>
              <input
                {...register("holidayOverTimeEarning")}
                type="text"
                className={inputStyle}
                placeholder="Leave It Empty It will Auto Generate"
                readOnly
              />
            </div>
          </form>
        </div>
      </div>

      {/* Allowances Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div>
          <h3 className="text-lg font-semibold">Allowances</h3>
          <div className="border rounded-lg p-5 shadow-sm">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-2 gap-4 mt-4"
            >
              <input
                {...register("allowances")}
                type="text"
                placeholder="Allowances"
                className={inputStyle}
              />
              <input
                {...register("specialAllowances")}
                type="text"
                placeholder="Special Allowances"
                className={inputStyle}
              />
              <input
                {...register("accommodation")}
                type="text"
                placeholder="Accommodation"
                className={inputStyle}
              />
              <input
                {...register("foodAllowance")}
                type="text"
                placeholder="Food Allowance"
                className={inputStyle}
              />
              <input
                {...register("telephoneAllowance")}
                type="text"
                placeholder="Telephone Allowance"
                className={inputStyle}
              />
              <input
                {...register("transportAllowance")}
                type="text"
                placeholder="Transport Allowance"
                className={inputStyle}
              />
            </form>
            <h4 className="font-bold text-center mt-4">Allowance Earning</h4>
            <input
              {...register("allowanceEarning")}
              type="text"
              placeholder="Leave It Empty It will Auto Generate"
              className={inputStyle}
              readOnly
            />
          </div>
        </div>

        {/* Deductions Section */}
        <div>
          <h3 className="text-lg font-semibold">Deductions</h3>
          <div className="border rounded-xl border-rose-500 p-5 shadow-sm">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-2 gap-4 mt-4"
            >
              <input
                {...register("numberOfLeave")}
                type="number"
                placeholder="Number of Leave Days"
                className={inputStyle}
              />
              <input
                {...register("dedFines")}
                type="text"
                placeholder="Ded-Fines"
                className={inputStyle}
              />
              <input
                {...register("dedDoc")}
                type="text"
                placeholder="Ded-Doc"
                className={inputStyle}
              />
              <input
                {...register("dedOthers")}
                type="text"
                placeholder="Ded-Others"
                className={inputStyle}
              />
            </form>
            <h4 className="font-bold text-red-500 text-center mt-4">
              Deduction
            </h4>
            <input
              {...register("deduction")}
              type="text"
              placeholder="Leave It Empty It will Auto Generate"
              className={`${inputStyle} border-red-500`}
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Others Section */}
      <div>
        <h3 className="text-lg font-semibold">Others</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="border rounded-lg p-5 shadow-sm">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-2 gap-4 mt-4"
            >
              <input
                {...register("advRecovery")}
                type="text"
                placeholder="Advance Recovery"
                className={inputStyle}
              />
              <input
                {...register("arrearPayments")}
                type="text"
                placeholder="Arrear Payments"
                className={inputStyle}
              />
              <input
                {...register("currentBalance")}
                type="text"
                placeholder="Current Balance"
                className={inputStyle}
              />
            </form>
            <h4 className="font-bold text-center text-2xl mt-4">
              Other Earning
            </h4>
            <input
              {...register("otherEarning")}
              type="text"
              placeholder="Leave It Empty It will Auto Generate"
              className={inputStyle}
              readOnly
            />
          </div>

          {/* Net Salary Section */}
          <div className="border-dashed border border-gray-400 rounded-lg p-5 shadow-sm">
            <h3 className="text-2xl text-center font-semibold">Net Salary</h3>
            <label className="block mb-2">Net Salary</label>
            <input
              {...register("netSalary")}
              type="text"
              className={inputStyle}
              readOnly
            />
            <button
              onClick={() => {
                handleSubmit(onSubmit)(); // Execute handleSubmit with onSubmit
                openModal(); // Call openModal
              }}
              className={`${btnStyle} flex gap-2 mt-4`}
            >
              Create Payslip
              <IoArrowRedoOutline className="text-2xl animate-pulse" />
            </button>
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
