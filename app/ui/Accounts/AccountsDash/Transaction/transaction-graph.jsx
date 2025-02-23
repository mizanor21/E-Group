"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const TransactionGraph = ({ data }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transaction Graph</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#37BD7F" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="expenses" stroke="#EF4444" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default TransactionGraph

