import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import ThinkingIndicator from "./ThinkingIndicator";

export function ChatMessages({
  currentChatId,
  chats,
  isLoading,
  pendingFirstMessage,
  newestIndex,
  user,
  logo,
  webSearchOn,
}) {
  const currentChat = currentChatId ? chats[currentChatId] : null;
  const scrollRef = useRef(null);

  // Auto-scroll to the latest message whenever the message list grows,
  // the AI starts/stops "thinking", or a brand-new chat's first
  // message is pending — so the user never has to scroll manually.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentChatId, currentChat?.messages?.length, isLoading, pendingFirstMessage]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-5xl flex-col space-y-5 px-4 py-8 pb-32 sm:space-y-7 sm:px-8 sm:py-10 sm:pb-40">
        {currentChatId ? (
          <>
            {currentChat?.messages?.map((message, index) => (
              <MessageBubble
                key={index}
                message={message}
                isNewest={index === newestIndex}
              />
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-3xl rounded-bl-lg border border-white/5 bg-[#111111] px-5 py-5 text-zinc-200 sm:max-w-[800px] sm:px-7 sm:py-6">
                  <ThinkingIndicator searching={webSearchOn} />
                </div>
              </div>
            )}

            {!currentChat?.messages?.length && !isLoading && (
              <div className="flex h-full items-center justify-center py-16 sm:py-32">
                <div className="text-center">
                  <img
                    src={logo}
                    alt="AskQuery"
                    className="mx-auto mb-6 h-16 w-16 object-contain sm:mb-8 sm:h-24 sm:w-24"
                  />

                  <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                    Ask<span className="text-red-600">Query</span>
                  </h1>

                  <p className="mt-3 text-base text-zinc-500 sm:mt-4 sm:text-lg">
                    Ask anything. Generate ideas. Solve problems.
                  </p>
                </div>
              </div>
            )}
          </>
        ) : pendingFirstMessage ? (
          <div className="flex flex-col space-y-5 sm:space-y-7">
            <div className="flex animate-message-in justify-end">
              <div className="max-w-[85%] rounded-3xl rounded-br-lg bg-gradient-to-r from-red-700 to-red-600 px-5 py-3.5 text-white shadow-lg shadow-red-900/20 sm:max-w-[520px] sm:px-6">
                <p className="whitespace-pre-wrap leading-7">
                  {pendingFirstMessage}
                </p>
              </div>
            </div>

            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-3xl rounded-bl-lg border border-white/5 bg-[#111111] px-5 py-5 text-zinc-200 sm:max-w-[800px] sm:px-7 sm:py-6">
                <ThinkingIndicator searching={webSearchOn} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center py-16 sm:py-32">
            <div className="max-w-full text-center">
              <h1 className="break-words text-3xl font-bold tracking-tight sm:text-5xl">
                <span className="text-white">Good to see you, </span>
                <span className="text-red-400">{user?.username || "there"}</span>
              </h1>

              <p className="mt-3 text-base text-zinc-500 sm:mt-5 sm:text-xl">
                How can I help you today?
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessages;

