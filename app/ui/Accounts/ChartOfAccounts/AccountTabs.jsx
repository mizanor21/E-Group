'use client'
import { Banknote, CircleDollarSign, CreditCard, LineChart, Building2 } from 'lucide-react';
import AssetsTab from './AssetsTab';
import EquityTab from './EquityTab';
import LiabilitiesTab from './LiabilitiesTab';
import IncomeTab from './IncomeTab';
import ExpensesTab from './ExpensesTab';

export default function AccountTabs({ activeTab, setActiveTab, data, mutate }) {
  const tabs = [
    { id: 'assets', label: 'Assets', icon: <Banknote className="w-5 h-5 mr-2" /> },
    { id: 'equity', label: 'Equity', icon: <Building2 className="w-5 h-5 mr-2" /> },
    { id: 'liability', label: 'Liability', icon: <CreditCard className="w-5 h-5 mr-2" /> },
    { id: 'income', label: 'Income', icon: <CircleDollarSign className="w-5 h-5 mr-2" /> },
    { id: 'expenses', label: 'Expenses', icon: <LineChart className="w-5 h-5 mr-2" /> },
  ];

  // Filter data based on account type
  const filteredData = {
    assets: data?.filter(item => item?.accountType === 'Assets'),
    equity: data?.filter(item => item?.accountType === 'Equity'),
    liability: data?.filter(item => item?.accountType === 'Liabilities'),
    income: data?.filter(item => item?.accountType === 'Income'),
    expenses: data?.filter(item => item?.accountType === 'Expense'),
  };

  return (
    <>
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'assets' && <AssetsTab data={filteredData?.assets} mutate={mutate} />}
        {activeTab === 'equity' && <EquityTab data={filteredData?.equity} mutate={mutate} />}
        {activeTab === 'liability' && <LiabilitiesTab data={filteredData?.liability} mutate={mutate} />}
        {activeTab === 'income' && <IncomeTab data={filteredData?.income} mutate={mutate} />}
        {activeTab === 'expenses' && <ExpensesTab data={filteredData?.expenses} mutate={mutate} />}
      </div>
    </>
  );
}