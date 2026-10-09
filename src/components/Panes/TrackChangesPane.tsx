import React from 'react';
import {
  GitCommit,
  X,
  Check,
  RotateCcw,
} from 'lucide-react';
import { TrackChangeItem } from '../../types/document';
import { TrackChangesEngine } from '../../core/review/trackChangesEngine';

interface TrackChangesPaneProps {
  trackChanges: TrackChangeItem[];
  onUpdateTrackChanges: (changes: TrackChangeItem[]) => void;
  onClose: () => void;
}

export const TrackChangesPane: React.FC<TrackChangesPaneProps> = ({
  trackChanges,
  onUpdateTrackChanges,
  onClose,
}) => {
  const pendingChanges = trackChanges.filter((c) => c.status === 'pending');

  const handleAccept = (id: string) => {
    onUpdateTrackChanges(TrackChangesEngine.acceptChange(trackChanges, id));
  };

  const handleReject = (id: string) => {
    onUpdateTrackChanges(TrackChangesEngine.rejectChange(trackChanges, id));
  };

  return (
    <div className="word-sidepane right-pane">
      <div className="sidepane-header">
        <div className="flex items-center gap-1.5">
          <GitCommit size={14} className="text-[#D83B01]" />
          <span>Revisions ({pendingChanges.length})</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
          <X size={14} />
        </button>
      </div>

      <div className="sidepane-body flex flex-col gap-2.5">
        {trackChanges.length === 0 ? (
          <div className="text-xs text-gray-400 italic py-6 text-center">
            No tracked revisions. Turn on Track Changes in the Review ribbon to track document modifications.
          </div>
        ) : (
          trackChanges.map((change) => (
            <div
              key={change.id}
              className={`p-2.5 rounded border text-xs flex flex-col gap-1.5 transition ${
                change.status === 'accepted'
                  ? 'bg-green-50/50 border-green-200 opacity-60'
                  : change.status === 'rejected'
                  ? 'bg-red-50/50 border-red-200 opacity-60'
                  : 'bg-white border-gray-200 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800">{change.author}</span>
                <span className="text-[10px] text-gray-400">{change.timestamp}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    change.type === 'insert'
                      ? 'bg-green-100 text-green-800'
                      : change.type === 'delete'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {change.type.toUpperCase()}
                </span>
                <span className="text-gray-700 italic truncate">"{change.text}"</span>
              </div>

              {change.status === 'pending' ? (
                <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-gray-100 mt-1">
                  <button
                    onClick={() => handleAccept(change.id)}
                    className="flex items-center gap-1 px-2 py-0.5 bg-green-600 hover:bg-green-700 text-white rounded text-[11px]"
                  >
                    <Check size={11} />
                    <span>Accept</span>
                  </button>
                  <button
                    onClick={() => handleReject(change.id)}
                    className="flex items-center gap-1 px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-[11px]"
                  >
                    <X size={11} />
                    <span>Reject</span>
                  </button>
                </div>
              ) : (
                <div className="text-[10px] text-right text-gray-400 capitalize font-medium">
                  {change.status}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
