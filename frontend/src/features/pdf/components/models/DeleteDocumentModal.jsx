import React from "react";

export function DeleteDocumentModal({ documentId, onCancel, onConfirm }) {
  if (!documentId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-80 rounded-2xl border border-white/10 bg-[#111111] p-6">
        <p className="mb-5 text-sm text-zinc-300">Delete this document?</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(documentId)}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteDocumentModal;
