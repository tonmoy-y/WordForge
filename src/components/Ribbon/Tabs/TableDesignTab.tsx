import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { PaintBucket, Grid, CheckSquare } from 'lucide-react';
import { ThemeColorPicker } from '../ThemeColorPicker';

interface TableDesignTabProps {
  editor: Editor | null;
}

export const TableDesignTab: React.FC<TableDesignTabProps> = ({ editor }) => {
  const [showShadingPicker, setShowShadingPicker] = useState(false);
  const [headerRow, setHeaderRow] = useState(true);
  const [bandedRows, setBandedRows] = useState(true);

  if (!editor) return null;

  const tableStyles = [
    { name: 'Plain Table', preview: 'border border-gray-400 bg-white' },
    { name: 'Grid Table 1 Light', preview: 'border border-blue-300 bg-blue-50' },
    { name: 'Grid Table 2', preview: 'border-2 border-[#185ABD] bg-white' },
    { name: 'List Table 3', preview: 'border-b-2 border-emerald-600 bg-emerald-50' },
  ];

  return (
    <div className="word-ribbon-panel">
      {/* 1. Table Style Options */}
      <div className="word-ribbon-group">
        <div className="flex flex-col gap-1 text-[11px] text-gray-700 justify-center flex-1">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={headerRow}
              onChange={(e) => setHeaderRow(e.target.checked)}
              className="rounded text-blue-600"
            />
            <span>Header Row</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={bandedRows}
              onChange={(e) => setBandedRows(e.target.checked)}
              className="rounded text-blue-600"
            />
            <span>Banded Rows</span>
          </label>
        </div>
        <div className="word-group-label">Table Style Options</div>
      </div>

      <div className="word-group-separator" />

      {/* 2. Table Styles Gallery */}
      <div className="word-ribbon-group">
        <div className="flex items-center gap-2 flex-1">
          {tableStyles.map((style, idx) => (
            <div
              key={idx}
              onClick={() => {
                // Apply table style formatting
                (editor.chain().focus() as any).setCellAttribute?.('background', idx % 2 === 0 ? '#F8FAFC' : '#EBF3FC')?.run?.();
              }}
              className={`w-20 h-14 rounded border p-1 cursor-pointer hover:shadow-xs transition flex flex-col justify-between ${style.preview}`}
              title={style.name}
            >
              <div className="w-full h-2.5 bg-gray-300/80 rounded-xs" />
              <div className="w-full h-1.5 bg-gray-200/80 rounded-xs" />
              <div className="w-full h-1.5 bg-gray-200/80 rounded-xs" />
              <span className="text-[9px] text-gray-600 truncate">{style.name}</span>
            </div>
          ))}
        </div>
        <div className="word-group-label">Table Styles</div>
      </div>

      <div className="word-group-separator" />

      {/* 3. Shading & Borders */}
      <div className="word-ribbon-group">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative">
            <button
              onClick={() => setShowShadingPicker(!showShadingPicker)}
              className="ribbon-btn-large"
              title="Cell Shading Color"
            >
              <PaintBucket size={22} className="text-[#185ABD]" />
              <span>Shading</span>
            </button>
            {showShadingPicker && (
              <ThemeColorPicker
                onSelectColor={(color) => {
                  (editor.chain().focus() as any).setCellAttribute?.('background', color)?.run?.();
                  setShowShadingPicker(false);
                }}
                onClose={() => setShowShadingPicker(false)}
              />
            )}
          </div>

          <button
            onClick={() => {
              (editor.chain().focus() as any).toggleHeaderRow?.()?.run?.();
            }}
            className="ribbon-btn-large"
            title="Toggle Header Row"
          >
            <Grid size={22} className="text-gray-700" />
            <span>Borders</span>
          </button>
        </div>
        <div className="word-group-label">Borders & Shading</div>
      </div>
    </div>
  );
};
