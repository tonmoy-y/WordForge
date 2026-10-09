import React, { useState } from 'react';
import { X, Table as TableIcon } from 'lucide-react';
import { Editor } from '@tiptap/react';

interface TableDialogProps {
  editor: Editor | null;
  onClose: () => void;
}

export const TableDialog: React.FC<TableDialogProps> = ({ editor, onClose }) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(4);
  const [withHeader, setWithHeader] = useState(true);

  if (!editor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (editor.chain().focus() as any)
      .insertTable({ rows, cols, withHeaderRow: withHeader })
      .run();
    onClose();
  };

  return (
    <div className="word-dialog-overlay" onClick={onClose}>
      <div className="word-dialog-box w-80" onClick={(e) => e.stopPropagation()}>
        <div className="word-dialog-header">
          <div className="flex items-center gap-2">
            <TableIcon size={16} className="text-[#185ABD]" />
            <span>Insert Table</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="word-dialog-content flex flex-col gap-3 text-xs">
            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-medium">Number of columns:</label>
              <input
                type="number"
                min="1"
                max="20"
                value={cols}
                onChange={(e) => setCols(parseInt(e.target.value, 10) || 1)}
                className="w-16 border border-gray-300 rounded px-2 py-1 text-right"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-medium">Number of rows:</label>
              <input
                type="number"
                min="1"
                max="100"
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value, 10) || 1)}
                className="w-16 border border-gray-300 rounded px-2 py-1 text-right"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer mt-1 text-gray-700 font-medium">
              <input
                type="checkbox"
                checked={withHeader}
                onChange={(e) => setWithHeader(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Include Header Row</span>
            </label>
          </div>

          <div className="word-dialog-footer">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              OK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
