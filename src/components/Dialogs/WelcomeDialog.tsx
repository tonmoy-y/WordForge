import React from 'react';
import { X, FileText, FolderOpen, Clock, Sparkles } from 'lucide-react';
import { TEMPLATES } from '../../core/documentModel';
import { StorageService, RecentDocItem } from '../../core/persistence/storage';

interface WelcomeDialogProps {
  onNewFromTemplate: (title: string, html: string) => void;
  onOpenExisting: () => void;
  onClose: () => void;
}

export const WelcomeDialog: React.FC<WelcomeDialogProps> = ({
  onNewFromTemplate,
  onOpenExisting,
  onClose,
}) => {
  const recents: RecentDocItem[] = StorageService.getRecentDocuments();

  return (
    <div className="word-dialog-overlay" onClick={onClose}>
      <div className="word-dialog-box w-[680px] max-w-[95vw]" onClick={(e) => e.stopPropagation()}>
        {/* Header with Word brand styling */}
        <div className="bg-[#185ABD] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xl shadow-xs">
              W
            </div>
            <div>
              <div className="text-lg font-bold">WordForge Pro for macOS</div>
              <div className="text-xs text-white/80">Microsoft Word-class Document Processor</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded transition text-white">
            <X size={18} />
          </button>
        </div>

        <div className="word-dialog-content flex flex-col gap-5 p-5 text-xs">
          {/* Templates Section */}
          <div>
            <div className="flex items-center gap-1.5 font-semibold text-gray-800 text-sm mb-3">
              <Sparkles size={15} className="text-[#185ABD]" />
              <span>Create New Document</span>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => onNewFromTemplate(tmpl.title, tmpl.html)}
                  className="border border-gray-200 hover:border-blue-500 hover:shadow-md rounded-lg p-3 bg-white cursor-pointer transition flex flex-col group text-left"
                >
                  <div className="w-full h-24 bg-gray-50 border border-gray-100 rounded mb-2 flex items-center justify-center group-hover:bg-blue-50/50 transition">
                    <FileText size={28} className="text-gray-400 group-hover:text-blue-600 transition" />
                  </div>
                  <div className="font-semibold text-gray-800 group-hover:text-blue-700 mb-0.5">
                    {tmpl.title}
                  </div>
                  <div className="text-[10px] text-gray-500 line-clamp-2">
                    {tmpl.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Open / Recent Documents */}
          <div className="border-t border-gray-200 pt-4 flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5 font-semibold text-gray-800 text-sm">
                <Clock size={15} className="text-gray-500" />
                <span>Recent Documents</span>
              </div>
              <button
                onClick={onOpenExisting}
                className="flex items-center gap-1.5 text-xs text-blue-700 hover:underline font-medium"
              >
                <FolderOpen size={13} />
                <span>Browse Files…</span>
              </button>
            </div>

            {recents.length === 0 ? (
              <div className="text-xs text-gray-400 italic py-2">
                No recently opened documents.
              </div>
            ) : (
              <div className="flex flex-col gap-1 max-h-36 overflow-y-auto">
                {recents.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      alert(`Opening document '${r.title}'`);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2 hover:bg-blue-50 rounded cursor-pointer border border-transparent hover:border-blue-100 transition"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-blue-600" />
                      <span className="font-medium text-gray-800">{r.title}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {new Date(r.lastOpened).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="word-dialog-footer bg-gray-50">
          <button onClick={onOpenExisting} className="btn-secondary flex items-center gap-1.5">
            <FolderOpen size={13} />
            <span>Open from Mac…</span>
          </button>
          <button
            onClick={() => onNewFromTemplate('Document 1', '<p></p>')}
            className="btn-primary"
          >
            Blank Document
          </button>
        </div>
      </div>
    </div>
  );
};
