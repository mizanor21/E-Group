"use client"
import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { CiEdit } from "react-icons/ci"
import CreateSalaryModal from "./CreateSalaryModal"
import { IoArrowRedoOutline } from "react-icons/io5"
import { useEmployeeDetailsData } from "@/app/data/DataFetch"
import { GoArrowLeft } from "react-icons/go"
import Link from "next/link"

const calculateSalaryByType = (employeeType, data, workingDays, numberOfLeave = 0) => {
  const {
    basicPay = 0,
    hourlyRate = 0,
    dailyRate = 0,
    commission = 0,
    accAllowance = 0,
    foodAllowance = 0,
    telephoneAllowance = 0,
    transportAllowance = 0,
  } = data

  let baseSalary = 0
  const standardWorkingHours = 8 // Standard daily working hours

  // Calculate actual working days after deducting leaves
  const actualWorkingDays = Math.max(0, workingDays - numberOfLeave)

  switch (employeeType?.toLowerCase()) {
    case "hourly":
      // Calculate hourly salary based on actual working days and hours
      baseSalary = hourlyRate * workingDays
      break

    case "daily":
      // Calculate daily salary based on actual working days
      baseSalary = dailyRate * workingDays
      break

    case "monthly":
      // Calculate monthly salary prorated for actual working days
      baseSalary = basicPay
      break

    default:
      baseSalary = 0
  }

  // Add fixed allowances - these are typically not affected by leaves
  const totalAllowances = [accAllowance, foodAllowance, telephoneAllowance, transportAllowance].reduce(
    (sum, allowance) => sum + (Number(allowance) || 0),
    0,
  )

  // Add commission if applicable
  const totalCommission = Number(commission) || 0

  return {
    baseSalary,
    totalAllowances,
    totalCommission,
    grossSalary: baseSalary + totalAllowances + totalCommission,
    actualWorkingDays,
  }
}

