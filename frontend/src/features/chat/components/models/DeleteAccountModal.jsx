import React, { useState } from "react";

export function DeleteAccountModal({ open, onCancel, onConfirm }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!open) return null;

  const reset = () => {
    setEmail("");
    setPassword("");
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const handleConfirm = async () => {
    await onConfirm({ email, password });
    reset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-96 rounded-2xl border border-white/10 bg-[#111111] p-6">
        <p className="mb-1 text-sm font-semibold text-red-500">Delete account</p>
        <p className="mb-5 text-sm text-zinc-400">
          This action cannot be undone. Enter your email and password to confirm.
        </p>

        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm outline-none focus:border-red-600"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm outline-none focus:border-red-600"
          />
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            disabled={!email || !password}
            onClick={handleConfirm}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-500 disabled:opacity-40"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccountModal;
