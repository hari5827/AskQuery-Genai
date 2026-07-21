import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { CodeBlock } from "./CodeBlock";
import { CopyMessageButton } from "./CopyMessageButton";

const markdownComponents = {
  p: ({ children }) => <p className="mb-4 leading-7 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-4 list-disc space-y-1.5 pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 list-decimal space-y-1.5 pl-6">{children}</ol>,
  li: ({ children }) => <li className="leading-7">{children}</li>,
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

// Shows the pages the AI actually pulled from a web search, as
// small pill-style links. Each hover turns a soft light-red.
function SourcesList({ sources }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-4 border-t border-white/5 pt-3">
      <p className="mb-2 text-xs uppercase tracking-wide text-zinc-500">
        Sources
      </p>
      <div className="flex flex-wrap gap-2">
        {sources.map((source, index) => {
          let hostname = source.url;
          try {
            hostname = new URL(source.url).hostname.replace("www.", "");
          } catch (err) {
            // keep the raw url as a fallback label
          }

          return (
            <a
              key={index}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              title={source.title}
              className="max-w-[220px] truncate rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-400 transition hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-300"
            >
              {index + 1}. {hostname}
            </a>
          );
        })}
      </div>
    </div>
  );
}

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
            ? "max-w-[85%] rounded-3xl rounded-br-lg bg-gradient-to-r from-red-700 to-red-600 px-5 py-3.5 text-white shadow-lg shadow-red-900/20 sm:max-w-[520px] sm:px-6"
            : "max-w-[85%] rounded-3xl rounded-bl-lg border border-white/5 bg-[#111111] px-5 py-5 text-zinc-200 sm:max-w-[800px] sm:px-7 sm:py-6"
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
            <SourcesList sources={message.sources} />
            <CopyMessageButton content={message.content} />
          </>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;

