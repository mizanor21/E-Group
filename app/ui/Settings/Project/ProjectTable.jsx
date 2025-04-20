'use client'
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Building, Briefcase, FolderOpen, Plus, Search, Filter, Trash2, Pencil, X, Check } from 'lucide-react';
import useSWR, { mutate } from 'swr';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function CompanyGroupsViewer() {
  const { data, error, isLoading } = useSWR('/api/projects', fetcher);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [expandedCompanies, setExpandedCompanies] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Expand first group by default when data loads
  useEffect(() => {
    if (data?.length > 0 && Object.keys(expandedGroups).length === 0) {
      setExpandedGroups({ [data[0]._id]: true });
    }
  }, [data]);

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
      ...(type === 'company' && { companyName: '', companyShortName: '' }),
      ...(type === 'project' && { projectName: '' }),
      ...(type === 'group' && { groupName: '' })
    });
    setEditingItem(null);
  };

  const startEditing = (type, item, groupId, companyId = null) => {
    setEditingItem({
      type,
      ...item,
      groupId,
      companyId
    });
    setNewItem(null);
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

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    
    try {
      let endpoint = '/api/projects';
      let method = 'POST';
      let body = {};
  
      if (editingItem) {
        method = 'PATCH';
        body = {
          type: editingItem.type,
          groupId: editingItem.groupId,
          ...(editingItem.type === 'company' && { companyId: editingItem._id }),
          ...(editingItem.type === 'project' && { 
            companyId: editingItem.companyId,
            projectId: editingItem._id
          }),
          ...(editingItem.type === 'group' && { groupName: editingItem.groupName }),
          ...(editingItem.type === 'company' && { 
            companyName: editingItem.companyName,
            companyShortName: editingItem.companyShortName
          }),
          ...(editingItem.type === 'project' && { projectName: editingItem.projectName })
        };
      } else if (newItem) {
        body = {
          type: newItem.type,
          groupId: newItem.groupId,
          ...(newItem.type === 'project' && { companyId: newItem.parentId }),
          ...(newItem.type === 'group' && { groupName: newItem.groupName }),
          ...(newItem.type === 'company' && { 
            companyName: newItem.companyName,
            companyShortName: newItem.companyShortName
          }),
          ...(newItem.type === 'project' && { projectName: newItem.projectName })
        };
      }
  
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        throw new Error(await response.text());
      }
  
      mutate('/api/projects');
      cancelEditing();
      toast.success(`${editingItem ? 'Updated' : 'Added'} successfully`);
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error(`Error: ${error.message || 'Failed to save data'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (type, id, groupId = null, companyId = null) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    try {
      const response = await fetch('/api/projects', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          ...(type !== 'group' && { groupId }),
          ...(type === 'project' && { companyId }),
          ...(type === 'group' && { groupId: id }),
          ...(type === 'company' && { companyId: id }),
          ...(type === 'project' && { projectId: id })
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      mutate('/api/projects');
      toast.success('Deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error(`Error: ${error.message || 'Failed to delete'}`);
    }
  };

  if (isLoading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">Error loading data</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-slate-50 rounded-xl shadow-sm">
      {/* Header and Search */}
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
          
          <button 
            onClick={() => startAdding('group', null, null)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition whitespace-nowrap"
          >
            <Plus size={18} />
            Add Group
          </button>
        </div>
      </div>
      
      {/* Add Group Form (when newItem.type === 'group') */}
      {newItem?.type === 'group' && (
        <div className="border border-blue-200 rounded-lg bg-blue-50 p-4 mb-6">
          <h4 className="text-sm font-medium text-blue-800 mb-3">Add New Group</h4>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-blue-700 mb-1">Group Name</label>
              <input
                type="text"
                value={newItem.groupName}
                onChange={(e) => handleInputChange('groupName', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-blue-300 focus:ring-2 focus:ring-blue-200 outline-none"
                placeholder="Enter group name"
                autoFocus
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelEditing}
                className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newItem.groupName.trim() || isSubmitting}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isSubmitting ? 'Saving...' : 'Add Group'}
              </button>
            </div>
          </form>
        </div>
      )}

      {filteredData?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">No company groups found</p>
          <button 
            onClick={() => startAdding('group', null, null)}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium inline-block"
          >
            Create your first group
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredData?.map((group) => (
            <div key={group._id} className="border border-slate-200 rounded-xl bg-white shadow-xs hover:shadow-sm transition overflow-hidden">
              {/* Group Header */}
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
                      <form onSubmit={handleSubmit} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingItem.groupName}
                          onChange={(e) => handleInputChange('groupName', e.target.value)}
                          className="font-bold text-slate-800 border border-blue-300 rounded px-2 py-1"
                          autoFocus
                          required
                        />
                        <button 
                          type="submit"
                          className="text-green-600 hover:text-green-800 p-1"
                          title="Save"
                          disabled={isSubmitting}
                        >
                          <Check size={18} />
                        </button>
                        <button 
                          type="button"
                          onClick={cancelEditing}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Cancel"
                          disabled={isSubmitting}
                        >
                          <X size={18} />
                        </button>
                      </form>
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
                  {!(editingItem?.type === 'group' && editingItem._id === group._id) && (
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
              
              {/* Group Content */}
              {expandedGroups[group._id] && (
                <div className="p-4 pt-0 space-y-3">
                  {/* Add Company Form */}
                  {newItem?.type === 'company' && newItem.groupId === group._id && (
                    <div className="border border-blue-200 rounded-lg bg-blue-50 p-3 mb-3">
                      <h4 className="text-sm font-medium text-blue-800 mb-2">Add New Company</h4>
                      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-xs font-medium text-blue-700 mb-1">Company Name</label>
                          <input
                            type="text"
                            value={newItem.companyName}
                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded border border-blue-300 focus:ring-2 focus:ring-blue-200 outline-none"
                            placeholder="Enter company name"
                            autoFocus
                            required
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
                            required
                          />
                        </div>
                        <div className="col-span-2 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="px-3 py-1 text-sm text-slate-600 hover:text-slate-800"
                            disabled={isSubmitting}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={!newItem.companyName.trim() || !newItem.companyShortName.trim() || isSubmitting}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                          >
                            {isSubmitting ? 'Saving...' : 'Add Company'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {group.companies.length > 0 ? (
                    group.companies.map((company) => (
                      <div key={company._id} className="border border-slate-100 rounded-lg overflow-hidden hover:border-slate-200 transition">
                        {/* Company Header */}
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
                                <form onSubmit={handleSubmit} className="space-y-2">
                                  <input
                                    type="text"
                                    value={editingItem.companyName}
                                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                                    className="font-semibold text-slate-800 border border-blue-300 rounded px-2 py-1 text-sm w-full"
                                    autoFocus
                                    required
                                  />
                                  <input
                                    type="text"
                                    value={editingItem.companyShortName}
                                    onChange={(e) => handleInputChange('companyShortName', e.target.value)}
                                    className="text-slate-500 border border-blue-300 rounded px-2 py-1 text-xs w-full"
                                    required
                                  />
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      type="submit"
                                      className="text-green-600 hover:text-green-800 p-1"
                                      title="Save"
                                      disabled={isSubmitting}
                                    >
                                      <Check size={16} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={cancelEditing}
                                      className="text-red-600 hover:text-red-800 p-1"
                                      title="Cancel"
                                      disabled={isSubmitting}
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>
                                </form>
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
                            {!(editingItem?.type === 'company' && editingItem._id === company._id) && (
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
                        
                        {/* Company Projects */}
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
                                <form onSubmit={handleSubmit} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={newItem.projectName}
                                    onChange={(e) => handleInputChange('projectName', e.target.value)}
                                    className="flex-1 px-3 py-2 text-sm rounded border border-blue-300 focus:ring-2 focus:ring-blue-200 outline-none"
                                    placeholder="Enter project name"
                                    autoFocus
                                    required
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={cancelEditing}
                                      className="px-3 py-1 text-sm text-slate-600 hover:text-slate-800"
                                      disabled={isSubmitting}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="submit"
                                      disabled={!newItem.projectName.trim() || isSubmitting}
                                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                                    >
                                      {isSubmitting ? 'Adding...' : 'Add'}
                                    </button>
                                  </div>
                                </form>
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
                                          <form onSubmit={handleSubmit} className="flex items-center gap-2">
                                            <input
                                              type="text"
                                              value={editingItem.projectName}
                                              onChange={(e) => handleInputChange('projectName', e.target.value)}
                                              className="text-slate-700 border border-blue-300 rounded px-2 py-1 text-sm w-full"
                                              autoFocus
                                              required
                                            />
                                            <button
                                              type="submit"
                                              className="text-green-600 hover:text-green-800 p-1"
                                              title="Save"
                                              disabled={isSubmitting}
                                            >
                                              <Check size={14} />
                                            </button>
                                            <button
                                              type="button"
                                              onClick={cancelEditing}
                                              className="text-red-600 hover:text-red-800 p-1"
                                              title="Cancel"
                                              disabled={isSubmitting}
                                            >
                                              <X size={14} />
                                            </button>
                                          </form>
                                        ) : (
                                          <>
                                            <span className="text-slate-700 truncate">{project.projectName}</span>
                                            <span className="block text-xs text-slate-400 truncate">ID: {project._id}</span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                    {!(editingItem?.type === 'project' && editingItem._id === project._id) && (
                                      <div className="flex gap-1">
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            startEditing('project', { 
                                              _id: project._id, 
                                              projectName: project.projectName,
                                              companyId: company._id
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
                                      </div>
                                    )}
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