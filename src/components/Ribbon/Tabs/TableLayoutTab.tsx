import React from 'react';
import { Editor } from '@tiptap/react';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Combine,
  Split,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';

interface TableLayoutTabProps {
  editor: Editor | null;
}

export const TableLayoutTab: React.FC<TableLayoutTabProps> = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="word-ribbon-panel">
      {/* 1. Rows & Columns */}
      <div className="word-ribbon-group">
        <div className="flex flex-col gap-0.5 justify-center">
          <button
            onClick={() => (editor.chain().focus() as any).addRowBefore?.()?.run?.()}
            className="h-6 flex items-center gap-1.5 px-2 text-xs font-normal text-[#242424] hover:bg-black/5 rounded transition"
            title="Insert Row Above"
          >
            <ArrowUp size={13} className="text-[#0F6CBD] shrink-0" />
            <span>Insert Above</span>
          </button>
          <button
            onClick={() => (editor.chain().focus() as any).addRowAfter?.()?.run?.()}
            className="h-6 flex items-center gap-1.5 px-2 text-xs font-normal text-[#242424] hover:bg-black/5 rounded transition"
            title="Insert Row Below"
          >
            <ArrowDown size={13} className="text-[#0F6CBD] shrink-0" />
            <span>Insert Below</span>
          </button>
        </div>

        <div className="flex flex-col gap-0.5 justify-center">
          <button
            onClick={() => (editor.chain().focus() as any).addColumnBefore?.()?.run?.()}
            className="h-6 flex items-center gap-1.5 px-2 text-xs font-normal text-[#242424] hover:bg-black/5 rounded transition"
            title="Insert Column Left"
          >
            <ArrowLeft size={13} className="text-[#0F6CBD] shrink-0" />
            <span>Insert Left</span>
          </button>
          <button
            onClick={() => (editor.chain().focus() as any).addColumnAfter?.()?.run?.()}
            className="h-6 flex items-center gap-1.5 px-2 text-xs font-normal text-[#242424] hover:bg-black/5 rounded transition"
            title="Insert Column Right"
          >
            <ArrowRight size={13} className="text-[#0F6CBD] shrink-0" />
            <span>Insert Right</span>
          </button>
        </div>

        <div className="flex flex-col gap-0.5 justify-center border-l border-[#EDEBE9] pl-1.5 ml-1">
          <button
            onClick={() => (editor.chain().focus() as any).deleteRow?.()?.run?.()}
            className="h-6 flex items-center gap-1.5 px-2 text-xs font-normal text-[#C53929] hover:bg-[#FEF2F2] rounded transition"
            title="Delete Current Row"
          >
            <Trash2 size={12} className="shrink-0" />
            <span>Delete Row</span>
          </button>
          <button
            onClick={() => (editor.chain().focus() as any).deleteColumn?.()?.run?.()}
            className="h-6 flex items-center gap-1.5 px-2 text-xs font-normal text-[#C53929] hover:bg-[#FEF2F2] rounded transition"
            title="Delete Current Column"
          >
            <Trash2 size={12} className="shrink-0" />
            <span>Delete Col</span>
          </button>
        </div>

        <button
          onClick={() => (editor.chain().focus() as any).deleteTable?.()?.run?.()}
          className="ribbon-btn-large text-[#C53929] hover:bg-[#FEF2F2]"
          title="Delete Entire Table"
        >
          <Trash2 size={22} />
          <span>Delete Table</span>
        </button>
      </div>

      <div className="word-group-divider" />

      {/* 2. Merge Cells Group */}
      <div className="word-ribbon-group">
        <button
          onClick={() => (editor.chain().focus() as any).mergeCells?.()?.run?.()}
          className="ribbon-btn-large"
          title="Merge Selected Cells"
        >
          <Combine size={24} className="text-[#0F6CBD]" />
          <span>Merge Cells</span>
        </button>
        <button
          onClick={() => (editor.chain().focus() as any).splitCell?.()?.run?.()}
          className="ribbon-btn-large"
          title="Split Selected Cell"
        >
          <Split size={24} className="text-[#0F6CBD]" />
          <span>Split Cells</span>
        </button>
      </div>

      <div className="word-group-divider" />

      {/* 3. Alignment Group */}
      <div className="word-ribbon-group">
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => (editor.chain().focus() as any).setTextAlign?.('left')?.run?.()}
            className="ribbon-btn-small"
            title="Align Top Left"
          >
            <AlignLeft size={13} />
          </button>
          <button
            onClick={() => (editor.chain().focus() as any).setTextAlign?.('center')?.run?.()}
            className="ribbon-btn-small"
            title="Align Top Center"
          >
            <AlignCenter size={13} />
          </button>
          <button
            onClick={() => (editor.chain().focus() as any).setTextAlign?.('right')?.run?.()}
            className="ribbon-btn-small"
            title="Align Top Right"
          >
            <AlignRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
