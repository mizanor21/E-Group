"use client";
import React, { useState, useEffect } from 'react';
import { FaSave, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const RequiredFieldsManager = () => {
  const [requiredFields, setRequiredFields] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch current required fields configuration
  useEffect(() => {
    const fetchRequiredFields = async () => {
      try {
        const response = await fetch('/api/required-field');
        if (!response.ok) {
          throw new Error('Failed to fetch required fields');
        }
        const data = await response.json();
        setRequiredFields(data[0]); // Assuming the API returns an array with one object
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching required fields:', error);
        setIsLoading(false);
      }
    };

    fetchRequiredFields();
  }, []);

  // Toggle a field's required status
  const toggleField = (fieldName) => {
    setRequiredFields(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  // Save the updated required fields
  const saveRequiredFields = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/required-field', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requiredFields),
      });

      if (!response.ok) {
        throw new Error('Failed to update required fields');
      }

      alert('Required fields updated successfully!');
    } catch (error) {
      console.error('Error updating required fields:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Group fields by category for better organization
  const fieldCategories = {
    "Personal Information": [
      'firstName', 'lastName', 'eEmail', 'phoneNumber', 'dob', 
      'employeeID', 'gender', 'nationality', 'bloodGroup', 'religion'
    ],
    "Address Information": [
      'presentAddress1', 'presentAddress2', 'presentCity', 
      'presentDivision', 'presentPostOrZipCode', 'permanentAddress1', 
      'permanentAddress2', 'permanentCity', 'permanentDivision', 
      'permanentPostOrZipCode', 'isSameAddress'
    ],
    "Employment Details": [
      'department', 'actualJob', 'currentJob', 'project', 
      'employeeType', 'experience', 'qualification', 'role'
    ],
    "Compensation": [
      'basicPay', 'hourlyRate', 'dailyRate', 'commission', 
      'accAllowance', 'foodAllowance', 'telephoneAllowance', 
      'transportAllowance', 'overTimeHours', 'holidayOT', 'annualLeave'
    ],
    "Customer/Vendor Info": [
      'customerName', 'customerWorkingHours', 'customerRate', 
      'vendorName', 'vendorWorkingHours', 'vendorRate'
    ],
    "Documents": [
      'passportProof', 'rpIdProof', 'visaProof', 
      'hiredFromDocuments', 'hiredByDocuments'
    ],
    "Passport Details": [
      'passportNumber', 'passportWith', 'passportIssueDate', 
      'passportExpiryDate'
    ],
    "ID Details": [
      'rpIdNumber', 'rpIdIssueDate', 'rpIdExpiryDate'
    ],
    "License & Cards": [
      'licenseNumber', 'licenseExpiryDate', 'medicalCardNumber', 
      'medicalCardExpiryDate', 'insuranceNumber', 'insuranceExpiryDate', 
      'healthCardNumber', 'healthCardExpiryDate'
    ],
    "Contract Details": [
      'contractNumber', 'nocExpiryDate'
    ],
    "Hiring Information": [
      'hiredFrom', 'contactFullName', 'contactNumber', 
      'hiredFromDate', 'hiredFromExpiryDate', 'hiredBy', 
      'hiredByContactName', 'hiredByContactNumber', 
      'hiredByDate', 'hiredByExpiryDate'
    ],
    "Visa & Sponsorship": [
      'sponsor', 'sponsorIdNumber', 'visaType', 
      'visaEntryDate', 'visaExpiryDate'
    ],
    "Other Dates": [
      'fingerprintDate', 'medicalDate', 'settlementDate'
    ],
    "Miscellaneous": [
      'offDay', 'remarks', 'accommodation', 
      'ticketDuration', 'lastTicket'
    ]
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading required fields configuration...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Manage Required Fields</h1>
      
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">
          Toggle which fields should be required in employee forms
        </p>
        <button
          onClick={saveRequiredFields}
          disabled={isSaving}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          {isSaving ? 'Saving...' : 'Save Changes'} <FaSave />
        </button>
      </div>

      {Object.entries(fieldCategories).map(([category, fields]) => (
        <div key={category} className="mb-8 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fields.map(field => (
              <div key={field} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <label className="text-gray-700 capitalize">
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <button
                  onClick={() => toggleField(field)}
                  className={`p-2 rounded-full ${requiredFields[field] ? 'text-green-500' : 'text-gray-400'}`}
                  title={requiredFields[field] ? 'Required - Click to make optional' : 'Optional - Click to make required'}
                >
                  {requiredFields[field] ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-6 flex justify-end">
        <button
          onClick={saveRequiredFields}
          disabled={isSaving}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
        >
          {isSaving ? 'Saving...' : 'Save All Changes'} <FaSave />
        </button>
      </div>
    </div>
  );
};

export default RequiredFieldsManager;