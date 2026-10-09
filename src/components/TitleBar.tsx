import React from 'react';
import {
  Save,
  RotateCcw,
  RotateCw,
  Printer,
  FolderOpen,
  Search,
  Share2,
  FileText,
  Check,
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
  canUndo: boolean;
  canRedo: boolean;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  docState,
  onSave,
  onUndo,
  onRedo,
  onPrint,
  onOpen,
  onSearchOpen,
  canUndo,
  canRedo,
}) => {
  return (
    <div className="word-titlebar">
      {/* Left side: Mac traffic light placeholder space & Quick Access Toolbar */}
      <div className="flex items-center gap-3 no-drag">
        {/* macOS traffic light spacer */}
        <div className="w-16 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:opacity-80 cursor-pointer" title="Close" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] hover:opacity-80 cursor-pointer" title="Minimize" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] hover:opacity-80 cursor-pointer" title="Zoom" />
        </div>

        {/* Quick Access Toolbar */}
        <div className="flex items-center gap-1 bg-black/15 px-2 py-0.5 rounded">
          <button
            onClick={onSave}
            className="p-1 hover:bg-white/20 rounded transition text-white"
            title="Save (Cmd+S)"
          >
            <Save size={14} />
          </button>
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1 rounded transition text-white ${
              canUndo ? 'hover:bg-white/20 cursor-pointer' : 'opacity-40 cursor-not-allowed'
            }`}
            title="Undo (Cmd+Z)"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1 rounded transition text-white ${
              canRedo ? 'hover:bg-white/20 cursor-pointer' : 'opacity-40 cursor-not-allowed'
            }`}
            title="Redo (Cmd+Y)"
          >
            <RotateCw size={14} />
          </button>
          <button
            onClick={onPrint}
            className="p-1 hover:bg-white/20 rounded transition text-white"
            title="Print (Cmd+P)"
          >
            <Printer size={14} />
          </button>
          <button
            onClick={onOpen}
            className="p-1 hover:bg-white/20 rounded transition text-white"
            title="Open Document (Cmd+O)"
          >
            <FolderOpen size={14} />
          </button>
        </div>
      </div>

      {/* Center: Document Title & Save Status Badge */}
      <div className="word-window-title">
        <FileText size={15} className="text-white/80" />
        <span className="font-semibold">{docState.title}</span>
        {docState.isDirty ? (
          <span className="save-status-pill save-status-dirty" title="Unsaved changes">
            Edited
          </span>
        ) : (
          <span className="save-status-pill save-status-saved flex items-center gap-1" title="All changes saved">
            <Check size={11} /> Saved
          </span>
        )}
      </div>

      {/* Right side: Search, Updates, Share, Controls */}
      <div className="flex items-center gap-2 no-drag">
        <button
          onClick={onSearchOpen}
          className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white/90 text-xs px-2.5 py-1 rounded transition"
          title="Search in document (Cmd+F)"
        >
          <Search size={13} />
          <span>Search</span>
        </button>
        <button
          onClick={() => (window as any).__openUpdateDialog?.()}
          className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white/90 text-xs px-2 py-1 rounded transition"
          title="Check for Updates"
        >
          <RotateCw size={12} />
          <span>Update</span>
        </button>
        <button
          onClick={() => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href);
              alert('Document reference copied to clipboard');
            }
          }}
          className="p-1.5 hover:bg-white/20 rounded transition text-white"
          title="Share Document"
        >
          <Share2 size={14} />
        </button>
      </div>
    </div>
  );
};
