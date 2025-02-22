'use client'
import { useExpensesData, useIncomeData, useInvestmentData } from "@/app/data/DataFetch"
import Expance from "@/app/ui/Accounts/AccountsDash/Expance/Expance"
import Investment from "@/app/ui/Accounts/AccountsDash/Investment/Investment"
import PreMonthIncome from "@/app/ui/Accounts/AccountsDash/PreMonthIncome/PreMonthIncome"
import Finance from "@/app/ui/Accounts/Finance/Finance"
import AnnualPayrollSummary from "@/app/ui/Payroll/AnnualPayrollSummary"

const Page = ({}) => {
  const { data:income} = useIncomeData()
  const { data:expenses} = useExpensesData()
  const { data:investment} = useInvestmentData()
  return <div>
    <Finance/>
    <div className="grid grid-cols-2 gap-5">
      <div className="grid grid-cols-2 gap-5">
        <div className="">
          <PreMonthIncome data={income} />
        </div>
        <div className="">
        <Expance data={expenses} />
        </div>
        <div className="bg-[#377DFF] rounded-2xl p-4">last month net profit</div>
        <div className="">
          <Investment data={investment} />
        </div>
      </div>

      {/* <AccountsDash/> */}
      <AnnualPayrollSummary/>
    </div>
  </div>
}

export default Page