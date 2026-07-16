import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

// Renders a fenced code block with a header bar + copy-to-clipboard button.
export function CodeBlock({ children }) {
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

export default CodeBlock;
