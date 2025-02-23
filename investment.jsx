import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Investment = ({ data }) => {
  const totalInvestment = data?.reduce((sum, item) => sum + item.amount, 0) || 0

  return (
    (<Card className="w-full bg-[#A601FF] rounded-2xl p-4">
      <CardHeader>
        <CardTitle>Investment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-2xl font-semibold">${totalInvestment.toFixed(2)}</div>
        <div className="text-sm text-gray-500">Transactions: {data?.length || 0}</div>
      </CardContent>
    </Card>)
  );
}

export default Investment

