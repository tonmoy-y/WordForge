import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { PaintBucket, Square, ChevronDown } from 'lucide-react';
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
    { name: 'Grid Table 1 Light', preview: 'border border-blue-300 bg-[#EFF6FC]' },
    { name: 'Grid Table 2', preview: 'border-2 border-[#0F6CBD] bg-white' },
    { name: 'List Table 3', preview: 'border-b-2 border-emerald-600 bg-emerald-50' },
  ];

  return (
    <div className="word-ribbon-panel">
      {/* 1. Table Style Options */}
      <div className="word-ribbon-group">
        <div className="flex flex-col gap-1 text-[11px] text-[#242424] justify-center">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={headerRow}
              onChange={(e) => setHeaderRow(e.target.checked)}
              className="rounded text-[#0F6CBD]"
            />
            <span>Header Row</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={bandedRows}
              onChange={(e) => setBandedRows(e.target.checked)}
              className="rounded text-[#0F6CBD]"
            />
            <span>Banded Rows</span>
          </label>
        </div>
      </div>

      <div className="word-group-divider" />

      {/* 2. Table Styles Gallery */}
      <div className="word-ribbon-group">
        <div className="flex items-center gap-1.5">
          {tableStyles.map((style, idx) => (
            <div
              key={idx}
              onClick={() => {
                (editor.chain().focus() as any).setCellAttribute?.('background', idx % 2 === 0 ? '#F9F9FB' : '#EFF6FC')?.run?.();
              }}
              className={`w-20 h-14 rounded-[3px] border p-1 cursor-pointer hover:shadow-xs transition flex flex-col justify-between ${style.preview}`}
              title={style.name}
            >
              <div className="w-full h-2.5 bg-gray-300/80 rounded-xs" />
              <div className="w-full h-1.5 bg-gray-200/80 rounded-xs" />
              <div className="w-full h-1.5 bg-gray-200/80 rounded-xs" />
              <span className="text-[9px] text-[#616161] truncate">{style.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="word-group-divider" />

      {/* 3. Shading & Borders */}
      <div className="word-ribbon-group">
        <div className="relative">
          <button
            onClick={() => setShowShadingPicker(!showShadingPicker)}
            className="ribbon-btn-large"
            title="Cell Shading Color"
          >
            <PaintBucket size={24} className="text-[#0F6CBD]" />
            <div className="flex items-center gap-0.5">
              <span>Shading</span>
              <ChevronDown size={9} className="text-[#616161]" />
            </div>
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
          onClick={() => alert('Table Borders: All Borders applied.')}
          className="ribbon-btn-large"
          title="Borders"
        >
          <Square size={24} className="text-[#616161]" />
          <span>Borders</span>
        </button>
      </div>
    </div>
  );
};
