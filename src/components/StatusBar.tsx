import React from 'react';
import {
  BookOpen,
  FileText,
  Globe,
  Maximize2,
  CheckCircle,
  AlertCircle,
  Minus,
  Plus,
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
      {/* Left side: Page, Words, Language, Proofing */}
      <div className="flex items-center gap-2">
        <div className="word-status-item" title="Current Page (Click to navigate)">
          <span>Page 1 of {totalPages}</span>
        </div>

        <div className="word-status-item" onClick={onOpenWordCount} title="Word Count Details">
          <span>{stats.words.toLocaleString()} words</span>
        </div>

        <div className="word-status-item" onClick={onOpenSpellCheck} title="Proofing Status">
          <CheckCircle size={12} className="text-emerald-600" />
          <span>English (US)</span>
        </div>
      </div>

      {/* Right side: View modes & Zoom controls */}
      <div className="flex items-center gap-3">
        {/* View Mode Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onSetViewMode('read')}
            className={`p-1 rounded hover:bg-gray-200 transition ${
              docState.viewMode === 'read' ? 'bg-gray-200 text-blue-700' : 'text-gray-600'
            }`}
            title="Read Mode"
          >
            <BookOpen size={13} />
          </button>
          <button
            onClick={() => onSetViewMode('print')}
            className={`p-1 rounded hover:bg-gray-200 transition ${
              docState.viewMode === 'print' ? 'bg-gray-200 text-blue-700' : 'text-gray-600'
            }`}
            title="Print Layout"
          >
            <FileText size={13} />
          </button>
          <button
            onClick={() => onSetViewMode('web')}
            className={`p-1 rounded hover:bg-gray-200 transition ${
              docState.viewMode === 'web' ? 'bg-gray-200 text-blue-700' : 'text-gray-600'
            }`}
            title="Web Layout"
          >
            <Globe size={13} />
          </button>
        </div>

        {/* Zoom Slider */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSetZoom(Math.max(10, docState.zoomLevel - 10))}
            className="p-0.5 rounded hover:bg-gray-200 text-gray-600"
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
            className="w-20 h-1 bg-gray-300 rounded appearance-none cursor-pointer accent-[#185ABD]"
          />
          <button
            onClick={() => onSetZoom(Math.min(500, docState.zoomLevel + 10))}
            className="p-0.5 rounded hover:bg-gray-200 text-gray-600"
            title="Zoom In"
          >
            <Plus size={11} />
          </button>
          <span
            onClick={() => onSetZoom(100)}
            className="text-[11px] font-mono text-gray-600 cursor-pointer hover:underline w-10 text-right"
            title="Click to reset to 100%"
          >
            {docState.zoomLevel}%
          </span>
        </div>
      </div>
    </div>
  );
};
