import React, { useState } from 'react';
import { X, Search, Replace as ReplaceIcon } from 'lucide-react';
import { Editor } from '@tiptap/react';

interface FindReplaceDialogProps {
  editor: Editor | null;
  onClose: () => void;
  initialMode?: 'find' | 'replace';
}

export const FindReplaceDialog: React.FC<FindReplaceDialogProps> = ({
  editor,
  onClose,
  initialMode = 'find',
}) => {
  const [mode, setMode] = useState<'find' | 'replace'>(initialMode);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [matchCount, setMatchCount] = useState<number | null>(null);

  if (!editor) return null;

  const handleFind = () => {
    if (!findText) return;
    const content = editor.getText();
    const regex = new RegExp(
      findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      matchCase ? 'g' : 'gi'
    );
    const matches = content.match(regex);
    setMatchCount(matches ? matches.length : 0);
  };

  const handleReplace = () => {
    if (!findText) return;
    const html = editor.getHTML();
    const regex = new RegExp(
      findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      matchCase ? '' : 'i'
    );
    const updated = html.replace(regex, replaceText);
    editor.commands.setContent(updated);
    handleFind();
  };

  const handleReplaceAll = () => {
    if (!findText) return;
    const html = editor.getHTML();
    const regex = new RegExp(
      findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      matchCase ? 'g' : 'gi'
    );
    const updated = html.replace(regex, replaceText);
    editor.commands.setContent(updated);
    handleFind();
  };

  return (
    <div className="word-dialog-overlay" onClick={onClose}>
      <div className="word-dialog-box w-96" onClick={(e) => e.stopPropagation()}>
        <div className="word-dialog-header">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-[#185ABD]" />
            <span>{mode === 'find' ? 'Find' : 'Find and Replace'}</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <X size={14} />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-gray-200 text-xs bg-gray-50">
          <button
            onClick={() => setMode('find')}
            className={`flex-1 py-1.5 text-center font-medium ${
              mode === 'find' ? 'bg-white text-blue-700 border-b-2 border-blue-600' : 'text-gray-600'
            }`}
          >
            Find
          </button>
          <button
            onClick={() => setMode('replace')}
            className={`flex-1 py-1.5 text-center font-medium ${
              mode === 'replace' ? 'bg-white text-blue-700 border-b-2 border-blue-600' : 'text-gray-600'
            }`}
          >
            Replace
          </button>
        </div>

        <div className="word-dialog-content flex flex-col gap-3 text-xs">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Find what:</label>
            <input
              type="text"
              value={findText}
              onChange={(e) => {
                setFindText(e.target.value);
                setMatchCount(null);
              }}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-blue-500"
              placeholder="Text to find…"
              autoFocus
            />
          </div>

          {mode === 'replace' && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">Replace with:</label>
              <input
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-blue-500"
                placeholder="Replacement text…"
              />
            </div>
          )}

          <div className="flex items-center gap-2 mt-1">
            <label className="flex items-center gap-1.5 cursor-pointer text-gray-700">
              <input
                type="checkbox"
                checked={matchCase}
                onChange={(e) => setMatchCase(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Match case</span>
            </label>
          </div>

          {matchCount !== null && (
            <div className="p-2 bg-blue-50 border border-blue-200 rounded text-blue-800 text-xs font-medium">
              {matchCount === 0 ? 'No matches found' : `Found ${matchCount} occurrence(s)`}
            </div>
          )}
        </div>

        <div className="word-dialog-footer">
          {mode === 'find' ? (
            <button onClick={handleFind} className="btn-primary">
              Find Next
            </button>
          ) : (
            <>
              <button onClick={handleReplace} className="btn-secondary">
                Replace
              </button>
              <button onClick={handleReplaceAll} className="btn-primary">
                Replace All
              </button>
            </>
          )}
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
