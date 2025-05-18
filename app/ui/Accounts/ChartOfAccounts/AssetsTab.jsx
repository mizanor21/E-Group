'use client'
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
    Banknote, Search, Plus, Edit, Trash2, Eye,
    ChevronDown, ChevronRight, X, Loader2, Check,
    Save
} from 'lucide-react';
import { useLoginUserData } from '@/app/data/DataFetch';

// Utility function to build account hierarchy
const buildAccountHierarchy = (accounts) => {
    const accountMap = {};
    accounts?.forEach(account => {
        accountMap[account._id] = { ...account, children: [] };
    });

    const hierarchy = [];
    accounts?.forEach(account => {
        if (account.parentAccount && accountMap[account.parentAccount]) {
            accountMap[account.parentAccount].children.push(accountMap[account._id]);
        } else if (!account.parentAccount) {
            hierarchy.push(accountMap[account._id]);
        }
    });

    return hierarchy;
};

// Component for individual account row
const AccountRow = ({
    account,
    level = 0,
    onToggle,
    expandedItems,
    onEdit,
    onDelete
}) => {
    const hasChildren = account.children && account.children.length > 0;
    const isExpanded = expandedItems.includes(account._id);

    return (
        <>
            <tr key={account._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
                        {hasChildren && (
                            <button
                                onClick={() => onToggle(account._id)}
                                className="mr-2 text-gray-500 hover:text-gray-700"
                            >
                                {isExpanded ? (
                                    <ChevronDown className="w-4 h-4" />
                                ) : (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                            </button>
                        )}
                        {!hasChildren && <div className="w-6"></div>}
                        {account.name}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {account.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.ledgerType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${account.editable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {account.editable ? 'Editable' : 'Read-only'}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                        {account.editable && (
                            <button
                                title="Edit"
                                onClick={() => onEdit(account)}
                                className="p-1.5 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg"
                            >
                                <Edit className="w-5 h-5" />
                            </button>
                        )}
                        {account.deletable && (
                            <button
                                title="Delete"
                                onClick={() => onDelete(account._id)}
                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </td>
            </tr>
            {hasChildren && isExpanded && account.children.map(child => (
                <AccountRow
                    key={child._id}
                    account={child}
                    level={level + 1}
                    onToggle={onToggle}
                    expandedItems={expandedItems}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </>
    );
};

// Main AssetsTab component
export default function AssetsTab({ data, mutate }) {
    // State management
    const [hierarchy, setHierarchy] = useState([]);
    const [expandedItems, setExpandedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editAccount, setEditAccount] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { data: userLoginData } = useLoginUserData([]);

    const filteredData = data?.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.includes(searchTerm)
    );

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            code: '',
            name: '',
            parentAccount: '',
            accountType: 'Assets',
            ledgerType: 'Parent',
            level: 1,
            editable: true,
            deletable: true
        }
    });

    // Build hierarchy when data changes
    useEffect(() => {
        setHierarchy(buildAccountHierarchy(data));
    }, [data]);

    // Set form values when editing
    useEffect(() => {
        if (editAccount) {
            Object.entries(editAccount).forEach(([key, value]) => {
                setValue(key, value);
            });
            setShowCreateModal(true);
        }
    }, [editAccount, setValue]);

    // Toggle expand/collapse
    const toggleExpand = (id) => {
        setExpandedItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    // Filter accounts while preserving hierarchy
    const filterAccounts = (accounts, term) => {
        if (!term) return accounts;

        return accounts.filter(account => {
            const matches = account.name.toLowerCase().includes(term.toLowerCase()) ||
                account.code.includes(term);

            if (matches) return true;

            if (account.children) {
                const matchingChildren = filterAccounts(account.children, term);
                return matchingChildren.length > 0;
            }

            return false;
        });
    };

    const filteredHierarchy = filterAccounts(hierarchy, searchTerm);

    // Form submission handler
    const onSubmit = async (formData) => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const completeData = {
                ...formData,
                createdBy: editAccount
                    ? undefined
                    : {
                        name: userLoginData?.fullName,
                        email: userLoginData?.email
                    },
                editedBy: editAccount ? userLoginData?.email : undefined
            };

            const url = editAccount
                ? `/api/chart-of-accounts/${editAccount._id}`
                : '/api/chart-of-accounts';

            const method = editAccount ? 'patch' : 'post';

            await axios[method](url, completeData);

            setSuccessMessage(
                editAccount
                    ? 'Account updated successfully!'
                    : 'Account created successfully!'
            );

            mutate();
            resetForm();

            setTimeout(() => {
                setSuccessMessage('');
                setShowCreateModal(false);
            }, 2000);
        } catch (error) {
            console.error('Error saving account:', error);
            setErrorMessage(
                error.response?.data?.message ||
                `Failed to ${editAccount ? 'update' : 'create'} account. Please try again.`
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Reset form and state
    const resetForm = () => {
        reset();
        setEditAccount(null);
        setErrorMessage('');
    };

    // Handle delete
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this account?')) {
            try {
                await axios.delete(`/api/chart-of-accounts/?id=${id}`);
                mutate();
                setSuccessMessage('Account deleted successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } catch (error) {
                console.error('Error deleting account:', error);
                setErrorMessage('Failed to delete account. Please try again.');
            }
        }
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Success message banner */}
            {successMessage && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                    <div className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <p className="text-green-700">{successMessage}</p>
                    </div>
                </div>
            )}

            {/* Error message banner */}
            {errorMessage && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <div className="flex items-center">
                        <X className="h-5 w-5 text-red-500 mr-2" />
                        <p className="text-red-700">{errorMessage}</p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white rounded-t-lg shadow p-4 flex flex-col sm:flex-row justify-between items-center">
                <div className="flex items-center mb-4 sm:mb-0">
                    <div className="bg-gray-100 p-2 rounded-lg mr-3">
                        <Banknote className="w-6 h-6 text-green-500" />
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
                        Create Account
                    </button>
                </div>
            </div>

            {/* Search and Filter */}
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
            </div>

            {/* Accounts Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Code
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
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
                        {filteredHierarchy.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-16 text-center text-gray-500">
                                    {searchTerm ? 'No matching accounts found' : 'No accounts available'}
                                </td>
                            </tr>
                        ) : (
                            filteredHierarchy.map(account => (
                                <AccountRow
                                    key={account._id}
                                    account={account}
                                    onToggle={toggleExpand}
                                    expandedItems={expandedItems}
                                    onEdit={setEditAccount}
                                    onDelete={handleDelete}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create/Edit Account Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {editAccount ? 'Edit Account' : 'Create New Account'}
                                </h2>
                                <button
                                    onClick={() => {
                                        resetForm();
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
                                        {/* Account Type (readonly) */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Account Type
                                            </label>
                                            <input
                                                type="text"
                                                value="Assets"
                                                readOnly
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                                            />
                                        </div>

                                        {/* Parent Account */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Parent Account
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

                                        {/* Name */}
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

                                        {/* Code */}
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

                                        {/* Ledger Type */}
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

                                        {/* Level */}
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

                                        {/* Editable */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Editable
                                            </label>
                                            <div className="relative">
                                                <select
                                                    {...register('editable')}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none"
                                                >
                                                    <option value={true}>Yes</option>
                                                    <option value={false}>No</option>
                                                </select>
                                                <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                                            </div>
                                        </div>

                                        {/* Deletable */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Deletable
                                            </label>
                                            <div className="relative">
                                                <select
                                                    {...register('deletable')}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none"
                                                >
                                                    <option value={true}>Yes</option>
                                                    <option value={false}>No</option>
                                                </select>
                                                <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                resetForm();
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
                                                    {editAccount ? 'Updating...' : 'Creating...'}
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    {editAccount ? 'Update Account' : 'Create Account'}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}