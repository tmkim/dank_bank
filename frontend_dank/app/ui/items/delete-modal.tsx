// components/ConfirmDeleteModal.tsx
import React from 'react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  itemName: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, itemName, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md">
        <p>Are you sure you want to delete "{itemName}"?</p>
        <div className="mt-4">
          <button
            className="bg-red-500 text-white py-2 px-4 rounded-md"
            onClick={onConfirm}
          >
            Yes, Delete
          </button>
          <button
            className="ml-4 py-2 px-4 rounded-md"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
