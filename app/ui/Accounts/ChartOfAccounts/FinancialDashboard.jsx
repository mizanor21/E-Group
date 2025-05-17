'use client'
import { useState } from 'react';
import {
  Banknote, CircleDollarSign, CreditCard, LineChart, Building2,
  ArrowLeft
} from 'lucide-react';
import { useChartOfAccountsData } from '@/app/data/DataFetch';
import AccountTabs from './AccountTabs';

export default function FinancialDashboard() {
  const { data, mutate } = useChartOfAccountsData([]);
  const [activeTab, setActiveTab] = useState('assets');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center mb-6">
          <button className="mr-4 p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Chart of Accounts</h1>
        </div>

        <AccountTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          data={data}
          mutate={mutate}
        />
      </div>
    </div>
  );
}