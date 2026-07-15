import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hook/useChat";
import { useAuth } from "../../auth/hook/useAuth";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { X, Copy, Check, Settings, LogOut, Trash2, PanelLeftClose, PanelLeftOpen, Globe } from "lucide-react";
import logo from "../../../app/askquery-logo.svg";
import "katex/dist/katex.min.css";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// Renders a fenced code block with a header bar + copy-to-clipboard button.
// Defined outside Dashboard so it isn't recreated on every render.
function CodeBlock({ children }) {
  const [copied, setCopied] = useState(false);

  const codeString = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="relative my-4 overflow-hidden rounded-2xl border border-white/5 bg-black">
      <div className="flex items-center justify-end border-b border-white/5 px-4 py-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-zinc-400 transition hover:text-white"
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-500" />
              Copied
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function CopyMessageButton({ content }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy message:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="mt-3 flex items-center gap-1.5 text-xs text-zinc-500 transition hover:text-white"
    >
      {copied ? (
        <>
          <Check size={13} className="text-green-500" />
          Copied
        </>
      ) : (
        <>
          <Copy size={13} />
          Copy
        </>
      )}
    </button>
  );
}

const Dashboard = () => {

  const chat = useChat();
  const { handleLogout, handleDeleteAccount } = useAuth();

  const [chatInput, setChatInput] = useState("");
  const [webSearchOn, setWebSearchOn] = useState(false);

  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const user = useSelector((state) => state.auth.user);
  const [chatToDelete, setChatToDelete] = useState(null);
  const { initializeSocketConnection, handleGetChats, handleClearCurrentChat, handleDeleteChat } = useChat();
  const isLoading = useSelector((state) => state.chat.isLoading);

  // Sidebar collapse/expand
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Gear menu / account modals
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'logout' | 'delete' | null
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [showLogoutToast, setShowLogoutToast] = useState(false);
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

  // Tracks how many messages existed last render, per chat,
  // so we only animate the newest bubble instead of replaying
  // the animation on every message whenever the list re-renders.
  const prevCountRef = useRef({});
  const currentMessages = chats[currentChatId]?.messages;
  const currentCount = currentMessages?.length || 0;
  const prevCount = prevCountRef.current[currentChatId] || 0;
  const newestIndex = currentCount > prevCount ? currentCount - 1 : -1;

  useEffect(() => {
    if (currentChatId) {
      prevCountRef.current[currentChatId] = currentCount;
    }
  }, [currentChatId, currentCount]);

  useEffect(() => {
    initializeSocketConnection();
    handleGetChats();
  }, []);

  const handleSubmitMessage = (event) => {
    event.preventDefault();

    const trimmedMessage = chatInput.trim();

    if (!trimmedMessage) return;

    chat.handleSendMessage({
      message: trimmedMessage,
      chatId: currentChatId,
      webSearch: webSearchOn,
    });

    setChatInput("");
  };

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats);
  };

  return (
    <main className="h-screen overflow-hidden bg-[#050505] text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute -top-40 left-0 h-96 w-96 rounded-full bg-red-700/5 blur-[160px]" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-red-700/5 blur-[180px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#141414_0%,#090909_45%,#050505_100%)]" />
      </div>

      <div className="mx-auto flex h-full w-full max-w-[1800px] gap-4 p-4">
        {/* ===================== SIDEBAR ===================== */}

        <aside
          className={`hidden h-full shrink-0 overflow-hidden rounded-3xl border border-white/5 bg-[#0d0d0d] transition-all duration-300 ease-in-out md:flex md:flex-col ${
            sidebarOpen ? "w-[260px] opacity-100" : "w-0 border-none opacity-0"
          }`}
        >
          {/* Logo */}

          <div className="w-[260px] border-b border-white/5 p-5">
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
              onClick={handleClearCurrentChat}
              className="mt-5 w-full rounded-2xl bg-gradient-to-r from-red-500 to-red-500 py-3 text-sm font-semibold transition hover:from-red-500 hover:to-red-500"
            >
               Start a new chat.
            </button>
          </div>

          {/* Chat List */}

          <div className="w-[260px] flex-1 overflow-y-auto p-4">
            <p className="mb-3 text-xs uppercase tracking-[2px] text-zinc-500">
              Recent Chats
            </p>

            <div className="space-y-2">
              {Object.values(chats).map((chatItem) => (
                <div key={chatItem.id} className="group relative">
                  <button
                    onClick={() => openChat(chatItem.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 pr-9 text-left transition-all duration-200 ${
                      currentChatId === chatItem.id
                        ? "border border-red-700/30 bg-red-700/10"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        currentChatId === chatItem.id
                          ? "bg-red-600"
                          : "bg-zinc-600"
                      }`}
                    />

                    <div className="overflow-hidden">
                      <p className="truncate text-sm font-medium">
                        {chatItem.title}
                      </p>

                      <p className="truncate text-xs text-zinc-500">
                        AI Conversation
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setChatToDelete(chatItem.id);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 transition group-hover:opacity-100"
                  >
                    <X size={16} className="text-zinc-500 hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* User */}

          <div className="w-[260px] border-t border-white/5 p-4">
            <div ref={menuRef} className="relative flex items-center gap-3 rounded-2xl bg-white/[0.03] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">
                  {user?.name || "User"}
                </p>

                <p className="truncate text-xs text-zinc-500">
                  {user?.username}
                </p>
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
                      setModalType("logout");
                    }}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-zinc-300 transition hover:bg-red-700/10 hover:text-red-500"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setModalType("delete");
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

        {/* ===================== CHAT ===================== */}

        <section className="flex h-full flex-1 flex-col rounded-3xl border border-white/5 bg-[#090909]">
          {/* Header */}

          <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
            <div>
              <h2 className="text-xl font-semibold">
                {currentChatId ? chats[currentChatId]?.title : "New Conversation"}
              </h2>

              <p className="mt-1 text-sm text-zinc-500">AskQuery AI Assistant</p>
            </div>

            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="hidden rounded-xl p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white md:block"
              title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
          </header>

          {/* Messages */}

          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-5xl flex-col space-y-6 px-8 py-8 pb-40">
              {currentChatId ? (
                <>
                  {chats[currentChatId]?.messages?.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        index === newestIndex ? "animate-message-in" : ""
                      } ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`${
                          message.role === "user"
                            ? "max-w-[520px] rounded-3xl rounded-br-lg bg-gradient-to-r from-red-700 to-red-600 px-5 py-3 text-white shadow-lg shadow-red-900/20"
                            : "max-w-[800px] rounded-3xl rounded-bl-lg border border-white/5 bg-[#111111] px-6 py-5 text-zinc-200"
                        }`}
                      >
                        {message.role === "user" ? (
                          <p className="whitespace-pre-wrap leading-7">
                            {message.content}
                          </p>
                        ) : (
                          <>
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm, remarkMath]}
                               rehypePlugins={[rehypeKatex]}
                              components={{
                                p: ({ children }) => (
                                  <p className="mb-3 leading-7 last:mb-0">
                                    {children}
                                  </p>
                                ),
                                ul: ({ children }) => (
                                  <ul className="mb-3 list-disc pl-6">
                                    {children}
                                  </ul>
                                ),
                                ol: ({ children }) => (
                                  <ol className="mb-3 list-decimal pl-6">
                                    {children}
                                  </ol>
                                ),
                                li: ({ children }) => (
                                  <li className="mb-1">{children}</li>
                                ),
                                code: ({ className, children, ...props }) => {
                                  const isInline = !className;
                                  if (isInline) {
                                    return (
                                      <code className="rounded-lg bg-black/40 px-2 py-1 text-red-300">
                                        {children}
                                      </code>
                                    );
                                  }
                                  // Block-level code is wrapped by `pre` below;
                                  // just pass children through untouched here.
                                  return <code className={className}>{children}</code>;
                                },
                                pre: ({ children }) => {
                                  // `children` here is the <code> element produced above;
                                  // pull its raw text content out for CodeBlock.
                                  const codeContent = children?.props?.children;
                                  return <CodeBlock>{codeContent}</CodeBlock>;
                                },
                                h1: ({ children }) => (
                                  <h1 className="mb-3 text-3xl font-bold">
                                    {children}
                                  </h1>
                                ),
                                h2: ({ children }) => (
                                  <h2 className="mb-3 text-2xl font-bold">
                                    {children}
                                  </h2>
                                ),
                                h3: ({ children }) => (
                                  <h3 className="mb-3 text-xl font-semibold">
                                    {children}
                                  </h3>
                                ),
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                            <CopyMessageButton content={message.content} />
                          </>
                        )}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[800px] rounded-3xl rounded-bl-lg border border-white/5 bg-[#111111] px-6 py-5 text-zinc-200">
                        <div className="flex gap-1.5">
                          <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
                        </div>
                      </div>
                    </div>
                  )}

                  {!chats[currentChatId]?.messages?.length && !isLoading && (
                    <div className="flex h-full items-center justify-center py-32">
                      <div className="text-center">
                        <img
                          src={logo}
                          alt="AskQuery"
                          className="mx-auto mb-8 h-24 w-24 object-contain"
                        />

                        <h1 className="text-5xl font-bold tracking-tight">
                          Ask<span className="text-red-600">Query</span>
                        </h1>

                        <p className="mt-4 text-lg text-zinc-500">
                          Ask anything. Generate ideas. Solve problems.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex h-full items-center justify-center py-32">
                  <div className="text-center">
                    
                    <h1 className="text-5xl font-bold tracking-tight">
                      <span className="text-white">Good to see you, </span>
                      <span className="text-red-400">{user?.username || "there"}</span>
                    </h1>

                    <p className="mt-5 text-xl text-zinc-500">
                     How can I help you today?
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <footer className="border-t border-white/5 bg-[#090909] p-5">
            <form
              onSubmit={handleSubmitMessage}
              className="mx-auto flex max-w-4xl items-center gap-3 rounded-full border border-white/10 bg-[#111111] pl-2 pr-2 transition focus-within:border-red-600"
            >
              <button
                type="button"
                onClick={() => setWebSearchOn((prev) => !prev)}
                title={webSearchOn ? "Web search on" : "Turn on web search"}
                className={`flex shrink-0 items-center justify-center rounded-full p-2.5 transition ${
                  webSearchOn
                    ? "bg-red-500/15 text-red-400"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Globe size={20} />
              </button>

              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={webSearchOn ? "Web search on" : "Ask me anything..."}
                disabled={isLoading}
                className="flex-1 bg-transparent py-3 text-base outline-none placeholder:text-zinc-500 disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={!chatInput.trim() || isLoading}
                className="shrink-0 rounded-full bg-gradient-to-r from-red-700 to-red-600 px-6 py-3 font-semibold transition hover:from-red-600 hover:to-red-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Send
              </button>
            </form>
          </footer>
        </section>
      </div>

      {/* Delete chat confirmation modal */}
      {chatToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-80 rounded-2xl border border-white/10 bg-[#111111] p-6">
            <p className="mb-5 text-sm text-zinc-300">
              Delete this chat?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setChatToDelete(null)}
                className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleDeleteChat(chatToDelete);
                  setChatToDelete(null);
                }}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout confirmation modal */}
      {modalType === "logout" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-80 rounded-2xl border border-white/10 bg-[#111111] p-6">
            <p className="mb-5 text-sm text-zinc-300">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalType(null)}
                className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleLogout();
                  setModalType(null);
                  setShowLogoutToast(true);
                  setTimeout(() => setShowLogoutToast(false), 2500);
                }}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete account confirmation modal */}
      {modalType === "delete" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-96 rounded-2xl border border-white/10 bg-[#111111] p-6">
            <p className="mb-1 text-sm font-semibold text-red-500">
              Delete account
            </p>
            <p className="mb-5 text-sm text-zinc-400">
              This action cannot be undone. Enter your email and password to confirm.
            </p>

            <div className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                value={deleteEmail}
                onChange={(e) => setDeleteEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm outline-none focus:border-red-600"
              />
              <input
                type="password"
                placeholder="Password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm outline-none focus:border-red-600"
              />
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => {
                  setModalType(null);
                  setDeleteEmail("");
                  setDeletePassword("");
                }}
                className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                disabled={!deleteEmail || !deletePassword}
                onClick={async () => {
                  await handleDeleteAccount({ email: deleteEmail, password: deletePassword });
                  setModalType(null);
                  setDeleteEmail("");
                  setDeletePassword("");
                }}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-500 disabled:opacity-40"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout toast */}
      {showLogoutToast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-white/10 bg-[#111111] px-5 py-3 text-sm text-zinc-200 shadow-lg">
          Logged out successfully
        </div>
      )}
    </main>
  );
};

export default Dashboard;
