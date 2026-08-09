import React, { useEffect, useRef, useState } from "react";
import { Globe, Send, SquarePlay, X, ChevronDown, Sparkles } from "lucide-react";
import UploadDocumentButton from "../../pdf/components/UploadDocumentButton";
import SelectedDocumentChip from "../../pdf/components/SelectedDocumentChip";

const MODEL_OPTIONS = [
  { id: "gemini", label: "Gemini" },
  { id: "cohere", label: "Cohere" },
];

function ModelSelector({ modelChoice, setModelChoice, disabled }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeLabel = MODEL_OPTIONS.find((m) => m.id === modelChoice)?.label || "Gemini";

  return (
    <div className="relative shrink-0" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
        title="Choose model"
        className="flex items-center gap-1 rounded-full px-2 py-2 text-zinc-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:px-2.5 sm:py-2.5"
      >
        <Sparkles size={18} className="sm:hidden" />
        <Sparkles size={16} className="hidden sm:block" />
        <span className="hidden text-xs font-medium sm:inline">{activeLabel}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-36 overflow-hidden rounded-2xl border border-white/10 bg-[#111111] py-1 shadow-lg">
          {MODEL_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                setModelChoice(option.id);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition ${
                modelChoice === option.id
                  ? "bg-red-500/15 text-red-400"
                  : "text-zinc-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ChatInput({
  chatInput,
  setChatInput,
  webSearchOn,
  setWebSearchOn,
  modelChoice,
  setModelChoice,
  onSubmit,
  isLoading,
  selectedDocument,
  onDeselectDocument,
  uploadStatus,
  uploadProgress,
  uploadStageText,
  uploadError,
  onFileSelected,
  onInvalidFile,
  onResetUploadStatus,
  youtubeMode,
  onEnterYoutubeMode,
  onCancelYoutubeMode,
  addingYoutube,
  youtubeError,
  onResetYoutubeStatus,
  pendingManualTranscriptUrl,
  onCancelManualTranscript,
}) {
  return (
    <footer className="border-t border-white/5 bg-[#090909] p-4 sm:p-6">
      <SelectedDocumentChip
        documentName={selectedDocument?.originalName}
        onDeselect={onDeselectDocument}
      />

      {youtubeMode && (
        <div className="mx-auto mb-3 flex w-fit max-w-4xl items-center gap-2 rounded-full border border-red-700/30 bg-red-700/10 px-3 py-1.5 text-xs text-red-300 sm:text-sm">
          <SquarePlay size={14} className="shrink-0" />
          <span>Paste a YouTube link below to add it</span>
          <button
            type="button"
            onClick={onCancelYoutubeMode}
            title="Cancel"
            className="rounded-full p-0.5 text-red-400 transition hover:bg-red-500/20 hover:text-red-200"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {pendingManualTranscriptUrl && (
        <div className="mx-auto mb-3 flex w-fit max-w-4xl items-center gap-2 rounded-full border border-red-700/30 bg-red-700/10 px-3 py-1.5 text-xs text-red-300 sm:text-sm">
          <SquarePlay size={14} className="shrink-0" />
          <span>Couldn't fetch that video's transcript automatically — paste it below</span>
          <button
            type="button"
            onClick={onCancelManualTranscript}
            title="Cancel"
            className="rounded-full p-0.5 text-red-400 transition hover:bg-red-500/20 hover:text-red-200"
          >
            <X size={13} />
          </button>
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className={`mx-auto flex max-w-4xl items-center gap-2 rounded-full border bg-[#111111] pl-2 transition sm:gap-3 sm:pl-2.5 ${
          youtubeMode || pendingManualTranscriptUrl
            ? "border-red-600/60 focus-within:border-red-500"
            : "border-white/10 focus-within:border-red-600"
        }`}
      >
        <button
          type="button"
          onClick={() => setWebSearchOn((prev) => !prev)}
          title={webSearchOn ? "Web search on" : "Turn on web search"}
          disabled={youtubeMode || pendingManualTranscriptUrl}
          className={`flex shrink-0 items-center justify-center rounded-full p-2 transition sm:p-2.5 ${
            webSearchOn
              ? "bg-red-500/15 text-red-400"
              : "text-zinc-400 hover:bg-white/5 hover:text-white"
          } disabled:cursor-not-allowed disabled:opacity-40`}
        >
          <Globe size={18} className="sm:hidden" />
          <Globe size={20} className="hidden sm:block" />
        </button>

        <ModelSelector
          modelChoice={modelChoice}
          setModelChoice={setModelChoice}
          disabled={youtubeMode || pendingManualTranscriptUrl || isLoading}
        />

        <UploadDocumentButton
          onFileSelected={onFileSelected}
          onInvalidFile={onInvalidFile}
          uploadStatus={uploadStatus}
          uploadProgress={uploadProgress}
          uploadStageText={uploadStageText}
          uploadError={uploadError}
          onResetStatus={onResetUploadStatus}
          onYoutubeModeSelect={onEnterYoutubeMode}
          addingYoutube={addingYoutube}
          youtubeError={youtubeError}
          onResetYoutubeStatus={onResetYoutubeStatus}
        />

        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder={
            youtubeMode
              ? "Paste a YouTube video link..."
              : pendingManualTranscriptUrl
              ? "Paste the video transcript here..."
              : selectedDocument
              ? "Ask about this document..."
              : webSearchOn
              ? "Web search on"
              : "Ask me anything..."
          }
          disabled={isLoading}
          className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-zinc-500 disabled:opacity-50 sm:py-3 sm:text-base"
        />

        <button
          type="submit"
          disabled={!chatInput.trim() || isLoading}
          className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-4 py-2.5 font-semibold text-white transition hover:from-red-500 hover:to-red-400 disabled:cursor-not-allowed disabled:from-red-950 disabled:to-red-950 disabled:text-red-300/50 sm:px-6 sm:py-3"
        >
          {youtubeMode || pendingManualTranscriptUrl ? (
            <>
              <SquarePlay size={18} className="sm:hidden" />
              <span className="hidden sm:inline">Add</span>
            </>
          ) : (
            <>
              <Send size={18} className="sm:hidden" />
              <span className="hidden sm:inline">Send</span>
            </>
          )}
        </button>
      </form>
    </footer>
  );
}

export default ChatInput;