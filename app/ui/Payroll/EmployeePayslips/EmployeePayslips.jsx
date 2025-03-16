'use client'
import React from 'react'
import EmployeePayslipsTable from './EmployeePayslipsTable';
import { useSalaryData } from '@/app/data/DataFetch';

const EmployeePayslips = () => {
    const {data} = useSalaryData([])
    return (
        <div>
            <EmployeePayslipsTable employees={data} />
        </div>
    )
}

export default EmployeePayslips