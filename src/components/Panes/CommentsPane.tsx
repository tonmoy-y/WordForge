import React, { useState } from 'react';
import {
  MessageSquare,
  X,
  CornerDownRight,
  Check,
  Trash2,
  Send,
} from 'lucide-react';
import { CommentThread, CommentReply } from '../../types/document';

interface CommentsPaneProps {
  comments: CommentThread[];
  onUpdateComments: (comments: CommentThread[]) => void;
  onClose: () => void;
}

export const CommentsPane: React.FC<CommentsPaneProps> = ({
  comments,
  onUpdateComments,
  onClose,
}) => {
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  const handleAddReply = (threadId: string) => {
    const text = replyInputs[threadId]?.trim();
    if (!text) return;

    const newReply: CommentReply = {
      id: 'rep_' + Math.random().toString(36).substring(2, 9),
      author: 'Current User',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
    };

    const updated = comments.map((t) =>
      t.id === threadId ? { ...t, replies: [...t.replies, newReply] } : t
    );

    onUpdateComments(updated);
    setReplyInputs((prev) => ({ ...prev, [threadId]: '' }));
  };

  const handleResolveThread = (threadId: string) => {
    const updated = comments.map((t) =>
      t.id === threadId ? { ...t, resolved: !t.resolved } : t
    );
    onUpdateComments(updated);
  };

  const handleDeleteThread = (threadId: string) => {
    onUpdateComments(comments.filter((t) => t.id !== threadId));
  };

  return (
    <div className="word-sidepane right-pane">
      <div className="sidepane-header">
        <div className="flex items-center gap-1.5">
          <MessageSquare size={14} className="text-[#185ABD]" />
          <span>Comments ({comments.length})</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
          <X size={14} />
        </button>
      </div>

      <div className="sidepane-body flex flex-col gap-3">
        {comments.length === 0 ? (
          <div className="text-xs text-gray-400 italic py-6 text-center">
            No comments in document. Select text and click 'New Comment' in the Review ribbon tab.
          </div>
        ) : (
          comments.map((thread) => (
            <div
              key={thread.id}
              className={`p-3 rounded-lg border text-xs flex flex-col gap-2 transition ${
                thread.resolved
                  ? 'bg-gray-50 border-gray-200 opacity-60'
                  : 'bg-white border-blue-200 shadow-xs'
              }`}
            >
              {/* Thread Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                    style={{ backgroundColor: thread.avatarColor || '#185ABD' }}
                  >
                    {thread.author[0]}
                  </div>
                  <span className="font-semibold text-gray-800">{thread.author}</span>
                </div>
                <span className="text-[10px] text-gray-400">{thread.timestamp}</span>
              </div>

              {/* Selected Text Reference */}
              {thread.selectedText && (
                <div className="bg-yellow-50 border-l-2 border-yellow-400 px-2 py-1 text-gray-600 italic">
                  "{thread.selectedText}"
                </div>
              )}

              {/* Comment Body */}
              <div className="text-gray-800">{thread.text}</div>

              {/* Replies */}
              {thread.replies.length > 0 && (
                <div className="pl-3 border-l-2 border-gray-200 flex flex-col gap-1.5 mt-1">
                  {thread.replies.map((rep) => (
                    <div key={rep.id} className="text-[11px]">
                      <span className="font-semibold text-gray-700">{rep.author}: </span>
                      <span className="text-gray-600">{rep.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input */}
              <div className="flex items-center gap-1 mt-1">
                <input
                  type="text"
                  placeholder="Reply…"
                  value={replyInputs[thread.id] || ''}
                  onChange={(e) =>
                    setReplyInputs((prev) => ({ ...prev, [thread.id]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddReply(thread.id);
                  }}
                  className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => handleAddReply(thread.id)}
                  className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  <Send size={11} />
                </button>
              </div>

              {/* Actions: Resolve & Delete */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-100 text-[11px]">
                <button
                  onClick={() => handleResolveThread(thread.id)}
                  className="flex items-center gap-1 text-emerald-600 hover:underline"
                >
                  <Check size={11} />
                  <span>{thread.resolved ? 'Reopen' : 'Resolve'}</span>
                </button>
                <button
                  onClick={() => handleDeleteThread(thread.id)}
                  className="flex items-center gap-1 text-red-500 hover:underline"
                >
                  <Trash2 size={11} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
