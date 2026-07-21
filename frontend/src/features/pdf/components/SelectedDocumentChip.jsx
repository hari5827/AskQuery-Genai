import React from "react";
import { FileText, X } from "lucide-react";

export function SelectedDocumentChip({ documentName, onDeselect }) {
  if (!documentName) return null;

  return (
    <div className="mx-auto mb-3 flex w-fit max-w-4xl items-center gap-2 rounded-full border border-red-700/30 bg-red-700/10 px-3 py-1.5 text-xs text-red-300 sm:text-sm">
      <FileText size={14} className="shrink-0" />
      <span className="max-w-[200px] truncate sm:max-w-xs">{documentName}</span>
      <button
        type="button"
        onClick={onDeselect}
        title="Remove document"
        className="rounded-full p-0.5 text-red-400 transition hover:bg-red-500/20 hover:text-red-200"
      >
        <X size={13} />
      </button>
    </div>
  );
}

export default SelectedDocumentChip;
