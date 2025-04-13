'use client';
import { useEmployeeRequiredFieldData } from '@/app/data/DataFetch';
import { useState } from 'react';

export default function EmployeeDataManager() {
    const {data} = useEmployeeRequiredFieldData([]);
  const [employeeData, setEmployeeData] = useState({
    firstName: false,
    lastName: false,
    eEmail: false,
    phoneNumber: false,
    employeeID: false,
    gender: false,
    nationality: false,
    bloodGroup: false,
    religion: false,
    presentAddress1: false,
    presentAddress2: false,
    presentCity: false,
    presentDivision: false,
    presentPostOrZipCode: false,
    permanentAddress1: false,
    permanentAddress2: false,
    permanentCity: false,
    permanentDivision: false,
    permanentPostOrZipCode: false,
    isSameAddress: false,
    department: false,
    actualJob: false,
    currentJob: false,
    project: false,
    employeeType: false,
    experience: false,
    qualification: false,
    role: false,
    basicPay: false,
    hourlyRate: false,
    dailyRate: false,
    commission: false,
    accAllowance: false,
    foodAllowance: false,
    telephoneAllowance: false,
    transportAllowance: false,
    overTimeHours: false,
    holidayOT: false,
    annualLeave: false,
    customerName: false,
    customerWorkingHours: false,
    customerRate: false,
    vendorName: false,
    vendorWorkingHours: false,
    vendorRate: false,
    passportProof: false,
    rpIdProof: false,
    visaProof: false,
    hiredFromDocuments: false,
    hiredByDocuments: false,
    passportNumber: false,
    passportWith: false,
    rpIdNumber: false,
    licenseNumber: false,
    medicalCardNumber: false,
    insuranceNumber: false,
    healthCardNumber: false,
    contractNumber: false,
    hiredFrom: false,
    contactFullName: false,
    contactNumber: false,
    hiredBy: false,
    hiredByContactName: false,
    hiredByContactNumber: false,
    sponsor: false,
    sponsorIdNumber: false,
    visaType: false,
    offDay: false,
    remarks: false,
    accommodation: false,
    ticketDuration: false,
  });

  // Toggle a boolean field
  const toggleBooleanField = (field) => {
    setEmployeeData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Handle numeric field changes
  const handleNumericChange = (field, value) => {
    setEmployeeData(prev => ({
      ...prev,
      [field]: Number(value)
    }));
  };

  // Handle text field changes
  const handleTextChange = (field, value) => {
    setEmployeeData(prev => ({
      ...prev,
      [field]: value === 'true' ? true : value === 'false' ? false : value
    }));
  };

  // Group fields by category
  const fieldCategories = {
    "Personal Information": [
      "firstName", "lastName", "eEmail", "phoneNumber", "employeeID", 
      "gender", "nationality", "bloodGroup", "religion"
    ],
    "Address": [
      "presentAddress1", "presentAddress2", "presentCity", "presentDivision", 
      "presentPostOrZipCode", "permanentAddress1", "permanentAddress2", 
      "permanentCity", "permanentDivision", "permanentPostOrZipCode", "isSameAddress"
    ],
    "Job Details": [
      "department", "actualJob", "currentJob", "project", "employeeType", 
      "experience", "qualification", "role"
    ],
    "Compensation": [
      "basicPay", "hourlyRate", "dailyRate", "commission", "accAllowance",
      "foodAllowance", "telephoneAllowance", "transportAllowance", 
      "overTimeHours", "holidayOT", "annualLeave"
    ],
    "Client & Vendor": [
      "customerName", "customerWorkingHours", "customerRate", "vendorName", 
      "vendorWorkingHours", "vendorRate"
    ],
    "Documents": [
      "passportProof", "rpIdProof", "visaProof", "hiredFromDocuments", 
      "hiredByDocuments", "passportNumber", "passportWith", "rpIdNumber", "licenseNumber", 
      "medicalCardNumber", "insuranceNumber", "healthCardNumber", "contractNumber"
    ],
    "Employment": [
      "hiredFrom", "contactFullName", "contactNumber", "hiredBy", 
      "hiredByContactName", "hiredByContactNumber", "sponsor", "sponsorIdNumber", 
      "visaType", "offDay", "remarks", "accommodation", "ticketDuration"
    ]
  };

  // Determine if a field is numeric
  const isNumericField = (field) => {
    return typeof employeeData[field] === 'number';
  };

  // Function to render field inputs based on their type
  const renderFieldInput = (field) => {
    if (isNumericField(field)) {
      return (
        <div key={field} className="flex items-center mb-2 p-2 border rounded bg-gray-50">
          <label className="w-64 text-sm font-medium text-gray-700">{formatFieldName(field)}</label>
          <input 
            type="number"
            value={employeeData[field]}
            onChange={(e) => handleNumericChange(field, e.target.value)}
            className="ml-2 p-1 border rounded w-24 text-sm"
          />
        </div>
      );
    } else {
      return (
        <div key={field} className="flex items-center mb-2 p-2 border rounded bg-gray-50">
          <label className="w-64 text-sm font-medium text-gray-700">{formatFieldName(field)}</label>
          <select
            value={String(employeeData[field])}
            onChange={(e) => handleTextChange(field, e.target.value)}
            className="ml-2 p-1 border rounded text-sm"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
      );
    }
  };

  // Format field name for display
  const formatFieldName = (field) => {
    return field
      .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
  };

  // Toggle all fields in a category
  const toggleCategory = (category, value) => {
    const updatedData = { ...employeeData };
    fieldCategories[category].forEach(field => {
      if (typeof updatedData[field] === 'boolean') {
        updatedData[field] = value;
      }
    });
    setEmployeeData(updatedData);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow rounded">
      
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700">Manage Required Field</h1>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => {
              const allTrue = { ...employeeData };
              Object.keys(allTrue).forEach(key => {
                if (typeof allTrue[key] === 'boolean') allTrue[key] = true;
              });
              setEmployeeData(allTrue);
            }}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            Enable All
          </button>
          
          <button 
            onClick={() => {
              const allFalse = { ...employeeData };
              Object.keys(allFalse).forEach(key => {
                if (typeof allFalse[key] === 'boolean') allFalse[key] = false;
              });
              setEmployeeData(allFalse);
            }}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Disable All
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(fieldCategories).map(([category, fields]) => (
          <div key={category} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">{category}</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => toggleCategory(category, true)}
                  className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs border border-green-300 hover:bg-green-200"
                >
                  Enable All
                </button>
                <button 
                  onClick={() => toggleCategory(category, false)}
                  className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs border border-red-300 hover:bg-red-200"
                >
                  Disable All
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {fields.map(field => renderFieldInput(field))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}