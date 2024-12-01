"use client";
import React from "react";
import { useForm } from "react-hook-form";

const CreateTaxModal = ({ addNewTax, onClose }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = (data) => {
        const newTax = { regNo: Date.now(), ...data };
        addNewTax(newTax);
        reset(); // Clear the form
        onClose(); // Close the modal
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Create Tax Definition</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="taxType" className="block text-gray-700">
                            Tax Type
                        </label>
                        <input
                            id="taxType"
                            {...register("taxType", {
                                required: "Tax Type is required",
                                maxLength: {
                                    value: 50,
                                    message: "Tax Type cannot exceed 50 characters",
                                },
                            })}
                            type="text"
                            className="w-full border rounded px-3 py-2"
                            placeholder="Enter tax type"
                        />
                        {errors.taxType && (
                            <p className="text-red-500 text-sm mt-1">{errors.taxType.message}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="value" className="block text-gray-700">
                            % Value
                        </label>
                        <input
                            id="value"
                            {...register("value", {
                                required: "Value is required",
                                min: {
                                    value: 0,
                                    message: "Value must be at least 0%",
                                },
                                max: {
                                    value: 100,
                                    message: "Value cannot exceed 100%",
                                },
                            })}
                            type="number"
                            className="w-full border rounded px-3 py-2"
                            placeholder="Enter percentage value"
                        />
                        {errors.value && (
                            <p className="text-red-500 text-sm mt-1">{errors.value.message}</p>
                        )}
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                        >
                            Add Tax
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaxModal;
