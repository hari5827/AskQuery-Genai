import React, { useEffect, useRef, useState } from "react";
import { X, Settings, LogOut, Trash2, Search } from "lucide-react";

// Formats a chat's last-updated timestamp: just the time if it was
// today, otherwise a short date + time.
function formatChatTime(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const time = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  if (isToday) return time;

  const day = date.toLocaleDateString([], { day: "numeric", month: "short" });
  return `${day} · ${time}`;
}

export function Sidebar({
  sidebarOpen,
  onCloseMobile,
  chats,
  currentChatId,
  onOpenChat,
  onNewChat,
  onRequestDeleteChat,
  user,
  onLogoutClick,
  onDeleteAccountClick,
  logo,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef(null);

  // Close the gear dropdown when clicking outside it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Mobile backdrop - tapping it closes the drawer */}
      {sidebarOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-full w-[260px] flex-col border-r border-white/5 bg-[#0d0d0d] transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:inset-auto md:z-0 md:translate-x-0 md:overflow-hidden md:rounded-3xl md:border md:transition-all md:duration-300 md:ease-in-out ${
          sidebarOpen
            ? "md:w-[260px] md:opacity-100"
            : "md:w-0 md:border-none md:opacity-0"
        }`}
      >
        {/* Logo */}

      <div className="w-[260px] border-b border-white/5 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="AskQuery"
              className="h-11 w-11 shrink-0 object-contain"
            />

            <div>
              <h1 className="text-xl font-bold tracking-wide">
                Ask<span className="text-red-400">Query</span>
              </h1>

              <p className="text-xs text-zinc-500">AI Assistant</p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <button
          onClick={onNewChat}
          className="mt-5 w-full rounded-2xl bg-gradient-to-r from-red-500 to-red-500 py-3 text-sm font-semibold transition hover:from-red-500 hover:to-red-500"
        >
          Start a new chat.
        </button>
      </div>

      {/* Chat List */}

      <div className="w-[260px] flex-1 overflow-y-auto p-4">
        <div className="relative mb-4">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2 pl-9 pr-3 text-sm outline-none transition placeholder:text-zinc-500 focus:border-red-600"
          />
        </div>

        <p className="mb-3 text-xs uppercase tracking-[2px] text-zinc-500">
          Recent Chats
        </p>

        <div className="space-y-2">
          {Object.values(chats)
            .filter((chatItem) =>
              (chatItem.title || "")
                .toLowerCase()
                .includes(searchQuery.trim().toLowerCase())
            )
            .map((chatItem) => (
            <div key={chatItem.id} className="group relative">
              <button
                onClick={() => onOpenChat(chatItem.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 pr-9 text-left transition-all duration-200 ${
                  currentChatId === chatItem.id
                    ? "border border-red-700/30 bg-red-700/10"
                    : "hover:bg-white/5"
                }`}
              >
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    currentChatId === chatItem.id ? "bg-red-600" : "bg-zinc-600"
                  }`}
                />

                <div className="overflow-hidden">
                  <p className="truncate text-sm font-medium">
                    {chatItem.title}
                  </p>

                  <p className="truncate text-xs text-zinc-500">
                    {formatChatTime(chatItem.lastUpdated)}
                  </p>
                </div>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestDeleteChat(chatItem.id);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100"
              >
                <X size={16} className="text-zinc-500 hover:text-red-500" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* User */}

      <div className="w-[260px] border-t border-white/5 p-4">
        <div
          ref={menuRef}
          className="relative flex items-center gap-3 rounded-2xl bg-white/[0.03] p-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">
              {user?.name || "User"}
            </p>

            <p className="truncate text-xs text-zinc-500">{user?.username}</p>
          </div>

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-red-700/10 hover:text-red-500"
          >
            <Settings size={18} />
          </button>

          {menuOpen && (
            <div className="absolute bottom-full right-0 mb-2 w-48 overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-xl">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onLogoutClick();
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-sm text-zinc-300 transition hover:bg-red-700/10 hover:text-red-500"
              >
                <LogOut size={15} />
                Logout
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDeleteAccountClick();
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-sm text-zinc-300 transition hover:bg-red-700/10 hover:text-red-500"
              >
                <Trash2 size={15} />
                Delete account
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
    </>
  );
}

export default Sidebar;
