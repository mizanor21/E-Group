const StepIndicator = ({ steps, currentStep }) => {
  return (
    (<div className="flex justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index <= currentStep ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600"
            }`}>
            {index + 1}
          </div>
          <span className="mt-2 text-sm">{step}</span>
        </div>
      ))}
    </div>)
  );
}

export default StepIndicator

