import React from "react";
import { Globe, Send } from "lucide-react";

export function ChatInput({
  chatInput,
  setChatInput,
  webSearchOn,
  setWebSearchOn,
  onSubmit,
  isLoading,
}) {
  return (
    <footer className="border-t border-white/5 bg-[#090909] p-3 sm:p-5">
      <form
        onSubmit={onSubmit}
        className="mx-auto flex max-w-4xl items-center gap-1.5 rounded-full border border-white/10 bg-[#111111] pl-1.5 pr-1.5 transition focus-within:border-red-600 sm:gap-3 sm:pl-2 sm:pr-2"
      >
        <button
          type="button"
          onClick={() => setWebSearchOn((prev) => !prev)}
          title={webSearchOn ? "Web search on" : "Turn on web search"}
          className={`flex shrink-0 items-center justify-center rounded-full p-2 transition sm:p-2.5 ${
            webSearchOn
              ? "bg-red-500/15 text-red-400"
              : "text-zinc-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Globe size={18} className="sm:hidden" />
          <Globe size={20} className="hidden sm:block" />
        </button>

        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder={webSearchOn ? "Web search on" : "Ask me anything..."}
          disabled={isLoading}
          className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-zinc-500 disabled:opacity-50 sm:py-3 sm:text-base"
        />

        <button
          type="submit"
          disabled={!chatInput.trim() || isLoading}
          className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-red-700 to-red-600 p-2.5 font-semibold transition hover:from-red-600 hover:to-red-500 disabled:cursor-not-allowed disabled:opacity-40 sm:px-6 sm:py-3"
        >
          <Send size={18} className="sm:hidden" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </footer>
  );
}

export default ChatInput;
