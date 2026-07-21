import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hook/useChat";
import { useAuth } from "../../auth/hook/useAuth";
import { usePdf } from "../../pdf/hook/usePdf";
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
import DeleteDocumentModal from "../../pdf/components/models/DeleteDocumentModal";

const Dashboard = () => {
  const chat = useChat();
  const pdf = usePdf();
  const { handleLogout, handleDeleteAccount } = useAuth();

  const [chatInput, setChatInput] = useState("");
  const [webSearchOn, setWebSearchOn] = useState(false);
  const [pendingFirstMessage, setPendingFirstMessage] = useState(null);

  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const user = useSelector((state) => state.auth.user);
  const isLoading = useSelector((state) => state.chat.isLoading);

  const documents = useSelector((state) => state.pdf.documents);
  const selectedDocumentId = useSelector((state) => state.pdf.selectedDocumentId);
  const uploadStatus = useSelector((state) => state.pdf.uploadStatus);
  const uploadError = useSelector((state) => state.pdf.uploadError);
  const selectedDocument = selectedDocumentId ? documents[selectedDocumentId] : null;

  const [chatToDelete, setChatToDelete] = useState(null);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const {
    initializeSocketConnection,
    handleGetChats,
    handleClearCurrentChat,
    handleDeleteChat,
  } = useChat();

  // Sidebar collapse/expand — open by default on desktop, closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 768
  );

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
    pdf.handleGetDocuments();
  }, []);

  const handleSubmitMessage = async (event) => {
    event.preventDefault();

    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) return;

    setChatInput("");

    // When a document is selected, questions go through the PDF
    // Q&A flow instead of the normal chats API. Continue the same
    // chat thread only if we're already viewing that document's chat.
    if (selectedDocumentId) {
      const isExistingDocChat =
        currentChatId && chats[currentChatId]?.documentId === selectedDocumentId;

      if (!isExistingDocChat) {
        setPendingFirstMessage(trimmedMessage);
      }

      await chat.handleAskDocument({
        question: trimmedMessage,
        chatId: isExistingDocChat ? currentChatId : null,
        documentId: selectedDocumentId,
      });

      setPendingFirstMessage(null);
      return;
    }

    if (!currentChatId) {
      setPendingFirstMessage(trimmedMessage);
    }

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

      <div className="mx-auto flex h-full w-full max-w-[1800px] gap-0 p-0 sm:gap-4 sm:p-4">
        <Sidebar
          sidebarOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
          chats={chats}
          currentChatId={currentChatId}
          onOpenChat={openChat}
          onNewChat={handleClearCurrentChat}
          onRequestDeleteChat={setChatToDelete}
          user={user}
          onLogoutClick={() => setModalType("logout")}
          onDeleteAccountClick={() => setModalType("delete")}
          logo={logo}
          documents={documents}
          selectedDocumentId={selectedDocumentId}
          onSelectDocument={pdf.handleSelectDocument}
          onRequestDeleteDocument={setDocumentToDelete}
        />

        <section className="flex h-full flex-1 flex-col border-0 border-white/5 bg-[#090909] sm:rounded-3xl sm:border">
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
            webSearchOn={webSearchOn}
          />

          <ChatInput
            chatInput={chatInput}
            setChatInput={setChatInput}
            webSearchOn={webSearchOn}
            setWebSearchOn={setWebSearchOn}
            onSubmit={handleSubmitMessage}
            isLoading={isLoading}
            selectedDocument={selectedDocument}
            onDeselectDocument={pdf.handleDeselectDocument}
            uploadStatus={uploadStatus}
            uploadError={uploadError}
            onFileSelected={pdf.handleUploadDocument}
            onInvalidFile={pdf.handleInvalidFile}
            onResetUploadStatus={pdf.handleResetUploadStatus}
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

      <DeleteDocumentModal
        documentId={documentToDelete}
        onCancel={() => setDocumentToDelete(null)}
        onConfirm={async (documentId) => {
          await pdf.handleDeleteDocument(documentId);
          setDocumentToDelete(null);
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
