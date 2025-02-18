"use client"

import { useState } from "react"
import { IncomeForm } from "./income-form"
import { ExpenseForm } from "./expense-form"
import { InvestmentForm } from "./investment-form"

const AccountsDashboard=() =>{
  const [activeDialog, setActiveDialog] = useState(null)

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Accounts Dashboard</h2>
        <div className="space-x-2">
          <button
            onClick={() => setActiveDialog("income")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
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
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Add Investment
          </button>
        </div>
      </div>

      {activeDialog === "income" && <IncomeForm onClose={() => setActiveDialog(null)} />}
      {activeDialog === "expense" && <ExpenseForm onClose={() => setActiveDialog(null)} />}
      {activeDialog === "investment" && <InvestmentForm onClose={() => setActiveDialog(null)} />}
    </div>
  )
}

export default AccountsDashboard