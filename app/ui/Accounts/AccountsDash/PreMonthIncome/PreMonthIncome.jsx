import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const PreMonthIncome = ({ data }) => {
//   const totalIncome = data?.reduce((sum, item) => sum + item.amount, 0) || 0

  return (
    <Card className="w-full bg-[#09AF5F]/80 text-white rounded-2xl flex justify-center items-center text-center">
      <div className="">
      <CardHeader>
        <CardTitle>Income</CardTitle>
      </CardHeader>
      <CardContent className="">
        <div className="text-2xl font-semibold">${data?.toFixed(2)}</div>
        <div className="text-sm"><i>Excluding Investment</i></div>
      </CardContent>
      </div>
    </Card>
  )
}

export default PreMonthIncome

