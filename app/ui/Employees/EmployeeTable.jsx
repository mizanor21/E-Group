"use client";
import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";

const EmployeeTable = ({ employees }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterEmployeeType, setFilterEmployeeType] = useState("");
  const [filterProject, setFilterProject] = useState("");
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  // Extract unique values for filters
  const filterOptions = useMemo(() => {
    if (!employees?.length) return { roles: [], employeeTypes: [], projects: [] };
    
    const roles = [...new Set(employees.map(emp => emp.role))].filter(Boolean);
    const employeeTypes = [...new Set(employees.map(emp => emp.employeeType))].filter(Boolean);
    const projects = [...new Set(employees.map(emp => emp.project))].filter(Boolean);
    
    return { roles, employeeTypes, projects };
  }, [employees]);

  // Handle active filters display
  useEffect(() => {
    const filters = [];
    if (searchQuery) filters.push({ type: 'search', label: `Search: ${searchQuery}` });
    if (filterRole) filters.push({ type: 'role', label: `Role: ${filterRole}` });
    if (filterEmployeeType) filters.push({ type: 'type', label: `Type: ${filterEmployeeType}` });
    if (filterProject) filters.push({ type: 'project', label: `Project: ${filterProject}` });
    
    setActiveFilters(filters);
    setIsFilterActive(filters.length > 0);
    
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [searchQuery, filterRole, filterEmployeeType, filterProject]);

  // Filtered employees based on all criteria
  const filteredEmployees = useMemo(() => {
    return employees?.filter(
      (employee) =>
        (filterRole === "" || employee.role === filterRole) &&
        (filterEmployeeType === "" || employee.employeeType === filterEmployeeType) &&
        (filterProject === "" || employee.project === filterProject) &&
        Object.values(employee)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    ) || [];
  }, [employees, filterRole, filterEmployeeType, filterProject, searchQuery]);
  
  // Smart pagination
  const totalItems = filteredEmployees.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  
  // Adjust currentPage if it exceeds the new totalPages after filtering
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);
  
  const startRow = (currentPage - 1) * rowsPerPage;
  const displayedEmployees = filteredEmployees.slice(startRow, startRow + rowsPerPage);

  // Determine which page buttons to show
  const getPageButtons = () => {
    const delta = 1; // Number of pages to show on either side of current page
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Calculate range around current page
    const leftBound = Math.max(2, currentPage - delta);
    const rightBound = Math.min(totalPages - 1, currentPage + delta);
    
    // Add ellipsis after first page if needed
    if (leftBound > 2) {
      pages.push('...');
    }
    
    // Add pages around current page
    for (let i = leftBound; i <= rightBound; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (rightBound < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page if it's not the first page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setFilterRole("");
    setFilterEmployeeType("");
    setFilterProject("");
    setCurrentPage(1);
  };

  // Remove a specific filter
  const removeFilter = (filterType) => {
    switch(filterType) {
      case 'search':
        setSearchQuery("");
        break;
      case 'role':
        setFilterRole("");
        break;
      case 'type':
        setFilterEmployeeType("");
        break;
      case 'project':
        setFilterProject("");
        break;
      default:
        break;
    }
  };

  // Get employee type badge color
  const getEmployeeTypeBadgeClass = (type) => {
    switch(type) {
      case 'hourly': 
        return 'bg-green-100 text-green-800';
      case 'daily':
        return 'bg-yellow-100 text-yellow-800';
      case 'monthly': 
        return 'bg-purple-100 text-purple-800';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-lg space-y-5">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">Employee Directory</h2>
          <Link
            href={"/dashboard/add-employee"}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Employee
          </Link>
        </div>
        
        {/* Filter and Search Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative">
            <label htmlFor="search" className="text-sm font-medium text-gray-600 mb-1 block">
              Search Employees
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchQuery}
                placeholder="Name, ID, Phone, etc."
                className="border px-4 py-2 pl-10 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300 w-full transition-all"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="absolute left-3 top-2.5 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.35-4.35M15 11a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </span>
              {searchQuery && (
                <button 
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchQuery('')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Filter Role */}
          <div>
            <label
              htmlFor="filterRole"
              className="text-sm font-medium text-gray-600 mb-1 block"
            >
              Role
            </label>
            <select
              id="filterRole"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="border px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300 w-full transition-all appearance-none bg-white"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23a0aec0%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
            >
              <option value="">All Roles</option>
              {filterOptions.roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* Filter Employee Type */}
          <div>
            <label
              htmlFor="filterEmployeeType"
              className="text-sm font-medium text-gray-600 mb-1 block"
            >
              Employee Type
            </label>
            <select
              id="filterEmployeeType"
              value={filterEmployeeType}
              onChange={(e) => setFilterEmployeeType(e.target.value)}
              className="border px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300 w-full transition-all appearance-none bg-white"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23a0aec0%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
            >
              <option value="">All Types</option>
              {filterOptions.employeeTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Filter Project */}
          <div>
            <label
              htmlFor="filterProject"
              className="text-sm font-medium text-gray-600 mb-1 block"
            >
              Project
            </label>
            <select
              id="filterProject"
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="border px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300 w-full transition-all appearance-none bg-white"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23a0aec0%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
            >
              <option value="">All Projects</option>
              {filterOptions.projects.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
          </div>

          {/* Total Employees Stats Box */}
          <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Employees</p>
              <h2 className="text-2xl font-bold text-gray-800">{employees?.length || 0}</h2>
              {isFilterActive && (
                <p className="text-sm text-blue-600">
                  {filteredEmployees.length} filtered
                </p>
              )}
            </div>
            {isFilterActive && (
              <button
                onClick={resetFilters}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded transition-colors text-sm flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Reset
              </button>
            )}
          </div>
        </div>
        
        {/* Active Filters */}
        {isFilterActive && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {activeFilters.map((filter, index) => (
              <span 
                key={index} 
                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center"
              >
                {filter.label}
                <button 
                  onClick={() => removeFilter(filter.type)}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {/* Table Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-800 mr-3">Employee List</h2>
            {isFilterActive && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Filtered</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to first page when changing rows per page
              }}
              className="border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-left border-collapse bg-white">
            <thead>
              <tr className="bg-gray-50 text-gray-700 text-sm uppercase tracking-wider border-b">
                <th className="py-3 px-4">S/N</th>
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedEmployees.length > 0 ? (
                displayedEmployees.map((employee, index) => (
                  <tr
                    key={employee.employeeID}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-500">{startRow + index + 1}</td>
                    <td className="py-3 px-4 font-mono text-sm">{employee.employeeID}</td>
                    <td className="py-3 px-4 font-medium">
                      {employee.firstName} {employee.lastName}
                    </td>
                    <td className="py-3 px-4">{employee.gender}</td>
                    <td className="py-3 px-4">{employee.phoneNumber}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getEmployeeTypeBadgeClass(employee.employeeType)}`}>
                        {employee.employeeType || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4">{employee.role}</td>
                    <td className="py-3 px-4">{employee.project}</td>
                    <td className="py-3 px-4 text-center">
                      <Link 
                        href={`/dashboard/employees/${employee._id}`} 
                        className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-8 text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-500">No employees found{isFilterActive ? ' matching your filters' : ''}.</p>
                      {isFilterActive && (
                        <button 
                          onClick={resetFilters}
                          className="mt-2 text-blue-500 hover:text-blue-700 text-sm"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Smart Pagination with Info */}
        <div className="mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 mb-4 md:mb-0">
              Showing {totalItems > 0 ? startRow + 1 : 0} to {Math.min(startRow + rowsPerPage, totalItems)} of {totalItems} entries
            </div>
            
            <div className="flex items-center">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-l-lg border ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-blue-600 hover:bg-blue-50"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M7.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L3.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 border-t border-b ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-blue-600 hover:bg-blue-50"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              {getPageButtons().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-3 py-1 border-t border-b bg-white text-gray-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={`page-${page}`}
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    className={`px-3 py-1 border-t border-b ${
                      currentPage === page
                        ? "bg-blue-500 text-white" 
                        : "bg-white text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}
              
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border-t border-b ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-blue-600 hover:bg-blue-50"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-r-lg border ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-blue-600 hover:bg-blue-50"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10 4.293 14.293a1 1 0 000 1.414z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M12.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L16.586 10l-4.293 4.293a1 1 0 000 1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;