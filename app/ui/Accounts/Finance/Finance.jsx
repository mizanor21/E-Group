"use client"

import { useState } from "react"
import { IncomeForm } from "./income-form"
import { ExpenseForm } from "./expense-form"
import { InvestmentForm } from "./investment-form"
import { WithdrawForm } from "./withdraw-form"
import { useLoginUserData } from "@/app/data/DataFetch"

const Finance=() =>{
  const {data}  = useLoginUserData([]);
  const [activeDialog, setActiveDialog] = useState(null)

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Accounts Dashboard</h2>
        {
          data?.permissions?.accounts?.create && (
          <div className="space-x-2">
            <button
              onClick={() => setActiveDialog("income")}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Income
            </button>
            <button
              onClick={() => setActiveDialog("expense")}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Add Expense
            </button>
            <button
              onClick={() => setActiveDialog("investment")}
              className="bg-[#b863e5] hover:bg-[#A601F9] text-white font-bold py-2 px-4 rounded"
            >
              Add Investment
            </button>
            <button
              onClick={() => setActiveDialog("withdraw")}
              className="bg-[#b863e5] hover:bg-[#A601F9] text-white font-bold py-2 px-4 rounded"
            >
              Add Withdraw
            </button>
          </div>
          )
        }
      </div>

      {activeDialog === "income" && <IncomeForm onClose={() => setActiveDialog(null)} />}
      {activeDialog === "expense" && <ExpenseForm onClose={() => setActiveDialog(null)} />}
      {activeDialog === "investment" && <InvestmentForm onClose={() => setActiveDialog(null)} />}
      {activeDialog === "withdraw" && <WithdrawForm onClose={() => setActiveDialog(null)} />}
    </div>
  )
}

export default Finance