const CreateSalary = ({ id }) => {
  const { data: employeeData, error, isLoading } = useEmployeeDetailsData({ params: { id } })
  console.log(employeeData)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm()

  const [modalData, setModalData] = useState({
    isOpen: false,
    salaryData: null,
  })

  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))

  const inputStyle =
    "border rounded-md p-3 px-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
  const btnStyle =
    "bg-sky-600 text-white px-10 py-3 rounded-md text-center hover:bg-white hover:border hover:border-sky-600 hover:text-sky-600 transition-all duration-500 mt-6"

    const onSubmit = useCallback(
      (formData) => {
        const workingDays = Number.parseInt(formData.workingDays) || 0
        const numberOfLeave = Number.parseInt(formData.numberOfLeave) || 0
    
        // Calculate base salary based on employee type and actual working days
        const { baseSalary, totalAllowances, totalCommission, grossSalary, actualWorkingDays } = calculateSalaryByType(
          employeeData.employeeType,
          employeeData,
          workingDays,
          numberOfLeave,
        )
    
        // Calculate overtime
        const normalOverTime = Number.parseFloat(formData.normalOverTime) || 0
        const holidayOverTime = Number.parseFloat(formData.holidayOverTime) || 0
    
        // Calculate OT rates based on employee type
        let normalOTRate, holidayOTRate
    
        if (employeeData.employeeType?.toLowerCase() === "hourly") {
          normalOTRate = employeeData.hourlyRate * 1.25 // 1.25x for normal OT
          holidayOTRate = employeeData.hourlyRate * 1.5 // 1.5x for holiday OT
        } else {
          // For daily and monthly employees, calculate OT rate based on their daily rate
          const dailyRate = employeeData.dailyRate || employeeData.basicPay / workingDays
          const hourlyRate = dailyRate / 10
          normalOTRate = hourlyRate * 1.25
          holidayOTRate = hourlyRate * 1.5
        }
    
        const normalOTEarning = normalOverTime * normalOTRate
        const holidayOTEarning = holidayOverTime * holidayOTRate
    
        // Calculate deductions
        const dailyRate = employeeData.dailyRate || employeeData.basicPay / workingDays
        const leaveDeduction = dailyRate * numberOfLeave // We don't need separate leave deduction as it's handled in base salary
        const otherDeductions = ["dedFines", "dedDoc", "dedOthers"].reduce(
          (sum, key) => sum + (Number.parseFloat(formData[key]) || 0),
          0,
        )
    
        const totalDeductions = leaveDeduction + otherDeductions // Only include other deductions
    
        // Calculate other earnings
        const otherEarnings =
          (Number.parseFloat(formData.arrearPayments) || 0) - (Number.parseFloat(formData.advRecovery) || 0)
    
        // Calculate net salary
        const netSalary = grossSalary + normalOTEarning + holidayOTEarning + otherEarnings - totalDeductions
    
        // Update form values
        setValue("baseSalary", baseSalary.toFixed(2))
        setValue("normalOverTimeEarning", normalOTEarning.toFixed(2))
        setValue("holidayOverTimeEarning", holidayOTEarning.toFixed(2))
        setValue("allowanceEarning", totalAllowances.toFixed(2))
        setValue("deduction", totalDeductions.toFixed(2))
        setValue("otherEarning", otherEarnings.toFixed(2))
        setValue("netSalary", netSalary.toFixed(2))
      },
      [employeeData, setValue],
    )

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === "change") {
        handleSubmit(onSubmit)()
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, handleSubmit, onSubmit]) // Added onSubmit to dependencies

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
    }

    try {
      const response = await fetch("/api/salary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(salaryData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create salary")
      }

      const result = await response.json()
      console.log(result.message)
      setModalData({ isOpen: true, salaryData })
    } catch (error) {
      console.error("Error creating salary:", error)
      // Handle error (e.g., show error message to user)
    }
  }

  const closeModal = () => setModalData({ isOpen: false, salaryData: null })

  return (
    <div className="bg-white p-10 space-y-10">
      <h2 className="text-xl md:text-2xl lg:text-4xl text-center font-semibold bg-gradient-to-r from-[#4572ba] to-sky-600  bg-clip-text text-transparent ">
        Salary Information
      </h2>

      {/* Employee Info Section */}
      <div className=" md:flex justify-between items-center">
        <div>
          <button className="mb-3">
            <Link href={"/dashboard/payroll"} className="text-2xl 2xl:text-3xl ">
              <GoArrowLeft />
            </Link>
          </button>
          <h3 className="text-2xl font-bold">
            {employeeData?.firstName} {employeeData?.lastName}
          </h3>
          <p className="text-gray-500">
            {employeeData?.currentJob} | {employeeData?.department}
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
        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className={inputStyle} />
      </div>

      {/* Working Days Section */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold">Working Days</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-start gap-4 border rounded-xl p-5">
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
          {errors.workingDays && <p className="text-red-500 text-sm">{errors.workingDays.message}</p>}
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
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block mb-2">Normal Day Over Time</label>
              <input {...register("normalOverTime")} type="number" className={inputStyle} placeholder="Enter Hours" />
            </div>
            <div>
              <label className="block mb-2">Holiday Over Time</label>
              <input {...register("holidayOverTime")} type="number" className={inputStyle} placeholder="Enter Hours" />
            </div>
            <div>
              <label className="block mb-2">Total Normal Over Time Earning</label>
              <input
                {...register("normalOverTimeEarning")}
                type="text"
                className={inputStyle}
                placeholder="Leave It Empty It will Auto Generate"
                readOnly
              />
            </div>
            <div>
              <label className="block mb-2">Total Holiday Over Time Earning</label>
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
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 mt-4">
              <input {...register("allowances")} type="text" placeholder="Allowances" className={inputStyle} />
              <input
                {...register("specialAllowances")}
                type="text"
                placeholder="Special Allowances"
                className={inputStyle}
              />
              <input {...register("accommodation")} type="text" placeholder="Accommodation" className={inputStyle} />
              <input {...register("foodAllowance")} type="text" placeholder="Food Allowance" className={inputStyle} />
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
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 mt-4">
            {employeeData?.employeeType?.toLowerCase() !== "hourly" && employeeData?.employeeType?.toLowerCase() !== "daily" && (
      <input
        {...register("numberOfLeave")}
        type="number"
        placeholder="Number of Leave Days"
        className={inputStyle}
      />
    )}
              <input {...register("dedFines")} type="text" placeholder="Ded-Fines" className={inputStyle} />
              <input {...register("dedDoc")} type="text" placeholder="Ded-Doc" className={inputStyle} />
              <input {...register("dedOthers")} type="text" placeholder="Ded-Others" className={inputStyle} />
            </form>
            <h4 className="font-bold text-red-500 text-center mt-4">Deduction</h4>
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
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 mt-4">
              <input {...register("advRecovery")} type="text" placeholder="Advance Recovery" className={inputStyle} />
              <input {...register("arrearPayments")} type="text" placeholder="Arrear Payments" className={inputStyle} />
            </form>
            <h4 className="font-bold text-center text-2xl mt-4">Other Earning</h4>
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
            <input {...register("netSalary")} type="text" className={inputStyle} readOnly />
            <button
              onClick={() => {
                handleSubmit(onSubmit)() // Execute handleSubmit with onSubmit
                openModal() // Call openModal
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
      {modalData.isOpen && <CreateSalaryModal closeModal={closeModal} salaryData={modalData.salaryData} />}
    </div>
  )
}

export default CreateSalary

