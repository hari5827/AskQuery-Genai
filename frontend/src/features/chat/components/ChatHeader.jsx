import React from "react";
import { PanelLeftClose, PanelLeftOpen, Menu } from "lucide-react";

export function ChatHeader({ title, sidebarOpen, onToggleSidebar }) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex min-w-0 items-center gap-2">
        {/* Mobile-only hamburger to open the sidebar drawer */}
        <button
          onClick={onToggleSidebar}
          className="shrink-0 rounded-xl p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white md:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold sm:text-xl">{title}</h2>
          <p className="mt-0.5 truncate text-xs text-zinc-500 sm:mt-1 sm:text-sm">
            AskQuery AI Assistant
          </p>
        </div>
      </div>

      {/* Desktop-only collapse/expand toggle */}
      <button
        onClick={onToggleSidebar}
        className="hidden shrink-0 rounded-xl p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white md:block"
        title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
      >
        {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
      </button>
    </header>
  );
}

export default ChatHeader;
