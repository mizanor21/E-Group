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

const steps = ["Basic Info", "HR Details", "Documents", "Payment Info", "Summary"]

export default function AddEmployee() {
  const [currentStep, setCurrentStep] = useState(0)
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
    // If addresses are same, use present address values
    if (data.isSameAddress) {
      data.permanentAddress1 = data.presentAddress1
      data.permanentAddress2 = data.presentAddress2
      data.permanentCity = data.presentCity
      data.permanentDivision = data.presentDivision
      data.permanentPostOrZipCode = data.presentPostOrZipCode
    }

    console.log(data)
    // Here you would typically send the data to your backend API
    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        console.log("Employee data submitted successfully")
        // Reset form or redirect to a success page
      } else {
        console.error("Failed to submit employee data")
        // Handle error
      }
    } catch (error) {
      console.error("Error submitting employee data:", error)
      // Handle error
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
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="max-w-7xl mx-auto p-6">
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
    </FormProvider>)
  );
}

