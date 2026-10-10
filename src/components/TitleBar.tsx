import React, { useState } from 'react';
import {
  Save,
  RotateCcw,
  RotateCw,
  Printer,
  Search,
  Share2,
  FileText,
  ChevronDown,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { DocumentState } from '../types/document';

interface TitleBarProps {
  docState: DocumentState;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onPrint: () => void;
  onOpen: () => void;
  onSearchOpen: () => void;
  onToggleComments?: () => void;
  onRenameDocument?: (newTitle: string) => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  docState,
  onSave,
  onUndo,
  onRedo,
  onPrint,
  onSearchOpen,
  onToggleComments,
  onRenameDocument,
  canUndo,
  canRedo,
}) => {
  const [autoSave, setAutoSave] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(docState.title);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleInput.trim() && onRenameDocument) {
      onRenameDocument(titleInput.trim());
    }
  };

  return (
    <div className="word-titlebar h-[42px] bg-[#185ABD] text-white flex items-center justify-between px-3 select-none relative border-b border-black/15">
      {/* Left side: traffic light offset + AutoSave + Quick Access Toolbar */}
      <div className="flex items-center gap-2.5 no-drag">
        {/* macOS traffic light spacer (82px native area) */}
        <div className="w-[82px] shrink-0" />

        {/* Word AutoSave toggle */}
        <div
          onClick={() => setAutoSave(!autoSave)}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/15 hover:bg-black/25 text-white cursor-pointer select-none transition"
          title="AutoSave: Automatically save changes as you work"
        >
          <span className="text-[11px] font-medium tracking-tight">AutoSave</span>
          <div
            className={`w-6 h-3.5 rounded-full transition-colors flex items-center px-0.5 ${
              autoSave ? 'bg-[#34C759]' : 'bg-white/30'
            }`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full bg-white shadow-xs transition-transform ${
                autoSave ? 'translate-x-2.5' : 'translate-x-0'
              }`}
            />
          </div>
        </div>

        {/* Quick Access Toolbar */}
        <div className="flex items-center gap-0.5 bg-black/15 px-1 py-0.5 rounded">
          <button
            onClick={onSave}
            className="p-1 hover:bg-white/20 rounded transition text-white/95"
            title="Save (⌘S)"
          >
            <Save size={13} />
          </button>
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1 rounded transition text-white ${
              canUndo ? 'hover:bg-white/20 cursor-pointer text-white/95' : 'opacity-40 cursor-not-allowed text-white/50'
            }`}
            title="Undo (⌘Z)"
          >
            <RotateCcw size={13} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1 rounded transition text-white ${
              canRedo ? 'hover:bg-white/20 cursor-pointer text-white/95' : 'opacity-40 cursor-not-allowed text-white/50'
            }`}
            title="Redo (⌘Y)"
          >
            <RotateCw size={13} />
          </button>
          <button
            onClick={onPrint}
            className="p-1 hover:bg-white/20 rounded transition text-white/95"
            title="Print (⌘P)"
          >
            <Printer size={13} />
          </button>
        </div>
      </div>

      {/* Center: Document Title & Save Location */}
      <div className="word-window-title absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 no-drag">
        <FileText size={14} className="text-white/80 shrink-0" />
        {isEditingTitle ? (
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTitleSubmit();
              if (e.key === 'Escape') setIsEditingTitle(false);
            }}
            autoFocus
            className="bg-white text-gray-900 text-xs px-2 py-0.5 rounded font-medium outline-none w-48 text-center"
          />
        ) : (
          <div
            onClick={() => setIsEditingTitle(true)}
            className="flex items-center gap-1 cursor-pointer hover:bg-white/10 px-2 py-0.5 rounded transition"
            title="Click to rename document"
          >
            <span className="font-semibold text-xs tracking-tight">{docState.title}</span>
            <ChevronDown size={11} className="text-white/70" />
          </div>
        )}

        <span className="text-[11px] text-white/75 font-normal tracking-tight">
          {docState.isDirty ? (
            <span className="flex items-center gap-1 text-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
              Edited
            </span>
          ) : (
            '· Saved to this Mac'
          )}
        </span>
      </div>

      {/* Right side: Search Pill + Comments + Share + Avatar */}
      <div className="flex items-center gap-2 no-drag">
        {/* Search capsule */}
        <div
          onClick={onSearchOpen}
          className="flex items-center gap-1.5 bg-black/20 hover:bg-black/30 text-white/90 text-xs px-3 py-1 rounded-full cursor-pointer transition w-44"
          title="Search in document (⌘F)"
        >
          <Search size={12} className="text-white/70" />
          <span className="text-white/75 text-[11px]">Search (⌘F)</span>
        </div>

        {/* Comments button */}
        {onToggleComments && (
          <button
            onClick={onToggleComments}
            className="relative p-1.5 hover:bg-white/20 rounded transition text-white/95"
            title="Comments (⌘⌥M)"
          >
            <MessageSquare size={14} />
            {docState.comments && docState.comments.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {docState.comments.length}
              </span>
            )}
          </button>
        )}

        {/* Share Button */}
        <button
          onClick={() => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href);
              alert('Document reference copied to clipboard');
            }
          }}
          className="flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white text-[11px] font-medium px-2.5 py-1 rounded transition"
          title="Share Document"
        >
          <Share2 size={12} />
          <span>Share</span>
        </button>

        {/* Update Button */}
        <button
          onClick={() => (window as any).__openUpdateDialog?.()}
          className="flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white text-[11px] font-medium px-2 py-1 rounded transition"
          title="Check for Updates"
        >
          <Sparkles size={12} className="text-amber-300" />
          <span>Update</span>
        </button>

        {/* User initials circle */}
        <div
          className="w-6 h-6 rounded-full bg-[#103F91] border border-white/40 text-[10px] font-semibold flex items-center justify-center text-white cursor-pointer select-none"
          title="WordForge Account: Tonmoy Sarker"
        >
          TS
        </div>
      </div>
    </div>
  );
};
