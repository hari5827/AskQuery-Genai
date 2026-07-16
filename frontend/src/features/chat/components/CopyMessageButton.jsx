import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyMessageButton({ content }) {
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

export default CopyMessageButton;
