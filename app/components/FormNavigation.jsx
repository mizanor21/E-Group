import { useFormContext } from "react-hook-form"

const FormNavigation = ({ currentStep, stepsLength, nextStep, prevStep }) => {
  const { trigger } = useFormContext()

  const handleNext = async () => {
    const isStepValid = await trigger()
    if (isStepValid) nextStep()
  }

  return (
    (<div className="flex justify-between mt-8">
      {currentStep > 0 && (
        <button
          type="button"
          onClick={prevStep}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
          Previous
        </button>
      )}
      {currentStep < stepsLength - 1 && (
        <button
          type="button"
          onClick={handleNext}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Next
        </button>
      )}
      {currentStep === stepsLength - 1 && (
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Submit
        </button>
      )}
    </div>)
  );
}

export default FormNavigation

