import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyMessageButton({ content, variant = "dark" }) {
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

  const colorClasses =
    variant === "light"
      ? "text-white/70 hover:text-white"
      : "text-zinc-500 hover:text-white";

  return (
    <button
      onClick={handleCopy}
      className={`mt-3 flex items-center gap-1.5 text-xs transition ${colorClasses}`}
    >
      {copied ? (
        <>
          <Check size={13} className={variant === "light" ? "text-white" : "text-green-500"} />
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
