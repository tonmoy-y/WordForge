import React, { useState } from 'react';
import { X, AlignLeft } from 'lucide-react';
import { Editor } from '@tiptap/react';

interface ParagraphDialogProps {
  editor: Editor | null;
  onClose: () => void;
}

export const ParagraphDialog: React.FC<ParagraphDialogProps> = ({ editor, onClose }) => {
  const [alignment, setAlignment] = useState('left');
  const [lineSpacing, setLineSpacing] = useState('1.15');

  if (!editor) return null;

  const handleApply = () => {
    (editor.chain().focus() as any).setTextAlign(alignment).run();
    onClose();
  };

  return (
    <div className="word-dialog-overlay" onClick={onClose}>
      <div className="word-dialog-box w-96" onClick={(e) => e.stopPropagation()}>
        <div className="word-dialog-header">
          <div className="flex items-center gap-2">
            <AlignLeft size={16} className="text-[#185ABD]" />
            <span>Paragraph</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <X size={14} />
          </button>
        </div>

        <div className="word-dialog-content flex flex-col gap-4 text-xs">
          <div>
            <div className="font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1">General</div>
            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-medium">Alignment:</label>
              <select
                value={alignment}
                onChange={(e) => setAlignment(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 w-32 bg-white"
              >
                <option value="left">Left</option>
                <option value="center">Centered</option>
                <option value="right">Right</option>
                <option value="justify">Justified</option>
              </select>
            </div>
          </div>

          <div>
            <div className="font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1">Spacing</div>
            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-medium">Line spacing:</label>
              <select
                value={lineSpacing}
                onChange={(e) => setLineSpacing(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 w-32 bg-white"
              >
                <option value="1.0">Single (1.0)</option>
                <option value="1.15">1.15 lines</option>
                <option value="1.5">1.5 lines</option>
                <option value="2.0">Double (2.0)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="word-dialog-footer">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleApply} className="btn-primary">
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
