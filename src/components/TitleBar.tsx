import React, { useState } from 'react';
import {
  Save,
  RotateCcw,
  RotateCw,
  Printer,
  Search,
  Share2,
  ChevronDown,
  MessageSquare,
  Sparkles,
  FileText,
  MoreHorizontal,
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
    <div className="word-titlebar">
      {/* Left side: traffic light offset + AutoSave + Quick Access Toolbar */}
      <div className="flex items-center gap-2 no-drag">
        {/* macOS traffic light spacer (76px native area) */}
        <div className="w-[76px] shrink-0" />

        {/* Word AutoSave toggle */}
        <div
          onClick={() => setAutoSave(!autoSave)}
          className="flex items-center gap-1.5 px-1.5 py-0.5 rounded cursor-pointer select-none hover:bg-black/5 transition"
          title="AutoSave: Automatically save changes to disk"
        >
          <span className="text-[11.5px] font-medium text-[#201F1E] tracking-tight">AutoSave</span>
          <div
            className={`w-[28px] h-[15px] rounded-full transition-colors flex items-center px-0.5 ${
              autoSave ? 'bg-[#0F6CBD]' : 'bg-[#C8C6C4]'
            }`}
          >
            <div
              className={`w-[11px] h-[11px] rounded-full bg-white shadow-xs transition-transform ${
                autoSave ? 'translate-x-[13px]' : 'translate-x-0'
              }`}
            />
          </div>
        </div>

        {/* Quick Access Toolbar (Floppy, Undo, Redo, Print, More) */}
        <div className="flex items-center gap-0.5 ml-1">
          <button
            onClick={onSave}
            className="qat-button"
            title="Save (⌘S)"
          >
            <Save size={14} />
          </button>
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="qat-button"
            title="Undo (⌘Z)"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="qat-button"
            title="Redo (⌘Y)"
          >
            <RotateCw size={14} />
          </button>
          <button
            onClick={onPrint}
            className="qat-button"
            title="Print (⌘P)"
          >
            <Printer size={14} />
          </button>
          <button
            onClick={() => (window as any).__openPageSetup?.()}
            className="qat-button text-[#616161]"
            title="More Options"
          >
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      {/* Center: Document Title & Save Location */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 no-drag">
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
            className="bg-white text-[#201F1E] text-xs px-2 py-0.5 rounded border border-[#0F6CBD] font-medium outline-none w-48 text-center"
          />
        ) : (
          <div
            onClick={() => setIsEditingTitle(true)}
            className="flex items-center gap-1 cursor-pointer hover:bg-black/5 px-1.5 py-0.5 rounded transition"
            title="Click to rename document"
          >
            <span className="font-semibold text-[13px] text-[#201F1E] tracking-tight">{docState.title}</span>
            <ChevronDown size={11} className="text-[#616161]" />
          </div>
        )}

        <span className="text-[11px] text-[#616161] font-normal tracking-tight">
          {docState.isDirty ? (
            <span className="flex items-center gap-1 text-[#C53929]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C53929]" />
              Edited
            </span>
          ) : (
            '· Saved to this Mac'
          )}
        </span>
      </div>

      {/* Right side: Search Capsule + Comments + Update + Share + Avatar */}
      <div className="flex items-center gap-1.5 no-drag">
        {/* Search capsule */}
        <div
          onClick={onSearchOpen}
          className="flex items-center gap-2 bg-[#EAEAED] hover:bg-white hover:border-[#D1D1D6] border border-transparent text-[#616161] text-xs px-3 py-1 rounded-full cursor-pointer transition w-44 shadow-2xs"
          title="Search in document (⌘F)"
        >
          <Search size={12} className="text-[#616161]" />
          <span className="text-[#616161] text-[11px] font-normal">Search (⌘F)</span>
        </div>

        {/* Comments button */}
        {onToggleComments && (
          <button
            onClick={onToggleComments}
            className="relative p-1 hover:bg-black/5 rounded transition text-[#424242]"
            title="Comments (⌘⌥M)"
          >
            <MessageSquare size={15} />
            {docState.comments && docState.comments.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#0F6CBD] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {docState.comments.length}
              </span>
            )}
          </button>
        )}

        {/* Update Button */}
        <button
          onClick={() => (window as any).__openUpdateDialog?.()}
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-black/5 text-[#424242] text-[11px] font-medium transition"
          title="Check for Updates"
        >
          <Sparkles size={13} className="text-amber-500" />
          <span>Update</span>
        </button>

        {/* Share Button (Word Blue Pill) */}
        <button
          onClick={() => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href);
              alert('Document link copied to clipboard.');
            }
          }}
          className="flex items-center gap-1 bg-[#0F6CBD] hover:bg-[#115EA3] active:bg-[#0C3B5E] text-white text-[11.5px] font-medium px-3 py-1 rounded-[4px] shadow-2xs transition"
          title="Share Document"
        >
          <Share2 size={12} />
          <span>Share</span>
          <ChevronDown size={10} className="opacity-80" />
        </button>

        {/* User initials avatar circle */}
        <div
          className="w-6 h-6 rounded-full bg-[#0F6CBD] text-[10px] font-semibold flex items-center justify-center text-white cursor-pointer select-none ml-1 shadow-2xs"
          title="Account: Tonmoy Sarker"
        >
          TS
        </div>
      </div>
    </div>
  );
};
