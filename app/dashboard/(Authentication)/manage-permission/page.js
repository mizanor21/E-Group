'use client';
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, User, Settings, DollarSign, Briefcase, Edit, Save, ChevronDown, ChevronUp, Loader } from 'lucide-react';
import { useUsersData } from '@/app/data/DataFetch';

export default function UserPermissionsManager() {
  const { data: initialUsers = [], mutate } = useUsersData([]);
  const [expandedUsers, setExpandedUsers] = useState({});
  const [editingUser, setEditingUser] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });
  const [users, setUsers] = useState(initialUsers);

  // Sync local state with fetched data
  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const toggleExpand = (userId) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const startEditing = (userId) => {
    setEditingUser(userId);
    setUpdateMessage({ type: '', text: '' });
  };

  const cancelEditing = () => {
    // Reset to original data
    setUsers(initialUsers);
    setEditingUser(null);
    setUpdateMessage({ type: '', text: '' });
  };

  const saveChanges = async (user) => {
    setIsUpdating(true);
    setUpdateMessage({ type: '', text: '' });
    
    try {
      const response = await fetch(`/api/user/${user._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          permissions: user.permissions
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update permissions');
      }

      const result = await response.json();
      
      // Update the cache and local state
      await mutate();
      setUpdateMessage({ type: 'success', text: 'Permissions updated successfully!' });
      setEditingUser(null);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setUpdateMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      console.error('Error updating permissions:', error);
      setUpdateMessage({ 
        type: 'error', 
        text: error.message || 'An error occurred while updating permissions'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const togglePermission = (userId, module, action) => {
    setUsers(prevUsers => 
      prevUsers.map(user => {
        if (user._id === userId) {
          const newValue = !user.permissions[module][action];
          return {
            ...user,
            permissions: {
              ...user.permissions,
              [module]: {
                ...user.permissions[module],
                [action]: newValue
              }
            }
          };
        }
        return user;
      })
    );
  };

  const getModuleIcon = (module) => {
    switch (module) {
      case 'employee': return <Briefcase className="w-5 h-5" />;
      case 'payroll': return <DollarSign className="w-5 h-5" />;
      case 'accounts': return <User className="w-5 h-5" />;
      case 'settings': return <Settings className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!users || users.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <Loader className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="mt-4 text-gray-600">Loading users data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">User Permissions Management</h1>
      
      <div className="space-y-4">
        {users.map(user => (
          <div key={user._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleExpand(user._id)}
            >
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{user.fullName}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Added: {formatDate(user.createdAt)}
                </span>
                {expandedUsers[user._id] ? 
                  <ChevronUp className="w-5 h-5 text-gray-500" /> : 
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                }
              </div>
            </div>
            
            {expandedUsers[user._id] && (
              <div className="p-4 border-t border-gray-100">
                <div className="flex justify-between mb-4">
                  <h4 className="font-medium text-gray-700">Permissions</h4>
                  {editingUser === user._id ? (
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => saveChanges(user)}
                        disabled={isUpdating}
                        className="flex items-center text-sm text-green-600 hover:text-green-800 disabled:opacity-50"
                      >
                        {isUpdating ? (
                          <>
                            <Loader className="w-4 h-4 mr-1 animate-spin" /> Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-1" /> Save Changes
                          </>
                        )}
                      </button>
                      <button 
                        onClick={cancelEditing}
                        disabled={isUpdating}
                        className="flex items-center text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => startEditing(user._id)}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="w-4 h-4 mr-1" /> Edit Permissions
                    </button>
                  )}
                </div>
                
                {updateMessage.text && (
                  <div className={`mb-4 p-2 rounded text-sm ${
                    updateMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {updateMessage.text}
                  </div>
                )}
                
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                        <th className="py-2 px-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Create</th>
                        <th className="py-2 px-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">View</th>
                        <th className="py-2 px-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Edit</th>
                        <th className="py-2 px-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(user.permissions).map(([module, actions]) => (
                        <tr key={module}>
                          <td className="py-3 px-3">
                            <div className="flex items-center">
                              <div className="mr-2">
                                {getModuleIcon(module)}
                              </div>
                              <span className="capitalize">{module}</span>
                            </div>
                          </td>
                          {['create', 'view', 'edit', 'delete'].map(action => (
                            <td key={`${module}-${action}`} className="py-3 px-3 text-center">
                              {editingUser === user._id ? (
                                <button 
                                  onClick={() => togglePermission(user._id, module, action)}
                                  className={`rounded-full p-1 transition-colors ${
                                    actions[action] ? 'bg-green-100 text-green-600 hover:bg-green-200' : 
                                    'bg-red-100 text-red-600 hover:bg-red-200'
                                  }`}
                                  disabled={isUpdating}
                                >
                                  {actions[action] ? 
                                    <CheckCircle className="w-5 h-5" /> : 
                                    <XCircle className="w-5 h-5" />
                                  }
                                </button>
                              ) : (
                                <span className={actions[action] ? 'text-green-600' : 'text-red-600'}>
                                  {actions[action] ? 
                                    <CheckCircle className="w-5 h-5 mx-auto" /> : 
                                    <XCircle className="w-5 h-5 mx-auto" />
                                  }
                                </span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}