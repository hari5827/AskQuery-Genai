import React from "react";
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
}) {
  const currentChat = currentChatId ? chats[currentChatId] : null;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-5xl flex-col space-y-6 px-8 py-8 pb-40">
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
                <div className="max-w-[800px] rounded-3xl rounded-bl-lg border border-white/5 bg-[#111111] px-6 py-5 text-zinc-200">
                  <ThinkingIndicator />
                </div>
              </div>
            )}

            {!currentChat?.messages?.length && !isLoading && (
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
        ) : pendingFirstMessage ? (
          <div className="flex flex-col space-y-6">
            <div className="flex animate-message-in justify-end">
              <div className="max-w-[520px] rounded-3xl rounded-br-lg bg-gradient-to-r from-red-700 to-red-600 px-5 py-3 text-white shadow-lg shadow-red-900/20">
                <p className="whitespace-pre-wrap leading-7">
                  {pendingFirstMessage}
                </p>
              </div>
            </div>

            <div className="flex justify-start">
              <div className="max-w-[800px] rounded-3xl rounded-bl-lg border border-white/5 bg-[#111111] px-6 py-5 text-zinc-200">
                <ThinkingIndicator />
              </div>
            </div>
          </div>
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
  );
}

export default ChatMessages;
