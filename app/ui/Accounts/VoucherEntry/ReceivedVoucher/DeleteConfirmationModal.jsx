// app/components/DeleteConfirmationModal.jsx
'use client'
import { useState } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  itemName = "this item",
  description = "This action cannot be undone."
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <div className="flex items-center">
            <AlertTriangle className="text-red-500 mr-2" />
            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <p className="mb-4">Are you sure you want to delete {itemName}?</p>
          <p className="text-sm text-gray-500 mb-6">{description}</p>

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
            >
              <Trash2 size={16} className="mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;