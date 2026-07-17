import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// Renders a fenced code block with a header bar (language + copy button)
// and real syntax highlighting.
export function CodeBlock({ children, language = "text" }) {
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
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
        <span className="text-xs uppercase tracking-wide text-zinc-500">
          {language}
        </span>
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

      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
            fontSize: "0.8rem",
            minWidth: "max-content",
          }}
          codeTagProps={{ style: { fontFamily: "inherit" } }}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default CodeBlock;
