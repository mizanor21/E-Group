import React from 'react'
import EmployeePayslipsTable from './EmployeePayslipsTable';

const EmployeePayslips = () => {
    const empSalary = Array.from({ length: 100 }, (_, index) => ({
        id: index + 1,
        name: "Kabir Sing",
        title: "Managing Directory",
        level: "MD/CSO",
        basicSalary: "N445.221.00",
        allowance: "0.00",
        grossSalary: "0.00",
        deduction: "0.00",
        netSalary: "0.00",
        Action: "0.00",
    }));
    return (
        <div>
            <EmployeePayslipsTable employees={empSalary} />
        </div>
    )
}

export default EmployeePayslips