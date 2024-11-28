import React from 'react'
import EmployeePayrollTable from './EmployeePayrollTabel';

const EmployeePayroll = () => {
    const empSalary = Array.from({ length: 100 }, (_, index) => ({
        id: index + 1,
        paymentName: "Monthly salary",
        designation: "Accounts Department",
        daraGenerated: "12/12/2024",
        paymentMonth: "December",
        paymentYear: "2024",
        status:"pending"

    }));
    return (
        <div>
            <EmployeePayrollTable employees={empSalary} />
        </div>
    )
}

export default EmployeePayroll;