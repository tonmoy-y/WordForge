import React from 'react';
import {
  BookOpen,
  FileText,
  Globe,
  Maximize2,
  CheckCircle,
  Minus,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { DocumentState } from '../types/document';
import { calculateTextStatistics } from '../core/documentModel';

interface StatusBarProps {
  docState: DocumentState;
  onSetViewMode: (mode: 'print' | 'web' | 'read' | 'focus') => void;
  onSetZoom: (zoom: number) => void;
  onOpenWordCount: () => void;
  onOpenSpellCheck: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  docState,
  onSetViewMode,
  onSetZoom,
  onOpenWordCount,
  onOpenSpellCheck,
}) => {
  const stats = calculateTextStatistics(docState.htmlContent);
  const totalPages = docState.metadata.pageCount || 1;

  return (
    <div className="word-statusbar">
      {/* Left side: Page, Words, Proofing, Language, Accessibility */}
      <div className="flex items-center gap-1.5">
        <div className="word-status-item" title="Current Page (Click to navigate)">
          <span>Page 1 of {totalPages}</span>
        </div>

        <div className="word-status-item" onClick={onOpenWordCount} title="Word Count Details">
          <span>{stats.words.toLocaleString()} words</span>
        </div>

        {/* Proofing indicator */}
        <div className="word-status-item" onClick={onOpenSpellCheck} title="Proofing status: No spelling or grammar errors">
          <CheckCircle size={12} className="text-[#107C41]" />
          <span>English (United States)</span>
        </div>

        {/* Accessibility indicator */}
        <div className="word-status-item text-[#605E5C]" title="Accessibility: Good to go">
          <ShieldCheck size={12} className="text-[#107C41]" />
          <span>Accessibility: Good to go</span>
        </div>
      </div>

      {/* Right side: Focus mode + View modes & Zoom controls */}
      <div className="flex items-center gap-2.5">
        {/* Focus Mode button */}
        <button
          onClick={() => onSetViewMode(docState.viewMode === 'focus' ? 'print' : 'focus')}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] transition ${
            docState.viewMode === 'focus'
              ? 'bg-[#EFF6FC] text-[#0F6CBD] font-semibold'
              : 'text-[#424242] hover:bg-black/5'
          }`}
          title="Focus Mode"
        >
          <Maximize2 size={11} />
          <span>Focus</span>
        </button>

        <div className="w-px h-3.5 bg-[#D1D1D6]" />

        {/* View Mode Buttons */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onSetViewMode('read')}
            className={`p-1 rounded transition ${
              docState.viewMode === 'read' ? 'bg-[#EFF6FC] text-[#0F6CBD]' : 'text-[#616161] hover:bg-black/5'
            }`}
            title="Read Mode"
          >
            <BookOpen size={13} />
          </button>
          <button
            onClick={() => onSetViewMode('print')}
            className={`p-1 rounded transition ${
              docState.viewMode === 'print' ? 'bg-[#EFF6FC] text-[#0F6CBD]' : 'text-[#616161] hover:bg-black/5'
            }`}
            title="Print Layout"
          >
            <FileText size={13} />
          </button>
          <button
            onClick={() => onSetViewMode('web')}
            className={`p-1 rounded transition ${
              docState.viewMode === 'web' ? 'bg-[#EFF6FC] text-[#0F6CBD]' : 'text-[#616161] hover:bg-black/5'
            }`}
            title="Web Layout"
          >
            <Globe size={13} />
          </button>
        </div>

        <div className="w-px h-3.5 bg-[#D1D1D6]" />

        {/* Zoom Slider */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSetZoom(Math.max(10, docState.zoomLevel - 10))}
            className="p-0.5 rounded hover:bg-black/5 text-[#424242]"
            title="Zoom Out"
          >
            <Minus size={11} />
          </button>
          <input
            type="range"
            min="10"
            max="500"
            step="5"
            value={docState.zoomLevel}
            onChange={(e) => onSetZoom(Number(e.target.value))}
            className="w-20 h-1 bg-[#D1D1D6] rounded appearance-none cursor-pointer accent-[#0F6CBD]"
          />
          <button
            onClick={() => onSetZoom(Math.min(500, docState.zoomLevel + 10))}
            className="p-0.5 rounded hover:bg-black/5 text-[#424242]"
            title="Zoom In"
          >
            <Plus size={11} />
          </button>
          <span
            onClick={() => onSetZoom(100)}
            className="text-[11px] font-sans text-[#424242] cursor-pointer hover:underline w-10 text-right select-none"
            title="Click to reset zoom to 100%"
          >
            {docState.zoomLevel}%
          </span>
        </div>
      </div>
    </div>
  );
};
