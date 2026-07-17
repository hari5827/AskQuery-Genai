import React from "react";

// A small spinning "AQ" badge with a "Thinking"/"Searching" label,
// shown while waiting for the AI's response.
export function ThinkingIndicator({ searching = false }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-red-400/20 border-t-red-400" />
        <span className="text-[10px] font-bold tracking-wide text-red-400">AQ</span>
      </div>
      <span className="text-sm text-zinc-400">
        {searching ? "Searching the web…" : "Thinking…"}
      </span>
    </div>
  );
}

export default ThinkingIndicator;
