import React, { useState } from 'react';
import { X, Pi } from 'lucide-react';
import { Editor } from '@tiptap/react';

interface EquationDialogProps {
  editor: Editor | null;
  onClose: () => void;
}

const EQUATION_PRESETS = [
  {
    name: 'Quadratic Formula',
    html: '<span class="math-eq" style="font-family: Cambria Math, serif; font-style: italic;">x = (-b &plusmn; &radic;(b<sup>2</sup> - 4ac)) / (2a)</span>',
  },
  {
    name: 'Pythagorean Theorem',
    html: '<span class="math-eq" style="font-family: Cambria Math, serif; font-style: italic;">a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup></span>',
  },
  {
    name: 'Area of Circle',
    html: '<span class="math-eq" style="font-family: Cambria Math, serif; font-style: italic;">A = &pi;r<sup>2</sup></span>',
  },
  {
    name: 'Einstein Mass-Energy',
    html: '<span class="math-eq" style="font-family: Cambria Math, serif; font-style: italic;">E = mc<sup>2</sup></span>',
  },
  {
    name: 'Definite Integral',
    html: '<span class="math-eq" style="font-family: Cambria Math, serif; font-style: italic;">&int;<sub>a</sub><sup>b</sup> f(x) dx</span>',
  },
  {
    name: 'Binomial Theorem',
    html: '<span class="math-eq" style="font-family: Cambria Math, serif; font-style: italic;">(x + a)<sup>n</sup> = &sum;<sub>k=0</sub><sup>n</sup> (<sup>n</sup><sub>k</sub>) x<sup>k</sup> a<sup>n-k</sup></span>',
  },
];

export const EquationDialog: React.FC<EquationDialogProps> = ({ editor, onClose }) => {
  const [selectedEq, setSelectedEq] = useState(EQUATION_PRESETS[0]);
  const [customText, setCustomText] = useState('');

  if (!editor) return null;

  const handleInsert = (html: string) => {
    editor
      .chain()
      .focus()
      .insertContent(
        `<span style="display:inline-block; padding: 2px 6px; background:#F1F5F9; border: 1px solid #CBD5E1; border-radius: 3px; font-family: Cambria Math, serif;">${html}</span>`
      )
      .run();
    onClose();
  };

  return (
    <div className="word-dialog-overlay" onClick={onClose}>
      <div className="word-dialog-box w-[460px]" onClick={(e) => e.stopPropagation()}>
        <div className="word-dialog-header">
          <div className="flex items-center gap-2">
            <Pi size={16} className="text-[#185ABD]" />
            <span>Insert Equation</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <X size={14} />
          </button>
        </div>

        <div className="word-dialog-content flex flex-col gap-3 text-xs">
          <div className="text-gray-700 font-medium">Standard Equation Templates:</div>
          <div className="flex flex-col gap-1.5 border border-gray-200 rounded p-2 bg-gray-50 max-h-52 overflow-y-auto">
            {EQUATION_PRESETS.map((eq, i) => (
              <div
                key={i}
                onClick={() => setSelectedEq(eq)}
                className={`p-2 rounded border cursor-pointer flex items-center justify-between transition ${
                  selectedEq.name === eq.name
                    ? 'bg-blue-50 border-blue-500 font-semibold'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className="text-gray-800">{eq.name}</span>
                <span
                  className="text-gray-600 font-serif text-sm"
                  dangerouslySetInnerHTML={{ __html: eq.html }}
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Custom Formula / Notation:</label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g. f(x) = sin(x) + cos(x)"
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-blue-500 font-mono text-xs"
            />
          </div>
        </div>

        <div className="word-dialog-footer">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={() => handleInsert(customText || selectedEq.html)}
            className="btn-primary"
          >
            Insert Equation
          </button>
        </div>
      </div>
    </div>
  );
};
