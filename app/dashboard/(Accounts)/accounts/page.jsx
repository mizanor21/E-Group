"use client";
import { useState, useEffect } from "react";
import {
  useExpensesData,
  useIncomeData,
  useInvestmentData,
  useSalaryData,
  useWithdrawData,
} from "@/app/data/DataFetch";
import Expance from "@/app/ui/Accounts/AccountsDash/Expance/Expance";
import Investment from "@/app/ui/Accounts/AccountsDash/Investment/Investment";
import PreMonthIncome from "@/app/ui/Accounts/AccountsDash/PreMonthIncome/PreMonthIncome";
import Finance from "@/app/ui/Accounts/Finance/Finance";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TransactionGraph from "@/app/ui/Accounts/AccountsDash/Transaction/transaction-graph";
import IncomeOverview from "@/app/ui/Accounts/AccountsDash/PreMonthIncome/income-overview";
import ExpensesOverview from "@/app/ui/Accounts/AccountsDash/Expance/expenses-overview";
import InvestmentOverview from "@/app/ui/Accounts/AccountsDash/Investment/investment-overview";
import Withdraw from "@/app/ui/Accounts/AccountsDash/Withdrow/withdraw";
import WithdrawOverview from "@/app/ui/Accounts/AccountsDash/Withdrow/withdraw-overview";

const Page = () => {
  const { data: income } = useIncomeData();
  const { data: expenses } = useExpensesData();
  const { data: investment } = useInvestmentData();
  const { data: withdraw } = useWithdrawData();
  const { data: salaryData } = useSalaryData();

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const years = Array.from(
    new Set([
      ...(income?.map((item) => new Date(item.date).getFullYear()) || []),
      ...(expenses?.map((item) => new Date(item.date).getFullYear()) || []),
      ...(investment?.map((item) => new Date(item.date).getFullYear()) || []),
      ...(salaryData?.flatMap((employee) =>
        employee.salaries.map((salary) => new Date(salary.month).getFullYear())
      ) || []),
    ])
  ).sort((a, b) => b - a);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const previousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    const previousMonthName = previousMonth.toLocaleString("default", {
      month: "long",
    });

    setSelectedYear(currentYear);
    setSelectedMonth(previousMonthName);
  }, []);

  const filterData = (data) => {
    return data?.filter((item) => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getFullYear() === Number.parseInt(selectedYear) &&
        itemDate.getMonth() === months.indexOf(selectedMonth)
      );
    });
  };

  const filterSalaryData = (data) => {
    return data?.flatMap((employee) =>
      employee.salaries.filter((salary) => {
        const [year, month] = salary.month.split("-");
        return (
          year === selectedYear &&
          Number(month) - 1 === months.indexOf(selectedMonth)
        );
      })
    );
  };

  const filteredIncome = filterData(income);
  const filteredExpenses = filterData(expenses);
  const filteredInvestment = filterData(investment);
  const filteredWithdraw = filterData(withdraw);
  const filteredSalary = filterSalaryData(salaryData);

  const calculateInitialIncome = () => {
    return filteredIncome?.reduce((sum, item) => sum + item.amount, 0) || 0;
  };

  const calculateTotalIncome = () => {
    const initialIncome =
      filteredIncome?.reduce((sum, item) => sum + item.amount, 0) || 0;
    const investmentIncome =
      filteredInvestment?.reduce((sum, item) => sum + item.amount, 0) || 0;
    return initialIncome + investmentIncome;
  };

  const calculateWithdraw = () => {
    return filteredWithdraw?.reduce((sum, item) => sum + item.amount, 0) || 0;
  };

  const calculateTotalExpenses = () => {
    const expensesTotal =
      filteredExpenses?.reduce((sum, item) => sum + item.amount, 0) || 0;
    const salaryTotal =
      filteredSalary?.reduce((sum, salary) => sum + salary.netSalary, 0) || 0;
    return expensesTotal + salaryTotal;
  };

  const initialIncome = calculateInitialIncome();
  const totalIncome = calculateTotalIncome();
  const totalWithdraw = calculateWithdraw();
  const totalExpenses = calculateTotalExpenses();

  const calculateNetProfit = () => {
    return totalIncome - totalExpenses - totalWithdraw;
  };

  const netProfit = calculateNetProfit();
  const netProfitColor = netProfit >= 0 ? "bg-green-500" : "bg-red-500";

  // Prepare data for the transaction graph
  const prepareGraphData = () => {
    const graphData = months.map((month, index) => {
      const monthIncome =
        income
          ?.filter((item) => {
            const itemDate = new Date(item.date);
            return (
              itemDate.getFullYear() === Number.parseInt(selectedYear) &&
              itemDate.getMonth() === index
            );
          })
          .reduce((sum, item) => sum + item.amount, 0) || 0;

      const monthInvestment =
        investment
          ?.filter((item) => {
            const itemDate = new Date(item.date);
            return (
              itemDate.getFullYear() === Number.parseInt(selectedYear) &&
              itemDate.getMonth() === index
            );
          })
          .reduce((sum, item) => sum + item.amount, 0) || 0;

      const monthExpenses =
        expenses
          ?.filter((item) => {
            const itemDate = new Date(item.date);
            return (
              itemDate.getFullYear() === Number.parseInt(selectedYear) &&
              itemDate.getMonth() === index
            );
          })
          .reduce((sum, item) => sum + item.amount, 0) || 0;

      const monthSalary =
        salaryData
          ?.flatMap((employee) =>
            employee.salaries.filter((salary) => {
              const [year, salaryMonth] = salary.month.split("-");
              return year === selectedYear && Number(salaryMonth) - 1 === index;
            })
          )
          .reduce((sum, salary) => sum + salary.netSalary, 0) || 0;

      return {
        name: month,
        income: monthIncome + monthInvestment,
        expenses: monthExpenses + monthSalary,
      };
    });

    return graphData;
  };

  const graphData = prepareGraphData();

  return (
    <div>
      <Finance />
      <div className="mb-4 flex justify-end space-x-4">
        <Select onValueChange={setSelectedYear} value={selectedYear}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setSelectedMonth} value={selectedMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="grid grid-cols-2 gap-3 2xl:gap-5">
          <PreMonthIncome data={initialIncome} />
          <Investment data={filteredInvestment} />
          <Withdraw data={filteredWithdraw} />
          <Expance data={totalExpenses} salaryData={filteredSalary} />
          <Card
            className={`rounded-2xl p-4 ${netProfitColor} flex items-center justify-center text-center`}
          >
            <CardContent>
              <h3 className="text-xl font-semibold text-white">Net Profit</h3>
              <p className="font-bold text-white mt-2">
                <span className="text-3xl 2xl:text-4xl">
                  ${Math.abs(netProfit).toFixed(2)}
                </span>
                <i className="text-sm">{netProfit < 0 && " Loss"}</i>
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="max-h-[400px]">

        <TransactionGraph data={graphData} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 py-5">
        <IncomeOverview data={filteredIncome} />
        <ExpensesOverview data={filteredExpenses} />
        <InvestmentOverview data={filteredInvestment} />
        <WithdrawOverview data={filteredWithdraw} />
      </div>
    </div>
  );
};

export default Page;
