"use client"
import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import EmployeeBasicInfo from "./EmployeeBasicInfo"
import HRDetails from "./HRDetails"
import Documents from "./Documents"
import PaymentInfo from "./PaymentInfo"
import Summary from "./Summary"
import ProgressBar from "./ProgressBar"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid"

const steps = ["Basic Info", "HR Details", "Documents", "Payment Info", "Summary"]

export default function AddEmployee() {
  const [currentStep, setCurrentStep] = useState(0)
  const methods = useForm({
    mode: "all",
    defaultValues: {
      // Add default values for all form fields here
    },
  })

  const { handleSubmit, trigger } = methods

  const onSubmit = async (data) => {
    console.log(data)
    // Here you would typically send the data to your backend API
    // Implement your API call here
  }

  const nextStep = async () => {
    const isValid = await trigger()
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
      <div className=" p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Employee</h1>
        <ProgressBar steps={steps} currentStep={currentStep} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}>
              {renderStep()}
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex justify-between">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
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
        </form>
      </div>
    </FormProvider>)
  );
}

