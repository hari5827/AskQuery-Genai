import React from "react";

export function LogoutToast({ show }) {
  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-white/10 bg-[#111111] px-5 py-3 text-sm text-zinc-200 shadow-lg">
      Logged out successfully
    </div>
  );
}

export default LogoutToast;
