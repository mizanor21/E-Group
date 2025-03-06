import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const PreMonthIncome = ({ data }) => {
//   const totalIncome = data?.reduce((sum, item) => sum + item.amount, 0) || 0

  return (
    <Card className="w-full bg-[#09AF5F]/80 text-white rounded-2xl p-4">
      <CardHeader>
        <CardTitle>Income</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-2xl font-semibold">${data?.toFixed(2)}</div>
        <div className="text-sm"><i>Excluding Investment</i></div>
      </CardContent>
    </Card>
  )
}

export default PreMonthIncome

