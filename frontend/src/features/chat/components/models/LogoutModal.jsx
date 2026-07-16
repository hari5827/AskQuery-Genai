import React from "react";

export function LogoutModal({ open, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-80 rounded-2xl border border-white/10 bg-[#111111] p-6">
        <p className="mb-5 text-sm text-zinc-300">
          Are you sure you want to logout?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
