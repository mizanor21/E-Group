"use client"
import { useState, useEffect } from "react"
import { useExpensesData, useIncomeData, useInvestmentData } from "@/app/data/DataFetch"
import Expance from "@/app/ui/Accounts/AccountsDash/Expance/Expance"
import Investment from "@/app/ui/Accounts/AccountsDash/Investment/Investment"
import PreMonthIncome from "@/app/ui/Accounts/AccountsDash/PreMonthIncome/PreMonthIncome"
import Finance from "@/app/ui/Accounts/Finance/Finance"
import AnnualPayrollSummary from "@/app/ui/Payroll/AnnualPayrollSummary"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const Page = () => {
  const { data: income } = useIncomeData()
  const { data: expenses } = useExpensesData()
  const { data: investment } = useInvestmentData()

  const [selectedYear, setSelectedYear] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")

  const years = Array.from(
    new Set([
      ...(income?.map((item) => new Date(item.date).getFullYear()) || []),
      ...(expenses?.map((item) => new Date(item.date).getFullYear()) || []),
      ...(investment?.map((item) => new Date(item.date).getFullYear()) || []),
    ]),
  ).sort((a, b) => b - a)

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  useEffect(() => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear().toString()
    const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    const previousMonthName = previousMonth.toLocaleString("default", { month: "long" })

    setSelectedYear(currentYear)
    setSelectedMonth(previousMonthName)
  }, [])

  const filterData = (data) => {
    return data?.filter((item) => {
      const itemDate = new Date(item.date)
      return (
        itemDate.getFullYear() === Number.parseInt(selectedYear) &&
        itemDate.getMonth() === months.indexOf(selectedMonth)
      )
    })
  }

  const filteredIncome = filterData(income)
  const filteredExpenses = filterData(expenses)
  const filteredInvestment = filterData(investment)

  const calculateTotalIncome = () => {
    const initialIncome = filteredIncome?.reduce((sum, item) => sum + item.amount, 0) || 0
    const investmentIncome = filteredInvestment?.reduce((sum, item) => sum + item.amount, 0) || 0
    return initialIncome + investmentIncome
  }

  const calculateNetProfit = () => {
    const totalIncome = calculateTotalIncome()
    const totalExpenses = filteredExpenses?.reduce((sum, item) => sum + item.amount, 0) || 0
    return totalIncome - totalExpenses
  }

  const netProfit = calculateNetProfit()
  const netProfitColor = netProfit >= 0 ? "bg-green-500" : "bg-red-500"

  return (
    <div>
      <Finance />
      <div className="mb-4 flex justify-end space-x-4">
        <Select onValueChange={setSelectedYear} value={selectedYear}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setSelectedMonth} value={selectedMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="grid grid-cols-2 gap-5">
          <div className="">
            <PreMonthIncome data={filteredIncome} />
          </div>
          <div className="">
            <Investment data={filteredInvestment} />
          </div>
          <div className="">
            <Expance data={filteredExpenses} />
          </div>
          <Card className={`rounded-2xl p-4 ${netProfitColor} flex items-center justify-center text-center`}>
            <CardContent>
              <h3 className="text-lg font-semibold text-white">Net Profit</h3>
              <p className=" font-bold text-white mt-2">
                <span className="text-4xl">

                ${Math.abs(netProfit).toFixed(2)}
                </span>
                {netProfit < 0 && " (Loss)"}
              </p>
            </CardContent>
          </Card>
          
        </div>
        <AnnualPayrollSummary />
      </div>
    </div>
  )
}

export default Page

