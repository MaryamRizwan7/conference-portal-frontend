import React from "react";

const ConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-sm w-full mx-4">
        <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold mb-2 text-gray-900">Confirm Action</h2>
        <p className="mb-8 text-center text-gray-500 font-medium leading-relaxed">
          Are you sure you want to delete this conference? This action cannot be undone.
        </p>
        <div className="flex flex-col w-full space-y-3">
          <button
            onClick={onConfirm}
            className="w-full py-3 px-4 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-teal-900/20"
            style={{ background: "linear-gradient(135deg, #2D5561, #4B707A)" }}
          >
            Yes, Delete Conference
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3 px-4 text-gray-700 font-bold bg-gray-100 rounded-xl transition-all duration-300 hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;