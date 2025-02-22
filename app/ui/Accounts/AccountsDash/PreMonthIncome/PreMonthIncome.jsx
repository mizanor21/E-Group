import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const PreMonthIncome = ({ data }) => {
    console.log(data)
  const [selectedMonth, setSelectedMonth] = useState("")
  const [selectedYear, setSelectedYear] = useState("")

  const years = Array.from(new Set(data?.map((item) => new Date(item.date).getFullYear()))).sort((a, b) => b - a)
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

  const filteredData = data?.filter((item) => {
    const itemDate = new Date(item.date)
    return ((!selectedYear || itemDate.getFullYear() === Number.parseInt(selectedYear)) && (!selectedMonth || itemDate.getMonth() === months.indexOf(selectedMonth)));
  })

  const totalIncome = filteredData?.reduce((sum, item) => sum + item.amount, 0)

  return (
    (<Card className="w-full max-w-md bg-[#09AF5F]/10 rounded-2xl p-4">
      <CardHeader>
        <CardTitle>Income</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-4">
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
        <div className="text-lg font-semibold">Total Income: ${totalIncome?.toFixed(2)}</div>
        <div className="text-sm text-gray-500">Number of transactions: {filteredData?.length}</div>
      </CardContent>
    </Card>)
  );
}

export default PreMonthIncome

