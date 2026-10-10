import React, { useState } from 'react';
import { Table, Plus } from 'lucide-react';

interface TableGridPickerProps {
  onInsertTable: (rows: number, cols: number) => void;
  onOpenTableDialog: () => void;
  onClose: () => void;
}

export const TableGridPicker: React.FC<TableGridPickerProps> = ({
  onInsertTable,
  onOpenTableDialog,
  onClose,
}) => {
  const [hovered, setHovered] = useState({ rows: 1, cols: 1 });

  return (
    <div
      className="absolute top-16 left-0 bg-white border border-[#CBD5E1] rounded shadow-xl p-3 z-50 w-52 select-none"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center justify-between">
        <span>Insert Table</span>
        <span className="text-[11px] text-[#185ABD] font-mono">
          {hovered.cols} × {hovered.rows}
        </span>
      </div>

      {/* 10 x 8 hover grid */}
      <div
        className="grid grid-cols-10 gap-1 p-1 bg-gray-50 border border-gray-200 rounded mb-2.5"
        onMouseLeave={() => setHovered({ rows: 1, cols: 1 })}
      >
        {Array.from({ length: 8 }).map((_, rowIdx) =>
          Array.from({ length: 10 }).map((_, colIdx) => {
            const isHighlighted = rowIdx < hovered.rows && colIdx < hovered.cols;
            return (
              <div
                key={`${rowIdx}-${colIdx}`}
                onMouseEnter={() => setHovered({ rows: rowIdx + 1, cols: colIdx + 1 })}
                onClick={() => {
                  onInsertTable(rowIdx + 1, colIdx + 1);
                  onClose();
                }}
                className={`w-3.5 h-3.5 border transition-colors cursor-pointer rounded-xs ${
                  isHighlighted
                    ? 'bg-[#185ABD] border-[#103F91]'
                    : 'bg-white border-gray-300 hover:border-blue-400'
                }`}
              />
            );
          })
        )}
      </div>

      <div className="h-px bg-gray-200 my-1.5" />

      {/* Insert Table Dialog Action */}
      <button
        onClick={() => {
          onClose();
          onOpenTableDialog();
        }}
        className="w-full text-left px-2 py-1.5 hover:bg-blue-50 text-xs text-gray-700 font-medium rounded flex items-center gap-2"
      >
        <Plus size={13} className="text-[#185ABD]" />
        <span>Insert Table…</span>
      </button>
    </div>
  );
};
