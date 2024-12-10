"use client"
import React from "react";
import WpsTable from "./WpsTabel";

const Wps = () => {
    const empSalary = Array.from({ length: 100 }, (_, index) => ({
        id: index + 1,
        name: "Mahbub Jamil",
        regNo: "10001",
        opBal: "0.00",
        salary: "0.00",
        overtime: "0.00",
        allowance: "0",
        grossPay: "0.00",
        deduction: "0.00",
        other: "0.00",
        netPayable: "0.00",
        paid: "0.00",
    }));
    return (
        <div>
            <WpsTable employees={empSalary} />
        </div>
    );
};

export default Wps;
