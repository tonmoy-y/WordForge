import React, { useState } from 'react';
import { X, Omega } from 'lucide-react';
import { Editor } from '@tiptap/react';

interface SymbolDialogProps {
  editor: Editor | null;
  onClose: () => void;
}

const COMMON_SYMBOLS = [
  '©', '®', '™', '§', '¶', '†', '‡', '•', '…', '–', '—',
  '°', '±', 'µ', 'π', '∑', '√', '∞', '≠', '≤', '≥', '≈',
  '€', '£', '¥', '¢', '₹', '₽', '₩', '§', '‰', '⅓', '⅔',
  'α', 'β', 'γ', 'δ', 'ε', 'θ', 'λ', 'μ', 'σ', 'τ', 'φ', 'ω',
  'Δ', 'Ω', 'Φ', 'Ψ', 'Σ', '←', '↑', '→', '↓', '↔', '⇒', '⇔',
];

export const SymbolDialog: React.FC<SymbolDialogProps> = ({ editor, onClose }) => {
  const [selectedSymbol, setSelectedSymbol] = useState(COMMON_SYMBOLS[0]);

  if (!editor) return null;

  const handleInsert = (sym: string = selectedSymbol) => {
    editor.chain().focus().insertContent(sym).run();
    onClose();
  };

  return (
    <div className="word-dialog-overlay" onClick={onClose}>
      <div className="word-dialog-box w-[420px]" onClick={(e) => e.stopPropagation()}>
        <div className="word-dialog-header">
          <div className="flex items-center gap-2">
            <Omega size={16} className="text-[#185ABD]" />
            <span>Symbol</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <X size={14} />
          </button>
        </div>

        <div className="word-dialog-content flex flex-col gap-3 text-xs">
          <div className="text-gray-600 font-medium">Select a character or symbol to insert:</div>

          {/* Symbols Grid */}
          <div className="grid grid-cols-8 gap-1.5 p-2 bg-gray-50 border border-gray-200 rounded max-h-56 overflow-y-auto">
            {COMMON_SYMBOLS.map((sym, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedSymbol(sym)}
                onDoubleClick={() => handleInsert(sym)}
                className={`w-9 h-9 flex items-center justify-center text-base rounded border transition ${
                  selectedSymbol === sym
                    ? 'bg-blue-600 text-white border-blue-600 font-bold'
                    : 'bg-white border-gray-300 hover:bg-blue-50 text-gray-800'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded">
            <span className="text-gray-600">Selected symbol:</span>
            <span className="text-2xl font-semibold text-blue-800 font-mono">{selectedSymbol}</span>
          </div>
        </div>

        <div className="word-dialog-footer">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="button" onClick={() => handleInsert()} className="btn-primary">
            Insert
          </button>
        </div>
      </div>
    </div>
  );
};
