import React from "react";
import { FileText, Trash2 } from "lucide-react";

export function DocumentsList({
  documents,
  selectedDocumentId,
  onSelectDocument,
  onRequestDeleteDocument,
}) {
  const documentList = Object.values(documents);

  return (
    <div className="mt-8">
      <p className="mb-4 text-xs uppercase tracking-[2px] text-zinc-500">
        Documents
      </p>

      {documentList.length === 0 ? (
        <p className="px-1 text-xs text-zinc-600">No documents uploaded yet.</p>
      ) : (
        <div className="space-y-2.5">
          {documentList.map((doc) => (
            <div key={doc.id} className="group relative">
              <button
                onClick={() => onSelectDocument(doc.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-3.5 pr-9 text-left transition-all duration-200 ${
                  selectedDocumentId === doc.id
                    ? "border border-red-700/30 bg-red-700/10"
                    : "hover:bg-white/5"
                }`}
              >
                <FileText size={16} className="shrink-0 text-zinc-500" />

                <div className="overflow-hidden">
                  <p className="truncate text-sm font-medium">
                    {doc.originalName}
                  </p>

                  <p className="truncate text-xs capitalize text-zinc-500">
                    {doc.status}
                  </p>
                </div>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestDeleteDocument(doc.id);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100"
              >
                <Trash2 size={15} className="text-zinc-500 hover:text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DocumentsList;
