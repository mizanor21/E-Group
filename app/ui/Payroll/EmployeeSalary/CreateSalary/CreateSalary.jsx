"use client"
import React from "react";
import { useForm } from "react-hook-form";
import { CiEdit } from "react-icons/ci";

const CreateSalary = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const inputStyle =
        "border rounded-md p-3 px-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full";
    const btnStyle =
        "bg-sky-600 text-white px-10 py-3 rounded-md text-center hover:bg-white hover:border hover:border-sky-600 hover:text-sky-600 transition-all duration-500 mt-6";

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <div className="bg-white p-10 space-y-10">
            <h2 className="text-xl md:text-2xl lg:text-4xl text-center font-semibold bg-gradient-to-r from-[#4572ba] to-sky-600  bg-clip-text text-transparent ">
                Basic Information
            </h2>

            {/* Employee Info Section */}
            <div className="my-8 md:flex justify-between items-center text-center">
                <div>
                    <h3 className="text-2xl font-bold">Abubakar Alghazali</h3>
                    <p className="text-gray-500">Managing Director | MD/CEO</p>
                </div>
                <button className={`flex items-center gap-2 ${btnStyle}`}>
                    Edit Information
                    <CiEdit className="text-lg" />
                </button>
            </div>

            <hr />

            {/* Working Days Section */}
            <div className="mb-6">
                <h4 className="text-lg font-semibold">Working Days</h4>
                <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-4  border rounded-xl p-5">
                    <input
                        {...register("workingDays", { required: "This field is required" })}
                        type="number"
                        className={inputStyle}
                        placeholder="Enter days"
                    />
                    {errors.workingDays && <p className="text-red-500 text-sm">{errors.workingDays.message}</p>}
                    <button className="bg-sky-600 text-white px-10 py-3 rounded-md text-center hover:bg-white hover:border hover:border-sky-600 hover:text-sky-600 transition-all duration-500">Process</button>
                </form>
            </div>

            {/* Over Time Section */}
            <div>
                <h4 className="text-lg font-semibold">Over Time</h4>
                <div className="flex justify-between border rounded-xl border-gray-400 p-5">
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                            <label className="block mb-2">Normal Day Over Time</label>
                            <input
                                {...register("normalOverTime", { required: "This field is required" })}
                                type="number"
                                className={inputStyle}
                                placeholder="Enter Hours"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Holiday Over Time</label>
                            <input
                                {...register("holidayOverTime", { required: "This field is required" })}
                                type="number"
                                className={inputStyle}
                                placeholder="Enter Hours"
                            />
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
                        <button className={btnStyle}>Process</button>
                    </form>
                    <div className="mt-6 border border-sky-600 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-center">Total Allowance Earning</h4>
                        <div className="text-center text-gray-500 mt-4">
                            <p>Leave It Empty It will Auto Generate</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Allowances Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                    <h3 className="text-lg font-semibold">Allowances</h3>
                    <div className="border rounded-lg p-5 shadow-sm">
                        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 mt-4">
                            <input {...register("allowances")} type="text" placeholder="Allowances" className={inputStyle} />
                            <input {...register("specialAllowances")} type="text" placeholder="Special Allowances" className={inputStyle} />
                            <input {...register("accommodation")} type="text" placeholder="Accommodation" className={inputStyle} />
                            <input {...register("foodAllowance")} type="text" placeholder="Food Allowance" className={inputStyle} />
                            <input {...register("telephoneAllowance")} type="text" placeholder="Telephone Allowance" className={inputStyle} />
                            <input {...register("transportAllowance")} type="text" placeholder="Transport Allowance" className={inputStyle} />
                        </form>
                        <button className={btnStyle}>Process</button>
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
                            <input {...register("numberOfLeave")} type="text" placeholder="Number of Leave" className={inputStyle} />
                            <input {...register("dedLeave")} type="text" placeholder="Ded Leave" className={inputStyle} />
                            <input {...register("dedFines")} type="text" placeholder="Ded-Fines" className={inputStyle} />
                            <input {...register("dedDoc")} type="text" placeholder="Ded-Doc" className={inputStyle} />
                            <input {...register("dedOthers")} type="text" placeholder="Ded-Others" className={inputStyle} />
                        </form>
                        <button className={btnStyle}>Process</button>
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
                            <input {...register("advRecovery")} type="text" placeholder="Adv Recovery" className={inputStyle} />
                            <input {...register("arrearPayments")} type="text" placeholder="Arrear Payments" className={inputStyle} />
                            <input {...register("currentBalance")} type="text" placeholder="Current Balance" className={inputStyle} />
                        </form>
                        <button className={btnStyle}>Process</button>
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
                        <input
                            {...register("netSalary")}
                            type="text"
                            placeholder="Enter The Amount"
                            className={inputStyle}
                        />
                        <button className={btnStyle}>Create Payslip</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateSalary;
