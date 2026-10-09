import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertTriangle, Plus } from 'lucide-react';
import { Editor } from '@tiptap/react';
import { spellCheckEngine, SpellCheckMatch } from '../../core/review/spellCheckEngine';

interface SpellCheckDialogProps {
  editor: Editor | null;
  onClose: () => void;
}

export const SpellCheckDialog: React.FC<SpellCheckDialogProps> = ({ editor, onClose }) => {
  const [matches, setMatches] = useState<SpellCheckMatch[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>('');

  useEffect(() => {
    if (editor) {
      const text = editor.getText();
      const results = spellCheckEngine.checkText(text);
      setMatches(results);
      if (results.length > 0 && results[0].suggestions.length > 0) {
        setSelectedSuggestion(results[0].suggestions[0]);
      }
    }
  }, [editor]);

  if (!editor) return null;

  const currentMatch = matches[currentIndex];

  const handleIgnore = () => {
    if (currentIndex < matches.length - 1) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      if (matches[next]?.suggestions.length > 0) {
        setSelectedSuggestion(matches[next].suggestions[0]);
      }
    } else {
      alert('Spelling and grammar check complete.');
      onClose();
    }
  };

  const handleAddWord = () => {
    if (currentMatch) {
      spellCheckEngine.addCustomWord(currentMatch.word);
      handleIgnore();
    }
  };

  const handleChange = () => {
    if (!currentMatch || !selectedSuggestion) return;
    const html = editor.getHTML();
    // Replace first occurrence of misspelled word
    const regex = new RegExp(`\\b${currentMatch.word}\\b`, 'i');
    const updated = html.replace(regex, selectedSuggestion);
    editor.commands.setContent(updated);
    handleIgnore();
  };

  return (
    <div className="word-dialog-overlay" onClick={onClose}>
      <div className="word-dialog-box w-[450px]" onClick={(e) => e.stopPropagation()}>
        <div className="word-dialog-header">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#107C41]" />
            <span>Spelling & Proofing</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <X size={14} />
          </button>
        </div>

        <div className="word-dialog-content flex flex-col gap-3 text-xs">
          {matches.length === 0 ? (
            <div className="py-8 text-center text-gray-600 flex flex-col items-center gap-2">
              <CheckCircle2 size={36} className="text-emerald-600" />
              <div className="font-semibold text-gray-800 text-sm">
                Spelling and Grammar check is complete!
              </div>
              <div className="text-gray-500">No spelling discrepancies found in this document.</div>
            </div>
          ) : currentMatch ? (
            <>
              <div className="flex items-center justify-between text-gray-500 text-[11px]">
                <span>Issue {currentIndex + 1} of {matches.length}</span>
                <span className="text-amber-700 font-medium flex items-center gap-1">
                  <AlertTriangle size={12} />
                  Not in dictionary
                </span>
              </div>

              {/* Misspelled word box */}
              <div className="p-2.5 bg-red-50 border border-red-200 rounded font-semibold text-red-800 text-sm">
                {currentMatch.word}
              </div>

              {/* Suggestions */}
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Suggestions:</label>
                <div className="border border-gray-300 rounded p-1 bg-white max-h-36 overflow-y-auto flex flex-col gap-0.5">
                  {currentMatch.suggestions.length === 0 ? (
                    <div className="text-gray-400 italic p-2">No suggestions available</div>
                  ) : (
                    currentMatch.suggestions.map((sug, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedSuggestion(sug)}
                        className={`p-1.5 rounded cursor-pointer text-xs transition ${
                          selectedSuggestion === sug
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'hover:bg-gray-100 text-gray-800'
                        }`}
                      >
                        {sug}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>

        <div className="word-dialog-footer">
          {matches.length > 0 && currentMatch ? (
            <>
              <button onClick={handleAddWord} className="btn-secondary flex items-center gap-1">
                <Plus size={12} />
                <span>Add to Dictionary</span>
              </button>
              <button onClick={handleIgnore} className="btn-secondary">
                Ignore
              </button>
              <button onClick={handleChange} disabled={!selectedSuggestion} className="btn-primary">
                Change
              </button>
            </>
          ) : (
            <button onClick={onClose} className="btn-primary">
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
