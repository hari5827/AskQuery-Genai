import React from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export function ChatHeader({ title, sidebarOpen, onToggleSidebar }) {
  return (
    <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-zinc-500">AskQuery AI Assistant</p>
      </div>

      <button
        onClick={onToggleSidebar}
        className="hidden rounded-xl p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white md:block"
        title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
      >
        {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
      </button>
    </header>
  );
}

export default ChatHeader;
