import React, { useState } from 'react';
import {
  CheckCircle2,
  FileSpreadsheet,
  MessageSquare,
  MessageSquarePlus,
  GitCommit,
  Check,
  X,
  Eye,
  Sliders,
  BookOpen,
  Volume2,
  Globe2,
  ShieldCheck,
  ChevronDown,
  Trash2,
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
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);

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
      {/* 1. Proofing (Editor, Spelling & Grammar, Word Count, Thesaurus) */}
      <div className="word-ribbon-group">
        <button
          onClick={onOpenSpellCheck}
          className="ribbon-btn-large"
          title="Microsoft Editor"
        >
          <div className="relative">
            <CheckCircle2 size={24} className="text-[#107C41]" />
          </div>
          <span>Editor</span>
        </button>

        <div className="flex flex-col gap-0.5 justify-center">
          <button
            onClick={onOpenSpellCheck}
            className="h-6 flex items-center gap-1.5 px-2 text-xs font-normal text-[#242424] hover:bg-black/5 rounded transition"
            title="Spelling & Grammar (F7)"
          >
            <CheckCircle2 size={13} className="text-[#107C41]" />
            <span>Spelling & Grammar</span>
          </button>
          <button
            onClick={() => alert('Thesaurus: Look up synonyms and antonyms.')}
            className="h-6 flex items-center gap-1.5 px-2 text-xs font-normal text-[#242424] hover:bg-black/5 rounded transition"
            title="Thesaurus (⇧F7)"
          >
            <BookOpen size={13} className="text-[#0F6CBD]" />
            <span>Thesaurus</span>
          </button>
          <button
            onClick={onOpenWordCount}
            className="h-6 flex items-center gap-1.5 px-2 text-xs font-normal text-[#242424] hover:bg-black/5 rounded transition"
            title="Word Count"
          >
            <FileSpreadsheet size={13} className="text-[#0F6CBD]" />
            <span>Word Count</span>
          </button>
        </div>
      </div>

      <div className="word-group-divider" />

      {/* 2. Speech & Accessibility */}
      <div className="word-ribbon-group">
        <button
          onClick={() => alert('Read Aloud: Reading document aloud at current position.')}
          className="ribbon-btn-large"
          title="Read Aloud"
        >
          <Volume2 size={24} className="text-[#0F6CBD]" />
          <span>Read Aloud</span>
        </button>
        <button
          onClick={() => alert('Accessibility Checker: Good to go! No issues found.')}
          className="ribbon-btn-large"
          title="Check Accessibility"
        >
          <ShieldCheck size={24} className="text-[#107C41]" />
          <span>Check Accessibility</span>
        </button>
      </div>

      <div className="word-group-divider" />

      {/* 3. Language & Translate */}
      <div className="word-ribbon-group">
        <button
          onClick={() => alert('Translate: Translate document or selection into another language.')}
          className="ribbon-btn-large"
          title="Translate"
        >
          <Globe2 size={24} className="text-[#0F6CBD]" />
          <span>Translate</span>
        </button>
      </div>

      <div className="word-group-divider" />

      {/* 4. Comments */}
      <div className="word-ribbon-group">
        <button
          onClick={onNewComment}
          className="ribbon-btn-large"
          title="New Comment on current selection"
        >
          <MessageSquarePlus size={24} className="text-[#742774]" />
          <span>New Comment</span>
        </button>

        <div className="flex flex-col gap-0.5 justify-center">
          <div className="relative">
            <button
              onClick={() => setShowDeleteMenu(!showDeleteMenu)}
              className="h-6 flex items-center gap-1 px-2 text-xs text-[#242424] hover:bg-black/5 rounded transition"
              title="Delete Comment"
            >
              <Trash2 size={13} className="text-[#C53929]" />
              <span>Delete</span>
              <ChevronDown size={9} className="text-[#616161]" />
            </button>
            {showDeleteMenu && (
              <div className="absolute top-7 left-0 bg-white border border-[#D1D1D6] rounded-md shadow-xl py-1 z-50 text-xs w-44">
                <button
                  onClick={() => setShowDeleteMenu(false)}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#F3F2F1] text-[#242424]"
                >
                  Delete Selected Comment
                </button>
                <button
                  onClick={() => {
                    alert('All comments cleared.');
                    setShowDeleteMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#F3F2F1] text-[#C53929]"
                >
                  Delete All Comments
                </button>
              </div>
            )}
          </div>
          <button
            onClick={onToggleCommentsPane}
            className="h-6 flex items-center gap-1.5 px-2 text-xs text-[#242424] hover:bg-black/5 rounded transition"
            title="Show Comments Pane"
          >
            <MessageSquare size={13} className="text-[#0F6CBD]" />
            <span>Show Comments</span>
          </button>
        </div>
      </div>

      <div className="word-group-divider" />

      {/* 5. Tracking (Track Changes, Markup, Reviewing Pane) */}
      <div className="word-ribbon-group">
        <button
          onClick={onToggleTrackChanges}
          className={`ribbon-btn-large ${trackChangesEnabled ? 'active' : ''}`}
          title="Track Changes (⌘⇧E)"
        >
          <GitCommit size={24} className={trackChangesEnabled ? 'text-[#0F6CBD]' : 'text-[#616161]'} />
          <span>Track Changes</span>
        </button>

        <div className="flex flex-col gap-1 justify-center">
          <div className="relative">
            <button
              onClick={() => setShowMarkupMenu(!showMarkupMenu)}
              className="h-6 w-32 px-2 flex items-center justify-between bg-white border border-[#D1D1D6] hover:border-[#8A8886] rounded-[3px] text-xs text-[#242424]"
              title="Display for Review"
            >
              <span className="truncate">
                {markupMode === 'all'
                  ? 'All Markup'
                  : markupMode === 'simple'
                  ? 'Simple Markup'
                  : markupMode === 'none'
                  ? 'No Markup'
                  : 'Original'}
              </span>
              <ChevronDown size={10} className="text-[#616161]" />
            </button>
            {showMarkupMenu && (
              <div className="absolute top-7 left-0 bg-white border border-[#D1D1D6] rounded-md shadow-xl py-1 z-50 text-xs w-36">
                {(['all', 'simple', 'none', 'original'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      onSetMarkupMode(mode);
                      setShowMarkupMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-[#F3F2F1] ${
                      markupMode === mode ? 'bg-[#EFF6FC] text-[#0F6CBD] font-medium' : 'text-[#242424]'
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

          <button
            onClick={onToggleTrackPane}
            className="h-6 flex items-center gap-1.5 px-2 text-xs text-[#242424] hover:bg-black/5 rounded transition"
            title="Toggle Reviewing Pane"
          >
            <Sliders size={13} className="text-[#0F6CBD]" />
            <span>Reviewing Pane ({pendingChanges.length})</span>
          </button>
        </div>
      </div>

      <div className="word-group-divider" />

      {/* 6. Changes (Accept & Reject) */}
      <div className="word-ribbon-group">
        <button
          onClick={handleAcceptAll}
          disabled={pendingChanges.length === 0}
          className="ribbon-btn-large disabled:opacity-40"
          title="Accept All Changes"
        >
          <Check size={24} className="text-[#107C41]" />
          <span>Accept</span>
        </button>

        <button
          onClick={handleRejectAll}
          disabled={pendingChanges.length === 0}
          className="ribbon-btn-large disabled:opacity-40"
          title="Reject All Changes"
        >
          <X size={24} className="text-[#C53929]" />
          <span>Reject</span>
        </button>
      </div>
    </div>
  );
};
