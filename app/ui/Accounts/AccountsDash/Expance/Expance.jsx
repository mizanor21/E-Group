import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Expance = ({ data }) => {
  // const totalExpenses = data?.reduce((sum, item) => sum + item.amount, 0) || 0

  return (
    <Card className="w-full bg-[#FF0000]/70 text-white rounded-2xl p-4">
      <CardHeader>
        <CardTitle>Expenses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-2xl font-semibold">${data.toFixed(2)}</div>
        <div className="text-sm"><i>Included Salary</i></div>
      </CardContent>
    </Card>
  )
}

export default Expance

