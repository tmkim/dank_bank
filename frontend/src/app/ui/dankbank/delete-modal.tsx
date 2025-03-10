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
    <div className="fixed inset-0 bg-gray-500 z-10 flex justify-center items-center"
         style={{ backgroundColor: 'rgba(31, 41, 55, 0.7)' }}>
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
