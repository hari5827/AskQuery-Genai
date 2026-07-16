import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hook/useChat";
import { useAuth } from "../../auth/hook/useAuth";
import logo from "../../../app/askquery-logo.svg";
import "katex/dist/katex.min.css";

import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";
import DeleteChatModal from "../components/models/DeleteChatModal";
import LogoutModal from "../components/models/LogoutModal";
import DeleteAccountModal from "../components/models/DeleteAccountModal";
import LogoutToast from "../components/models/LogoutToast";

const Dashboard = () => {
  const chat = useChat();
  const { handleLogout, handleDeleteAccount } = useAuth();

  const [chatInput, setChatInput] = useState("");
  const [webSearchOn, setWebSearchOn] = useState(false);
  const [pendingFirstMessage, setPendingFirstMessage] = useState(null);

  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const user = useSelector((state) => state.auth.user);
  const isLoading = useSelector((state) => state.chat.isLoading);

  const [chatToDelete, setChatToDelete] = useState(null);
  const {
    initializeSocketConnection,
    handleGetChats,
    handleClearCurrentChat,
    handleDeleteChat,
  } = useChat();

  // Sidebar collapse/expand
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Account modals
  const [modalType, setModalType] = useState(null); // 'logout' | 'delete' | null
  const [showLogoutToast, setShowLogoutToast] = useState(false);

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

  const handleSubmitMessage = async (event) => {
    event.preventDefault();

    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) return;

    if (!currentChatId) {
      setPendingFirstMessage(trimmedMessage);
    }

    setChatInput("");

    await chat.handleSendMessage({
      message: trimmedMessage,
      chatId: currentChatId,
      webSearch: webSearchOn,
    });

    setPendingFirstMessage(null);
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
        <Sidebar
          sidebarOpen={sidebarOpen}
          chats={chats}
          currentChatId={currentChatId}
          onOpenChat={openChat}
          onNewChat={handleClearCurrentChat}
          onRequestDeleteChat={setChatToDelete}
          user={user}
          onLogoutClick={() => setModalType("logout")}
          onDeleteAccountClick={() => setModalType("delete")}
          logo={logo}
        />

        <section className="flex h-full flex-1 flex-col rounded-3xl border border-white/5 bg-[#090909]">
          <ChatHeader
            title={currentChatId ? chats[currentChatId]?.title : "New Conversation"}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          />

          <ChatMessages
            currentChatId={currentChatId}
            chats={chats}
            isLoading={isLoading}
            pendingFirstMessage={pendingFirstMessage}
            newestIndex={newestIndex}
            user={user}
            logo={logo}
          />

          <ChatInput
            chatInput={chatInput}
            setChatInput={setChatInput}
            webSearchOn={webSearchOn}
            setWebSearchOn={setWebSearchOn}
            onSubmit={handleSubmitMessage}
            isLoading={isLoading}
          />
        </section>
      </div>

      <DeleteChatModal
        chatId={chatToDelete}
        onCancel={() => setChatToDelete(null)}
        onConfirm={async (chatId) => {
          await handleDeleteChat(chatId);
          setChatToDelete(null);
        }}
      />

      <LogoutModal
        open={modalType === "logout"}
        onCancel={() => setModalType(null)}
        onConfirm={async () => {
          await handleLogout();
          setModalType(null);
          setShowLogoutToast(true);
          setTimeout(() => setShowLogoutToast(false), 2500);
        }}
      />

      <DeleteAccountModal
        open={modalType === "delete"}
        onCancel={() => setModalType(null)}
        onConfirm={async ({ email, password }) => {
          await handleDeleteAccount({ email, password });
          setModalType(null);
        }}
      />

      <LogoutToast show={showLogoutToast} />
    </main>
  );
};

export default Dashboard;
