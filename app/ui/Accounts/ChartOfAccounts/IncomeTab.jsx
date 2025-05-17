// Similar to AssetsTab.jsx but with these changes:
// 1. Change the icon to Building2
// 2. Update titles to "Equity"

'use client'
import { useState } from 'react';
import { Building2, Search, Plus, Edit, Trash2, Eye, Check, X, Loader2, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';

export default function LiabilityTab({ data }) {
  // ... same state and functions as AssetsTab

  return (
    <>
      {/* Content Header */}
      <div className="bg-white rounded-t-lg shadow p-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="bg-gray-100 p-2 rounded-lg mr-3">
            <Building2 className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Income</h2>
            <p className="text-sm text-gray-500">Accounts / Income</p>
          </div>
        </div>
        {/* ... rest of the component same as AssetsTab */}
      </div>
      {/* ... rest of the component same as AssetsTab */}
    </>
  );
}