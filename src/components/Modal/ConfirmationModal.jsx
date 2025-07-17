import React from "react";

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-xl font-bold text-brand-blue">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800"
          >
            &times;
          </button>
        </div>

        <div className="py-4">
          <p className="text-slate-600">{message}</p>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            onClick={onClose}
            className="bg-slate-200 text-slate-800 font-bold rounded-lg px-5 py-2 hover:bg-slate-300"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white font-bold rounded-lg px-5 py-2 hover:bg-red-700"
          >
            Confirmar Exclusão
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
