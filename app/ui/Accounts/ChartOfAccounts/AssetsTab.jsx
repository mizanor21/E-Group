'use client'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Banknote, Search, Plus, Edit, Trash2, Eye, X, Loader2, ChevronDown, Building2, Check } from 'lucide-react';
import axios from 'axios';

export default function AssetsTab({ data, mutate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      code: '',
      name: '',
      parentAccount: '',
      accountType: 'Assets', // Default to Assets for this tab
      ledgerType: 'Parent',
      level: 1,
      editable: true,
      deletable: true,
    }
  });

  const filteredData = data?.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.includes(searchTerm)
  );

  const onSubmit = async (formData) => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Add createdBy and editedBy data
      const completeData = {
        ...formData,
        createdBy: {
          name: "Current User", // You would get this from your auth context
          email: "user@example.com"
        },
        editedBy: "user@example.com"
      };

      const response = await axios.post('/api/chart-of-accounts', completeData);
      
      setSuccessMessage('Group ledger created successfully!');
      reset();
      setTimeout(() => {
          setSuccessMessage('');
          setShowCreateModal(false);
          mutate(); // Refresh the data
      }, 2000);
    } catch (error) {
      console.error('Error creating ledger:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to create ledger. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Create Group Ledger Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Create Assets Ledger</h2>
                <button 
                  onClick={() => {
                    reset();
                    setShowCreateModal(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {successMessage ? (
                <div className="p-4 mb-6 bg-green-50 text-green-700 rounded-lg flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  {successMessage}
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Type
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value="Assets"
                          readOnly
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parent Account (Optional)
                      </label>
                      <div className="relative">
                        <select
                          {...register('parentAccount')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none"
                        >
                          <option value="">Select Parent Account</option>
                          {filteredData
                            .filter(item => item.ledgerType === 'Parent')
                            .map(item => (
                              <option key={item._id} value={item._id}>{item.name} ({item.code})</option>
                            ))
                          }
                        </select>
                        <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                        className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                        placeholder="e.g. Current Assets"
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('code', { 
                          required: 'Code is required',
                          pattern: {
                            value: /^[0-9]+$/,
                            message: 'Code should contain only numbers'
                          }
                        })}
                        className={`w-full px-4 py-2 border ${errors.code ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                        placeholder="e.g. 1100"
                      />
                      {errors.code && <p className="mt-1 text-sm text-red-500">{errors.code.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ledger Type
                      </label>
                      <div className="relative">
                        <select
                          {...register('ledgerType')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none"
                        >
                          <option value="Parent">Parent</option>
                          <option value="Child">Child</option>
                        </select>
                        <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Level
                      </label>
                      <input
                        type="number"
                        {...register('level', { 
                          min: { value: 1, message: 'Level must be at least 1' },
                          max: { value: 10, message: 'Level cannot be more than 10' }
                        })}
                        className={`w-full px-4 py-2 border ${errors.level ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                        placeholder="e.g. 1"
                        min="1"
                        max="10"
                      />
                      {errors.level && <p className="mt-1 text-sm text-red-500">{errors.level.message}</p>}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        reset();
                        setShowCreateModal(false);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Save
                        </>
                      )}
                    </button>
                  </div>
                  
                  {errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                      {errorMessage}
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rest of your AssetsTab component remains the same */}
      <div className="bg-white rounded-t-lg shadow p-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="bg-gray-100 p-2 rounded-lg mr-3">
            <Building2 className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Assets</h2>
            <p className="text-sm text-gray-500">Accounts / Assets</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-900 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ledger Create
          </button>
          {/* ... rest of your buttons ... */}
        </div>
      </div>
      {/* Search and Filter Bar */}
      <div className="bg-gray-100 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative flex items-center w-full">
          <Search className="w-5 h-5 text-gray-400 absolute left-3" />
          <input
            type="text"
            placeholder="Search by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative">
            <select className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg bg-white text-sm">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-b-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SL No.
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
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
                    <p className="mt-2 text-gray-500">Loading assets data...</p>
                  </td>
                </tr>
              ) : filteredData?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-gray-500">
                    No assets accounts found
                    {searchTerm && <p className="mt-2">Try adjusting your search query</p>}
                  </td>
                </tr>
              ) : (
                filteredData?.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {item.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          title="View"
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {item.editable && (
                          <button 
                            title="Edit"
                            className="p-1.5 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                        )}
                        {item.deletable && (
                          <button 
                            title="Delete"
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}