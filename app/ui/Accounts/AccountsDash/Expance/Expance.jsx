import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Expance = ({ data }) => {
  // const totalExpenses = data?.reduce((sum, item) => sum + item.amount, 0) || 0

  return (
    <Card className="w-full bg-[#FF0000]/10 rounded-2xl flex justify-center items-center text-center">
      <div className="">
      <CardHeader>
        <CardTitle>Expenses</CardTitle>
      </CardHeader>
      <CardContent className="">
        <div className="text-2xl font-semibold">${data.toFixed(2)}</div>
        <div className="text-sm"><i>Included Salary</i></div>
      </CardContent>
      </div>
    </Card>
  )
}

export default Expance

