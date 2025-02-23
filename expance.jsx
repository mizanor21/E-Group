import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Expance = ({ data, salaryData }) => {
  const totalExpenses = data?.reduce((sum, item) => sum + item.amount, 0) || 0
  const totalSalary = salaryData?.reduce((sum, salary) => sum + salary.netSalary, 0) || 0
  const grandTotal = totalExpenses + totalSalary

  return (
    (<Card className="w-full bg-[#FF0000]/10 rounded-2xl p-4">
      <CardHeader>
        <CardTitle>Expenses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-2xl font-semibold">${grandTotal.toFixed(2)}</div>
        <div className="text-sm text-gray-500">Expenses: ${totalExpenses.toFixed(2)}</div>
        <div className="text-sm text-gray-500">Salaries: ${totalSalary.toFixed(2)}</div>
        <div className="text-sm text-gray-500">Transactions: {(data?.length || 0) + (salaryData?.length || 0)}</div>
      </CardContent>
    </Card>)
  );
}

export default Expance

