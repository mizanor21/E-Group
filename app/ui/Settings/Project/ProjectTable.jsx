'use client'
import { useState } from 'react';
import { ChevronDown, ChevronRight, Building, Briefcase, FolderOpen, Plus, Search, Filter, Trash2, Pencil, X, Check } from 'lucide-react';
import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function CompanyGroupsViewer() {
  const { data, mutate } = useSWR('/api/projects', fetcher);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [expandedCompanies, setExpandedCompanies] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState(null);

  const filteredData = data?.filter(group => {
    const matchesSearch = group.groupName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      group.companies.some(c => 
        c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.projects.some(p => p.projectName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    
    const hasCompanies = group.companies.length > 0;
    const hasProjects = group.companies.some(c => c.projects.length > 0);
    
    return matchesSearch && 
      (activeFilter === 'all' || 
       (activeFilter === 'withCompanies' && hasCompanies) ||
       (activeFilter === 'withoutCompanies' && !hasCompanies) ||
       (activeFilter === 'withProjects' && hasProjects) ||
       (activeFilter === 'withoutProjects' && !hasProjects));
  });

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };
  
  const toggleCompany = (companyId) => {
    setExpandedCompanies(prev => ({
      ...prev,
      [companyId]: !prev[companyId]
    }));
  };

  const startAdding = (type, parentId, groupId) => {
    setNewItem({
      type,
      parentId,
      groupId,
      companyName: '',
      companyShortName: '',
      projectName: ''
    });
  };

  const startEditing = (type, item, groupId) => {
    setEditingItem({
      type,
      ...item,
      groupId
    });
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setNewItem(null);
  };

  const handleInputChange = (field, value) => {
    if (editingItem) {
      setEditingItem(prev => ({ ...prev, [field]: value }));
    } else if (newItem) {
      setNewItem(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      let endpoint = '/api/projects';
      let method = 'POST';
      let body = {};
  
      if (editingItem) {
        // Editing existing item
        if (editingItem.type === 'group') {
          body = { 
            type: 'group',
            groupId: editingItem._id, 
            groupName: editingItem.groupName 
          };
        } else if (editingItem.type === 'company') {
          body = { 
            type: 'company',
            groupId: editingItem.groupId, 
            companyId: editingItem._id,
            companyName: editingItem.companyName,
            companyShortName: editingItem.companyShortName
          };
        } else if (editingItem.type === 'project') {
          body = {
            type: 'project',
            companyId: editingItem.parentId,
            projectId: editingItem._id,
            projectName: editingItem.projectName
          };
        }
        method = 'PATCH';
      } else if (newItem) {
        // Adding new item
        if (newItem.type === 'company') {
          body = {
            type: 'company',
            groupId: newItem.groupId,
            companyName: newItem.companyName,
            companyShortName: newItem.companyShortName
          };
        } else if (newItem.type === 'project') {
          body = {
            type: 'project',
            companyId: newItem.parentId,
            projectName: newItem.projectName
          };
        }
      }
  
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      if (response.ok) {
        mutate();
        cancelEditing();
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to save data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (type, id, groupId, companyId) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      const response = await fetch('/api/projects', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          id,
          groupId,
          companyId
        }),
      });

      if (response.ok) {
        mutate();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-slate-50 rounded-xl shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Company Groups</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search groups, companies or projects..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-300 p-1">
            <Filter className="text-slate-500 ml-2" size={16} />
            <select 
              className="py-1 pr-8 pl-2 text-sm rounded-md border-none focus:ring-2 focus:ring-blue-200 outline-none"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="withCompanies">With Companies</option>
              <option value="withoutCompanies">Without Companies</option>
              <option value="withProjects">With Projects</option>
              <option value="withoutProjects">Without Projects</option>
            </select>
          </div>
          
          <Link href={'/dashboard/group'} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition whitespace-nowrap">
            <Plus size={18} />
            Add Group
          </Link>
        </div>
      </div>
      
      {filteredData?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">No company groups found</p>
          <Link href={'/dashboard/group'} className="mt-4 text-blue-600 hover:text-blue-800 font-medium inline-block">
            Create your first group
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredData?.map((group) => (
            <div key={group._id} className="border border-slate-200 rounded-xl bg-white shadow-xs hover:shadow-sm transition overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition"
                onClick={() => toggleGroup(group._id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${expandedGroups[group._id] ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                    <FolderOpen size={20} />
                  </div>
                  <div>
                    {editingItem?.type === 'group' && editingItem._id === group._id ? (
                      <input
                        type="text"
                        value={editingItem.groupName}
                        onChange={(e) => handleInputChange('groupName', e.target.value)}
                        className="font-bold text-slate-800 border border-blue-300 rounded px-2 py-1"
                        autoFocus
                      />
                    ) : (
                      <h2 className="font-bold text-slate-800">{group.groupName}</h2>
                    )}
                    <div className="flex gap-3 mt-1">
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {group.companies.length} {group.companies.length === 1 ? 'company' : 'companies'}
                      </span>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {group.companies.reduce((acc, c) => acc + c.projects.length, 0)} projects
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {editingItem?.type === 'group' && editingItem._id === group._id ? (
                    <>
                      <button 
                        onClick={handleSubmit}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Save"
                      >
                        <Check size={18} />
                      </button>
                      <button 
                        onClick={cancelEditing}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Cancel"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          startAdding('company', null, group._id);
                        }}
                        className="text-slate-400 hover:text-blue-600 p-1"
                        title="Add Company"
                      >
                        <Plus size={16} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing('group', { _id: group._id, groupName: group.groupName });
                        }}
                        className="text-slate-400 hover:text-yellow-600 p-1"
                        title="Edit Group"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete('group', group._id);
                        }}
                        className="text-slate-400 hover:text-red-600 p-1"
                        title="Delete Group"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="text-slate-500 ml-2">
                        {expandedGroups[group._id] ? 
                          <ChevronDown size={20} /> : 
                          <ChevronRight size={20} />
                        }
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {expandedGroups[group._id] && (
                <div className="p-4 pt-0 space-y-3">
                  {/* Add Company Form */}
                  {newItem?.type === 'company' && newItem.groupId === group._id && (
                    <div className="border border-blue-200 rounded-lg bg-blue-50 p-3 mb-3">
                      <h4 className="text-sm font-medium text-blue-800 mb-2">Add New Company</h4>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-xs font-medium text-blue-700 mb-1">Company Name</label>
                          <input
                            type="text"
                            value={newItem.companyName}
                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded border border-blue-300 focus:ring-2 focus:ring-blue-200 outline-none"
                            placeholder="Enter company name"
                            autoFocus
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-blue-700 mb-1">Short Name</label>
                          <input
                            type="text"
                            value={newItem.companyShortName}
                            onChange={(e) => handleInputChange('companyShortName', e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded border border-blue-300 focus:ring-2 focus:ring-blue-200 outline-none"
                            placeholder="Enter short name"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={cancelEditing}
                          className="px-3 py-1 text-sm text-slate-600 hover:text-slate-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={!newItem.companyName.trim()}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                        >
                          Add Company
                        </button>
                      </div>
                    </div>
                  )}

                  {group.companies.length > 0 ? (
                    group.companies.map((company) => (
                      <div key={company._id} className="border border-slate-100 rounded-lg overflow-hidden hover:border-slate-200 transition">
                        <div 
                          className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50"
                          onClick={() => toggleCompany(company._id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-md ${expandedCompanies[company._id] ? 'bg-blue-50 text-blue-500' : 'bg-slate-50 text-slate-500'}`}>
                              <Building size={18} />
                            </div>
                            <div>
                              {editingItem?.type === 'company' && editingItem._id === company._id ? (
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    value={editingItem.companyName}
                                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                                    className="font-semibold text-slate-800 border border-blue-300 rounded px-2 py-1 text-sm w-full"
                                    autoFocus
                                  />
                                  <input
                                    type="text"
                                    value={editingItem.companyShortName}
                                    onChange={(e) => handleInputChange('companyShortName', e.target.value)}
                                    className="text-slate-500 border border-blue-300 rounded px-2 py-1 text-xs w-full"
                                  />
                                </div>
                              ) : (
                                <>
                                  <h3 className="font-semibold text-slate-800">{company.companyName}</h3>
                                  <div className="flex gap-2 mt-1">
                                    <span className="text-xs text-slate-500">
                                      {company.companyShortName}
                                    </span>
                                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                      {company.projects.length} {company.projects.length === 1 ? 'project' : 'projects'}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {editingItem?.type === 'company' && editingItem._id === company._id ? (
                              <>
                                <button 
                                  onClick={handleSubmit}
                                  className="text-green-600 hover:text-green-800 p-1"
                                  title="Save"
                                >
                                  <Check size={18} />
                                </button>
                                <button 
                                  onClick={cancelEditing}
                                  className="text-red-600 hover:text-red-800 p-1"
                                  title="Cancel"
                                >
                                  <X size={18} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startAdding('project', company._id, group._id);
                                  }}
                                  className="text-slate-400 hover:text-blue-600 p-1"
                                  title="Add Project"
                                >
                                  <Plus size={16} />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startEditing('company', { 
                                      _id: company._id, 
                                      companyName: company.companyName,
                                      companyShortName: company.companyShortName
                                    }, group._id);
                                  }}
                                  className="text-slate-400 hover:text-yellow-600 p-1"
                                  title="Edit Company"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete('company', company._id, group._id);
                                  }}
                                  className="text-slate-400 hover:text-red-600 p-1"
                                  title="Delete Company"
                                >
                                  <Trash2 size={16} />
                                </button>
                                <div className="text-slate-500 ml-2">
                                  {expandedCompanies[company._id] ? 
                                    <ChevronDown size={18} /> : 
                                    <ChevronRight size={18} />
                                  }
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {expandedCompanies[company._id] && (
                          <div className="bg-slate-50 p-3 border-t border-slate-100">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-sm font-medium text-slate-600">Projects</h4>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startAdding('project', company._id, group._id);
                                }}
                                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                <Plus size={14} /> Add Project
                              </button>
                            </div>

                            {/* Add Project Form */}
                            {newItem?.type === 'project' && newItem.parentId === company._id && (
                              <div className="border border-blue-200 rounded bg-blue-50 p-3 mb-3">
                                <h5 className="text-xs font-medium text-blue-800 mb-2">Add New Project</h5>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={newItem.projectName}
                                    onChange={(e) => handleInputChange('projectName', e.target.value)}
                                    className="flex-1 px-3 py-2 text-sm rounded border border-blue-300 focus:ring-2 focus:ring-blue-200 outline-none"
                                    placeholder="Enter project name"
                                    autoFocus
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={cancelEditing}
                                      className="px-3 py-1 text-sm text-slate-600 hover:text-slate-800"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={handleSubmit}
                                      disabled={!newItem.projectName.trim()}
                                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                                    >
                                      Add
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                              {company.projects.length > 0 ? (
                                company.projects.map((project) => (
                                  <div 
                                    key={project._id}
                                    className="flex items-center justify-between gap-2 p-2 bg-white rounded border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition"
                                  >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                      <Briefcase size={16} className="text-blue-500 flex-shrink-0" />
                                      <div className="truncate">
                                        {editingItem?.type === 'project' && editingItem._id === project._id ? (
                                          <input
                                            type="text"
                                            value={editingItem.projectName}
                                            onChange={(e) => handleInputChange('projectName', e.target.value)}
                                            className="text-slate-700 border border-blue-300 rounded px-2 py-1 text-sm w-full"
                                            autoFocus
                                          />
                                        ) : (
                                          <>
                                            <span className="text-slate-700 truncate">{project.projectName}</span>
                                            <span className="block text-xs text-slate-400 truncate">ID: {project._id}</span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex gap-1">
                                      {editingItem?.type === 'project' && editingItem._id === project._id ? (
                                        <>
                                          <button 
                                            onClick={handleSubmit}
                                            className="text-green-600 hover:text-green-800 p-1"
                                            title="Save"
                                          >
                                            <Check size={14} />
                                          </button>
                                          <button 
                                            onClick={cancelEditing}
                                            className="text-red-600 hover:text-red-800 p-1"
                                            title="Cancel"
                                          >
                                            <X size={14} />
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          <button 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              startEditing('project', { 
                                                _id: project._id, 
                                                projectName: project.projectName,
                                                parentId: company._id
                                              }, group._id);
                                            }}
                                            className="text-slate-400 hover:text-yellow-600 p-1"
                                            title="Edit Project"
                                          >
                                            <Pencil size={14} />
                                          </button>
                                          <button 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDelete('project', project._id, group._id, company._id);
                                            }}
                                            className="text-slate-400 hover:text-red-600 p-1"
                                            title="Delete Project"
                                          >
                                            <Trash2 size={14} />
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="col-span-full text-center py-4 text-sm text-slate-500">
                                  No projects in this company
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                      <p className="text-slate-500 mb-3">No companies in this group</p>
                      <button 
                        onClick={() => startAdding('company', null, group._id)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-1 mx-auto"
                      >
                        <Plus size={16} /> Add Company
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}