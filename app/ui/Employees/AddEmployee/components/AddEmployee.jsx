"use client"

import { useState, useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import EmployeeBasicInfo from "./EmployeeBasicInfo"
import HRDetails from "./HRDetails"
import Documents from "./Documents"
import PaymentInfo from "./PaymentInfo"
import Summary from "./Summary"
import ProgressBar from "./ProgressBar"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import axios from "axios"
import toast from "react-hot-toast"

const steps = ["Basic Info", "HR Details", "Documents", "Payment Info", "Summary"]

export default function AddEmployee() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const methods = useForm({
    mode: "all",
  })

  const { watch, setValue, getValues } = methods
  const isSameAddress = watch("isSameAddress")

  // Update permanent address when present address changes and isSameAddress is true
  useEffect(() => {
    if (isSameAddress) {
      const presentAddress = getValues([
        "presentAddress1",
        "presentAddress2",
        "presentCity",
        "presentDivision",
        "presentPostOrZipCode",
      ])
      setValue("permanentAddress1", presentAddress.presentAddress1)
      setValue("permanentAddress2", presentAddress.presentAddress2)
      setValue("permanentCity", presentAddress.presentCity)
      setValue("permanentDivision", presentAddress.presentDivision)
      setValue("permanentPostOrZipCode", presentAddress.presentPostOrZipCode)
    }
  }, [isSameAddress, setValue, getValues])

  const onSubmit = async (data) => {
    setShowConfirmation(true)
  }

  const handleConfirmSubmit = async () => {
    const data = getValues()
    // If addresses are same, use present address values
    if (data.isSameAddress) {
      data.permanentAddress1 = data.presentAddress1
      data.permanentAddress2 = data.presentAddress2
      data.permanentCity = data.presentCity
      data.permanentDivision = data.presentDivision
      data.permanentPostOrZipCode = data.presentPostOrZipCode
    }

    try {
      const response = await axios.post("/api/employees", data)

      if (response.status === 201) {
        toast.success("Employee successfully added!")
        setShowConfirmation(false)
        methods.reset() // Reset form
        setCurrentStep(0) // Go back to first step
      }
    } catch (error) {
      toast.error(` Please valid info provide and try again.`)
    }
  }

  const nextStep = async () => {
    const isValid = await methods.trigger()
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <EmployeeBasicInfo />;
      case 1:
        return <HRDetails />;
      case 2:
        return <Documents />;
      case 3:
        return <PaymentInfo />;
      case 4:
        return <Summary />;
      default:
        return null
    }
  }

  return (
    (<FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Employee</h1>
          <ProgressBar steps={steps} currentStep={currentStep} />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}>
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-between">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <ChevronLeftIcon className="w-5 h-5 mr-2" />
                Previous
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ml-auto">
                Next
                <ChevronRightIcon className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors ml-auto">
                Submit
              </button>
            )}
          </div>
        </div>
      </form>
      {showConfirmation && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Submission</h2>
            <p>Are you sure you want to save this employee data?</p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </FormProvider>)
  );
}

