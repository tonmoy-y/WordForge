import React, { useState } from 'react';
import {
  CheckCircle2,
  FileSpreadsheet,
  MessageSquare,
  MessageSquarePlus,
  GitCommit,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  GitCompare,
  Eye,
  Sliders,
} from 'lucide-react';
import { Editor } from '@tiptap/react';
import { TrackChangeItem } from '../../../types/document';
import { TrackChangesEngine } from '../../../core/review/trackChangesEngine';

interface ReviewTabProps {
  editor: Editor | null;
  trackChangesEnabled: boolean;
  onToggleTrackChanges: () => void;
  markupMode: 'all' | 'simple' | 'none' | 'original';
  onSetMarkupMode: (mode: 'all' | 'simple' | 'none' | 'original') => void;
  trackChanges: TrackChangeItem[];
  onUpdateTrackChanges: (changes: TrackChangeItem[]) => void;
  onOpenSpellCheck: () => void;
  onOpenWordCount: () => void;
  onNewComment: () => void;
  onToggleCommentsPane: () => void;
  onToggleTrackPane: () => void;
}

export const ReviewTab: React.FC<ReviewTabProps> = ({
  editor,
  trackChangesEnabled,
  onToggleTrackChanges,
  markupMode,
  onSetMarkupMode,
  trackChanges,
  onUpdateTrackChanges,
  onOpenSpellCheck,
  onOpenWordCount,
  onNewComment,
  onToggleCommentsPane,
  onToggleTrackPane,
}) => {
  const [showMarkupMenu, setShowMarkupMenu] = useState(false);

  const pendingChanges = TrackChangesEngine.getPendingChanges(trackChanges);

  const handleAcceptAll = () => {
    onUpdateTrackChanges(TrackChangesEngine.acceptAllChanges(trackChanges));
    alert('Accepted all document revisions.');
  };

  const handleRejectAll = () => {
    onUpdateTrackChanges(TrackChangesEngine.rejectAllChanges(trackChanges));
    alert('Rejected all document revisions.');
  };

  return (
    <div className="word-ribbon-panel">
      {/* 1. Proofing */}
      <div className="word-ribbon-group">
        <div className="word-group-content">
          <button onClick={onOpenSpellCheck} className="ribbon-btn-large" title="Spelling & Grammar Check (F7)">
            <CheckCircle2 size={22} className="text-[#107C41]" />
            <span>Spelling</span>
          </button>
          <button onClick={onOpenWordCount} className="ribbon-btn-large" title="Document Word & Character Count">
            <FileSpreadsheet size={22} className="text-[#185ABD]" />
            <span>Word Count</span>
          </button>
        </div>
        <div className="word-group-label">Proofing</div>
      </div>

      <div className="word-group-separator" />

      {/* 2. Comments */}
      <div className="word-ribbon-group">
        <div className="word-group-content">
          <button onClick={onNewComment} className="ribbon-btn-large" title="New Comment on current selection">
            <MessageSquarePlus size={22} className="text-[#742774]" />
            <span>New Comment</span>
          </button>
          <button onClick={onToggleCommentsPane} className="ribbon-btn-large" title="Show/Hide Comments Sidebar">
            <MessageSquare size={22} className="text-[#2B579A]" />
            <span>Comments</span>
          </button>
        </div>
        <div className="word-group-label">Comments</div>
      </div>

      <div className="word-group-separator" />

      {/* 3. Tracking */}
      <div className="word-ribbon-group">
        <div className="flex flex-col gap-1.5 flex-1 justify-center">
          <button
            onClick={onToggleTrackChanges}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs border ${
              trackChangesEnabled ? 'bg-red-50 text-red-700 border-red-400 font-semibold' : 'bg-white border-gray-300'
            }`}
            title="Track Changes (Cmd+Shift+E)"
          >
            <GitCommit size={14} className={trackChangesEnabled ? 'text-red-600' : 'text-gray-500'} />
            <span>Track Changes: {trackChangesEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Display for Review */}
          <div className="relative">
            <button
              onClick={() => setShowMarkupMenu(!showMarkupMenu)}
              className="flex items-center gap-1 text-xs border border-gray-300 rounded px-2 py-0.5 bg-white w-32 justify-between"
              title="Display for Review Mode"
            >
              <span>
                {markupMode === 'all'
                  ? 'All Markup'
                  : markupMode === 'simple'
                  ? 'Simple Markup'
                  : markupMode === 'none'
                  ? 'No Markup'
                  : 'Original'}
              </span>
              <Eye size={12} />
            </button>
            {showMarkupMenu && (
              <div className="absolute top-6 left-0 bg-white border border-gray-300 rounded shadow-lg p-1 z-50 w-36 text-xs">
                {(['all', 'simple', 'none', 'original'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      onSetMarkupMode(mode);
                      setShowMarkupMenu(false);
                    }}
                    className={`w-full text-left px-2 py-1 rounded ${
                      markupMode === mode ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-100'
                    }`}
                  >
                    {mode === 'all'
                      ? 'All Markup'
                      : mode === 'simple'
                      ? 'Simple Markup'
                      : mode === 'none'
                      ? 'No Markup'
                      : 'Original'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="word-group-label">Tracking</div>
      </div>

      <div className="word-group-separator" />

      {/* 4. Changes (Accept / Reject) */}
      <div className="word-ribbon-group">
        <div className="flex flex-col gap-1 flex-1 justify-center">
          <div className="flex items-center gap-1">
            <button
              onClick={handleAcceptAll}
              disabled={pendingChanges.length === 0}
              className="px-2 py-1 bg-green-50 hover:bg-green-100 text-green-700 border border-green-300 rounded text-xs flex items-center gap-1"
              title="Accept All Revisions"
            >
              <Check size={12} />
              <span>Accept All</span>
            </button>
            <button
              onClick={handleRejectAll}
              disabled={pendingChanges.length === 0}
              className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 rounded text-xs flex items-center gap-1"
              title="Reject All Revisions"
            >
              <X size={12} />
              <span>Reject All</span>
            </button>
          </div>

          <button
            onClick={onToggleTrackPane}
            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
          >
            <Sliders size={12} />
            <span>Reviewing Pane ({pendingChanges.length})</span>
          </button>
        </div>
        <div className="word-group-label">Changes</div>
      </div>
    </div>
  );
};
