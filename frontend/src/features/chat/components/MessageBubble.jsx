import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { CodeBlock } from "./CodeBlock";
import { CopyMessageButton } from "./CopyMessageButton";

const markdownComponents = {
  p: ({ children }) => <p className="mb-3 leading-7 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-3 list-disc pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="mb-3 list-decimal pl-6">{children}</ol>,
  li: ({ children }) => <li className="mb-1">{children}</li>,
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="rounded-lg bg-black/40 px-2 py-1 text-red-300">
          {children}
        </code>
      );
    }
    // Block-level code is wrapped by `pre` below;
    // just pass children (with className, which carries the
    // "language-xxx" hint) through untouched here.
    return <code className={className}>{children}</code>;
  },
  pre: ({ children }) => {
    // `children` here is the <code> element produced above;
    // pull its raw text content + language out for CodeBlock.
    const codeElement = children;
    const codeContent = codeElement?.props?.children;
    const className = codeElement?.props?.className || "";
    const match = /language-(\w+)/.exec(className);
    const language = match ? match[1] : "text";

    return <CodeBlock language={language}>{codeContent}</CodeBlock>;
  },
  h1: ({ children }) => <h1 className="mb-3 text-3xl font-bold">{children}</h1>,
  h2: ({ children }) => <h2 className="mb-3 text-2xl font-bold">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-3 text-xl font-semibold">{children}</h3>,
};

export function MessageBubble({ message, isNewest }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${isNewest ? "animate-message-in" : ""} ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={
          isUser
            ? "max-w-[85%] rounded-3xl rounded-br-lg bg-gradient-to-r from-red-700 to-red-600 px-4 py-3 text-white shadow-lg shadow-red-900/20 sm:max-w-[520px] sm:px-5"
            : "max-w-[85%] rounded-3xl rounded-bl-lg border border-white/5 bg-[#111111] px-4 py-4 text-zinc-200 sm:max-w-[800px] sm:px-6 sm:py-5"
        }
      >
        {isUser ? (
          <>
            <p className="whitespace-pre-wrap leading-7">{message.content}</p>
            <CopyMessageButton content={message.content} variant="light" />
          </>
        ) : (
          <>
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={markdownComponents}
            >
              {message.content}
            </ReactMarkdown>
            <CopyMessageButton content={message.content} />
          </>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
