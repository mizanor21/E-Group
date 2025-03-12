import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Withdraw = ({ data }) => {
  const totalInvestment = data?.reduce((sum, item) => sum + item.amount, 0) || 0

  return (
    <Card className="w-full bg-[#A601FF] text-white rounded-2xl flex justify-center items-center text-center">
      <div className="">
      <CardHeader>
        <CardTitle>Withdraw</CardTitle>
      </CardHeader>
      <CardContent className="">
        <div className="text-2xl font-semibold">${totalInvestment.toFixed(2)}</div>
        <div className="text-sm"><i >Transactions: <span className="font-bold">{data?.length || 0}</span></i></div>
      </CardContent>
      </div>
    </Card>
  )
}

export default Withdraw

