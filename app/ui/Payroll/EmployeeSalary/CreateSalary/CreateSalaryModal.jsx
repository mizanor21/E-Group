import React from "react";

const CreateSalaryModal = ({ closeModal }) => {
    const handleSave = () => {
        // Add save logic here 
        console.log("Payslip saved!");
        closeModal();
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-10 rounded-lg shadow-lg w-1/3">
                <h2 className="text-2xl font-semibold text-center mb-4">Payslip Details</h2>
                <p className="text-center">Your payslip has been created successfully!</p>
                <div className="flex gap-10 justify-center text-center mt-6">
                    <button onClick={closeModal} className="bg-neutral-200 hover:bg-gray-300  px-6 py-2 rounded-md">
                        Close
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-sky-600 hover:bg-white text-white hover:text-sky-600 border hover:border-sky-600 px-6 py-2 rounded-md">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateSalaryModal;
