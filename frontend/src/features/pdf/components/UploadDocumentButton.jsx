import React, { useEffect, useRef, useState } from "react";
import { Plus, FileUp, Loader2, CheckCircle2, XCircle } from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export function UploadDocumentButton({
  onFileSelected,
  onInvalidFile,
  uploadStatus,
  uploadProgress,
  uploadStageText,
  uploadError,
  onResetStatus,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  // Close the dropdown when clicking outside it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-clear the success/error badge after a few seconds
  useEffect(() => {
    if (uploadStatus === "success" || uploadStatus === "error") {
      const timer = setTimeout(() => onResetStatus(), 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadStatus, onResetStatus]);

  const isBusy = uploadStatus === "uploading" || uploadStatus === "processing";

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file next time
    if (!file) return;

    if (file.type !== "application/pdf") {
      onInvalidFile("Only PDF files are allowed.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      onInvalidFile("File size should not exceed 10 MB.");
      return;
    }

    onFileSelected(file);
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((prev) => !prev)}
        title="Add"
        disabled={isBusy}
        className={`flex shrink-0 items-center justify-center rounded-full p-2 transition sm:p-2.5 ${
          menuOpen
            ? "bg-red-500/15 text-red-400"
            : "text-zinc-400 hover:bg-white/5 hover:text-white"
        } disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {isBusy ? (
          <>
            <Loader2 size={18} className="animate-spin sm:hidden" />
            <Loader2 size={20} className="hidden animate-spin sm:block" />
          </>
        ) : (
          <>
            <Plus size={18} className="sm:hidden" />
            <Plus size={20} className="hidden sm:block" />
          </>
        )}
      </button>

      {menuOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-48 overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-xl">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              fileInputRef.current?.click();
            }}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-zinc-300 transition hover:bg-red-700/10 hover:text-red-500"
          >
            <FileUp size={15} />
            Upload PDF
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {!menuOpen && uploadStatus === "uploading" && (
        <div className="absolute bottom-full left-0 mb-2 w-56 rounded-2xl border border-white/10 bg-[#111111] px-3.5 py-3 shadow-xl">
          <p className="mb-2 text-xs text-zinc-300">{uploadStageText || "Uploading PDF..."}</p>
          <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-700 to-red-500 transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className="text-[11px] tabular-nums text-zinc-500">{uploadProgress}%</span>
          </div>
        </div>
      )}

      {!menuOpen && uploadStatus === "processing" && (
        <div className="absolute bottom-full left-0 mb-2 flex w-56 items-center gap-2 whitespace-nowrap rounded-2xl border border-white/10 bg-[#111111] px-3.5 py-3 text-xs text-zinc-300 shadow-xl">
          <Loader2 size={13} className="shrink-0 animate-spin text-red-400" />
          {uploadStageText}
        </div>
      )}

      {!menuOpen && uploadStatus === "success" && (
        <div className="absolute bottom-full left-0 mb-2 flex items-center gap-1.5 whitespace-nowrap rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400">
          <CheckCircle2 size={13} />
          {uploadStageText || "Ready!"}
        </div>
      )}

      {!menuOpen && uploadStatus === "error" && uploadError && (
        <div className="absolute bottom-full left-0 mb-2 flex items-center gap-1.5 whitespace-nowrap rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-400">
          <XCircle size={13} />
          {uploadError}
        </div>
      )}
    </div>
  );
}

export default UploadDocumentButton;
