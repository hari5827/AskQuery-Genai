import React from "react";
import { Globe } from "lucide-react";

export function ChatInput({
  chatInput,
  setChatInput,
  webSearchOn,
  setWebSearchOn,
  onSubmit,
  isLoading,
}) {
  return (
    <footer className="border-t border-white/5 bg-[#090909] p-5">
      <form
        onSubmit={onSubmit}
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
  );
}

export default ChatInput;
