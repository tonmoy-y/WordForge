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
        <div className="flex items-center gap-1.5 flex-1">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => (editor.chain().focus() as any).addRowBefore?.()?.run?.()}
              className="h-6 flex items-center gap-1.5 px-2 text-xs font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded transition border border-transparent hover:border-gray-300"
              title="Insert Row Above"
            >
              <ArrowUp size={12} className="text-blue-600 shrink-0" />
              <span>Insert Above</span>
            </button>
            <button
              onClick={() => (editor.chain().focus() as any).addRowAfter?.()?.run?.()}
              className="h-6 flex items-center gap-1.5 px-2 text-xs font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded transition border border-transparent hover:border-gray-300"
              title="Insert Row Below"
            >
              <ArrowDown size={12} className="text-blue-600 shrink-0" />
              <span>Insert Below</span>
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <button
              onClick={() => (editor.chain().focus() as any).addColumnBefore?.()?.run?.()}
              className="h-6 flex items-center gap-1.5 px-2 text-xs font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded transition border border-transparent hover:border-gray-300"
              title="Insert Column Left"
            >
              <ArrowLeft size={12} className="text-blue-600 shrink-0" />
              <span>Insert Left</span>
            </button>
            <button
              onClick={() => (editor.chain().focus() as any).addColumnAfter?.()?.run?.()}
              className="h-6 flex items-center gap-1.5 px-2 text-xs font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded transition border border-transparent hover:border-gray-300"
              title="Insert Column Right"
            >
              <ArrowRight size={12} className="text-blue-600 shrink-0" />
              <span>Insert Right</span>
            </button>
          </div>

          {/* Delete actions */}
          <div className="flex flex-col gap-1 border-l border-gray-200 pl-1.5 ml-0.5">
            <button
              onClick={() => (editor.chain().focus() as any).deleteRow?.()?.run?.()}
              className="h-6 flex items-center gap-1.5 px-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition border border-transparent hover:border-red-200"
              title="Delete Current Row"
            >
              <Trash2 size={11} className="shrink-0" />
              <span>Delete Row</span>
            </button>
            <button
              onClick={() => (editor.chain().focus() as any).deleteColumn?.()?.run?.()}
              className="h-6 flex items-center gap-1.5 px-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition border border-transparent hover:border-red-200"
              title="Delete Current Column"
            >
              <Trash2 size={11} className="shrink-0" />
              <span>Delete Col</span>
            </button>
          </div>

          <button
            onClick={() => (editor.chain().focus() as any).deleteTable?.()?.run?.()}
            className="ribbon-btn-large text-red-600 hover:bg-red-50"
            title="Delete Entire Table"
          >
            <Trash2 size={20} />
            <span>Delete Table</span>
          </button>
        </div>
        <div className="word-group-label">Rows & Columns</div>
      </div>

      <div className="word-group-separator" />

      {/* 2. Merge Group */}
      <div className="word-ribbon-group">
        <div className="flex items-center gap-1.5 flex-1">
          <button
            onClick={() => (editor.chain().focus() as any).mergeCells?.()?.run?.()}
            className="ribbon-btn-large"
            title="Merge Selected Cells"
          >
            <Combine size={22} className="text-[#185ABD]" />
            <span>Merge Cells</span>
          </button>
          <button
            onClick={() => (editor.chain().focus() as any).splitCell?.()?.run?.()}
            className="ribbon-btn-large"
            title="Split Cell"
          >
            <Split size={22} className="text-[#185ABD]" />
            <span>Split Cell</span>
          </button>
        </div>
        <div className="word-group-label">Merge</div>
      </div>

      <div className="word-group-separator" />

      {/* 3. Alignment Group */}
      <div className="word-ribbon-group">
        <div className="flex items-center gap-2 flex-1">
          {/* 3-button alignment */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <button
                onClick={() => (editor.chain().focus() as any).setTextAlign?.('left')?.run?.()}
                className="ribbon-btn-small"
                title="Align Cell Left"
              >
                <AlignLeft size={13} />
              </button>
              <button
                onClick={() => (editor.chain().focus() as any).setTextAlign?.('center')?.run?.()}
                className="ribbon-btn-small"
                title="Align Cell Center"
              >
                <AlignCenter size={13} />
              </button>
              <button
                onClick={() => (editor.chain().focus() as any).setTextAlign?.('right')?.run?.()}
                className="ribbon-btn-small"
                title="Align Cell Right"
              >
                <AlignRight size={13} />
              </button>
            </div>
          </div>
        </div>
        <div className="word-group-label">Alignment</div>
      </div>
    </div>
  );
};
