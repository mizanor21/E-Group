import { CheckIcon } from "@heroicons/react/24/solid"

const ProgressBar = ({ steps, currentStep }) => {
  return (
    (<div className="mb-8">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStep ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600"
              }`}>
              {index < currentStep ? <CheckIcon className="w-5 h-5" /> : index + 1}
            </div>
            <span className="mt-2 text-xs text-gray-500">{step}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 h-2 bg-gray-200 rounded-full">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}></div>
      </div>
    </div>)
  );
}

export default ProgressBar

