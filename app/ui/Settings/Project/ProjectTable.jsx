import { useState } from 'react';
import { ChevronDown, ChevronRight, Building, Briefcase, FolderOpen, Plus, Search, Filter } from 'lucide-react';
import { useProjectData } from '@/app/data/DataFetch';
import Link from 'next/link';

export default function CompanyGroupsViewer() {
  const [expandedGroups, setExpandedGroups] = useState({});
  const [expandedCompanies, setExpandedCompanies] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const { data } = useProjectData([]);
  
  // Filter and search logic
  const filteredData = data?.filter(group => {
    const matchesSearch = group.groupName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      group.companies.some(c => c.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const hasCompanies = group.companies.length > 0;
    
    return matchesSearch && 
      (activeFilter === 'all' || 
       (activeFilter === 'withCompanies' && hasCompanies) ||
       (activeFilter === 'withoutCompanies' && !hasCompanies));
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
  
  return (
    <div className="max-w-5xl mx-auto p-6 bg-slate-50 rounded-xl shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Company Groups</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search groups or companies..."
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
              <option value="all">All Groups</option>
              <option value="withCompanies">With Companies</option>
              <option value="withoutCompanies">Without Companies</option>
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
          <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium">
            Create your first group
          </button>
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
                    <h2 className="font-bold text-slate-800">{group.groupName}</h2>
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
                <div className="flex items-center gap-4">
                  <button className="text-slate-400 hover:text-blue-600 p-1">
                    <Plus size={16} />
                  </button>
                  <div className="text-slate-500">
                    {expandedGroups[group._id] ? 
                      <ChevronDown size={20} /> : 
                      <ChevronRight size={20} />
                    }
                  </div>
                </div>
              </div>
              
              {expandedGroups[group._id] && (
                <div className="p-4 pt-0 space-y-3">
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
                              <h3 className="font-semibold text-slate-800">{company.companyName}</h3>
                              <div className="flex gap-2 mt-1">
                                <span className="text-xs text-slate-500">
                                  {company.companyShortName}
                                </span>
                                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                  {company.projects.length} {company.projects.length === 1 ? 'project' : 'projects'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button className="text-slate-400 hover:text-blue-600 p-1">
                              <Plus size={16} />
                            </button>
                            <div className="text-slate-500">
                              {expandedCompanies[company._id] ? 
                                <ChevronDown size={18} /> : 
                                <ChevronRight size={18} />
                              }
                            </div>
                          </div>
                        </div>
                        
                        {expandedCompanies[company._id] && (
                          <div className="bg-slate-50 p-3 border-t border-slate-100">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-sm font-medium text-slate-600">Projects</h4>
                              <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                <Plus size={14} /> Add Project
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                              {company.projects.map((project) => (
                                <div 
                                  key={project._id}
                                  className="flex items-center gap-2 p-2 bg-white rounded border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition"
                                >
                                  <Briefcase size={16} className="text-blue-500 flex-shrink-0" />
                                  <div className="truncate">
                                    <span className="text-slate-700 truncate">{project.projectName}</span>
                                    <span className="block text-xs text-slate-400 truncate">ID: {project._id}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                      <p className="text-slate-500 mb-3">No companies in this group</p>
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-1 mx-auto">
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