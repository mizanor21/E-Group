'use client'
import { useState } from 'react';
import { 
  Banknote, 
  CircleDollarSign, 
  CreditCard, 
  LineChart, 
  Building2, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  Loader2
} from 'lucide-react';

export default function FinancialDashboard() {
  // Define tabs
  const tabs = [
    { id: 'assets', label: 'Assets', icon: <Banknote className="w-5 h-5 mr-2" /> },
    { id: 'equity', label: 'Equity', icon: <Building2 className="w-5 h-5 mr-2" /> },
    { id: 'liability', label: 'Liability', icon: <CreditCard className="w-5 h-5 mr-2" /> },
    { id: 'income', label: 'Income', icon: <CircleDollarSign className="w-5 h-5 mr-2" /> },
    { id: 'expenses', label: 'Expenses', icon: <LineChart className="w-5 h-5 mr-2" /> },
  ];

  // State for active tab and loading state
  const [activeTab, setActiveTab] = useState('assets');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data for each tab
  const tabData = {
    assets: [
      { id: '001', code: '1100000', name: 'Non-Current Assets', status: 'active' },
      { id: '002', code: '1100001', name: 'Property Plant & Equipments', status: 'inactive' },
      { id: '003', code: '1100002', name: 'Land & Land Developments', status: 'active' },
      { id: '004', code: '1100003', name: 'Furniture & Fixture', status: 'inactive' },
      { id: '005', code: '1100004', name: 'Electronic Equipment\'s', status: 'active' },
      { id: '006', code: '1100005', name: 'Current Assets', status: 'active' },
      { id: '007', code: '1100006', name: 'Cash & Cash Equivalents', status: 'active' },
    ],
    equity: [
      { id: '101', code: '3100000', name: 'Owner\'s Equity', status: 'active' },
      { id: '102', code: '3100001', name: 'Retained Earnings', status: 'active' },
      { id: '103', code: '3100002', name: 'Common Stock', status: 'inactive' },
    ],
    liability: [
      { id: '201', code: '2100000', name: 'Current Liabilities', status: 'active' },
      { id: '202', code: '2100001', name: 'Accounts Payable', status: 'active' },
      { id: '203', code: '2100002', name: 'Short-term Loans', status: 'inactive' },
      { id: '204', code: '2200000', name: 'Long-term Liabilities', status: 'active' },
      { id: '205', code: '2200001', name: 'Mortgage Payable', status: 'active' },
    ],
    income: [
      { id: '301', code: '4100000', name: 'Operating Revenue', status: 'active' },
      { id: '302', code: '4100001', name: 'Sales Revenue', status: 'active' },
      { id: '303', code: '4100002', name: 'Service Revenue', status: 'active' },
      { id: '304', code: '4200000', name: 'Non-Operating Revenue', status: 'inactive' },
      { id: '305', code: '4200001', name: 'Interest Income', status: 'active' },
    ],
    expenses: [
      { id: '401', code: '5100000', name: 'Operating Expenses', status: 'active' },
      { id: '402', code: '5100001', name: 'Salary Expense', status: 'active' },
      { id: '403', code: '5100002', name: 'Rent Expense', status: 'active' },
      { id: '404', code: '5100003', name: 'Utilities Expense', status: 'inactive' },
      { id: '405', code: '5200000', name: 'Non-Operating Expenses', status: 'active' },
      { id: '406', code: '5200001', name: 'Interest Expense', status: 'active' },
    ],
  };

  // Handle tab switching with simulated loading
  const handleTabChange = (tabId) => {
    setIsLoading(true);
    setActiveTab(tabId);
    
    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Filter data based on search term
  const filteredData = tabData[activeTab]?.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.includes(searchTerm)
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Chart of Accounts</h1>
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6 overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
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
            <button className="flex items-center whitespace-nowrap py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              List View
            </button>
          </nav>
        </div>
        
        {/* Content Header */}
        <div className="bg-white rounded-t-lg shadow mt-6 p-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="bg-gray-100 p-2 rounded-lg mr-3">
              {activeTab === 'assets' && <Banknote className="w-6 h-6 text-green-500" />}
              {activeTab === 'equity' && <Building2 className="w-6 h-6 text-green-500" />}
              {activeTab === 'liability' && <CreditCard className="w-6 h-6 text-green-500" />}
              {activeTab === 'income' && <CircleDollarSign className="w-6 h-6 text-green-500" />}
              {activeTab === 'expenses' && <LineChart className="w-6 h-6 text-green-500" />}
            </div>
            <div>
              <h2 className="text-xl font-bold capitalize">{activeTab}</h2>
              <p className="text-sm text-gray-500">Accounts / {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</p>
            </div>
          </div>
          <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Go Back
          </button>
        </div>
        
        {/* Search and Action Bar */}
        <div className="bg-gray-100 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative flex items-center w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3" />
            <button className="ml-2 bg-green-500 text-white px-4 py-2 rounded-lg">
              GO
            </button>
            <button className="ml-2 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center">
              Action <span className="ml-1">▼</span>
            </button>
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button className="bg-blue-900 text-white px-4 py-2 rounded-lg whitespace-nowrap">
              Group Ledger Create
            </button>
            <button className="bg-blue-900 text-white px-4 py-2 rounded-lg whitespace-nowrap">
              Ledger Create
            </button>
          </div>
        </div>
        
        {/* Table */}
        <div className="bg-white rounded-b-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SL No.
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Name
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex justify-center">
                      <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                    </div>
                    <p className="mt-2 text-gray-500">Loading {activeTab} data...</p>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-gray-500">
                    No {activeTab} data found
                    {searchTerm && <p className="mt-2">Try a different search term</p>}
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        <button className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200">
                          <Plus className="w-5 h-5" />
                        </button>
                        <button className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {item.status === 'active' ? (
                        <span className="inline-flex items-center justify-center p-1 rounded-full bg-green-100">
                          <Check className="w-5 h-5 text-green-600" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center p-1 rounded-full bg-red-100">
                          <X className="w-5 h-5 text-red-600" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination - Optional Enhancement */}
        {!isLoading && filteredData.length > 0 && (
          <div className="flex items-center justify-between bg-white px-4 py-3 mt-4 border-t border-gray-200 sm:px-6 rounded-lg shadow">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredData.length}</span> of{' '}
                  <span className="font-medium">{filteredData.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Previous</span>
                    &larr;
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Next</span>
                    &rarr;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}