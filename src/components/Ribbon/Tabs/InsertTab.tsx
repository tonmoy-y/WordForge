import React, { useState } from 'react';
import {
  FileText,
  FilePlus,
  Table as TableIcon,
  Image as ImageIcon,
  Shapes,
  Link as LinkIcon,
  Bookmark,
  Calendar,
  Pi,
  Omega,
  Columns,
  Grid,
} from 'lucide-react';
import { Editor } from '@tiptap/react';

interface InsertTabProps {
  editor: Editor | null;
  onOpenTableDialog: () => void;
  onOpenSymbolDialog: () => void;
  onOpenEquationDialog: () => void;
}

export const InsertTab: React.FC<InsertTabProps> = ({
  editor,
  onOpenTableDialog,
  onOpenSymbolDialog,
  onOpenEquationDialog,
}) => {
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [hoverGrid, setHoverGrid] = useState({ rows: 0, cols: 0 });

  if (!editor) return null;

  const handleInsertPageBreak = () => {
    editor.chain().focus().insertContent('<div class="page-break" data-page-break="true"><hr></div>').run();
  };

  const handleInsertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
          const url = readerEvent.target?.result as string;
          (editor.chain().focus() as any).setImage({ src: url }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleInsertGridTable = (rows: number, cols: number) => {
    (editor.chain().focus() as any).insertTable({ rows, cols, withHeaderRow: true }).run();
    setShowTablePicker(false);
  };

  const handleInsertLink = () => {
    const url = prompt('Enter Hyperlink URL:', 'https://');
    if (url) {
      (editor.chain().focus() as any).toggleLink({ href: url }).run();
    }
  };

  const handleInsertDateTime = () => {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    editor.chain().focus().insertContent(` ${formatted} `).run();
  };

  const handleInsertShape = (shapeType: string) => {
    let svgHtml = '';
    if (shapeType === 'rect') {
      svgHtml = `<div style="display:inline-block; margin: 8px 0;"><svg width="120" height="60"><rect width="120" height="60" rx="4" fill="#EBF3FC" stroke="#185ABD" stroke-width="2"/></svg></div>`;
    } else if (shapeType === 'circle') {
      svgHtml = `<div style="display:inline-block; margin: 8px 0;"><svg width="70" height="70"><circle cx="35" cy="35" r="32" fill="#EBF3FC" stroke="#185ABD" stroke-width="2"/></svg></div>`;
    } else if (shapeType === 'arrow') {
      svgHtml = `<div style="display:inline-block; margin: 8px 0;"><svg width="100" height="40"><path d="M5 20 L75 20 L75 10 L95 20 L75 30 L75 20" fill="#185ABD"/></svg></div>`;
    }
    if (svgHtml) {
      editor.chain().focus().insertContent(svgHtml).run();
    }
  };

  return (
    <div className="word-ribbon-panel">
      {/* 1. Pages Group */}
      <div className="word-ribbon-group">
        <div className="word-group-content">
          <button
            onClick={() => {
              editor.chain().focus().insertContent('<h1 style="text-align:center; margin-top: 100px;">Document Title</h1><p style="text-align:center; color:#666;">Subtitle / Author</p><hr><div class="page-break" data-page-break="true"></div>').run();
            }}
            className="ribbon-btn-large"
            title="Insert Cover Page"
          >
            <FileText size={22} className="text-[#185ABD]" />
            <span>Cover Page</span>
          </button>
          <button
            onClick={handleInsertPageBreak}
            className="ribbon-btn-large"
            title="Page Break (Cmd+Enter)"
          >
            <FilePlus size={22} className="text-[#185ABD]" />
            <span>Page Break</span>
          </button>
        </div>
        <div className="word-group-label">Pages</div>
      </div>

      <div className="word-group-separator" />

      {/* 2. Tables Group */}
      <div className="word-ribbon-group">
        <div className="word-group-content">
          <div className="relative">
            <button
              onClick={() => setShowTablePicker(!showTablePicker)}
              className="ribbon-btn-large"
              title="Insert Table Grid"
            >
              <TableIcon size={22} className="text-[#185ABD]" />
              <span>Table</span>
            </button>

            {showTablePicker && (
              <div className="absolute top-16 left-0 bg-white border border-gray-300 rounded shadow-xl p-3 z-50 w-52">
                <div className="text-xs font-semibold mb-2 text-gray-700">
                  {hoverGrid.rows > 0 ? `${hoverGrid.rows} × ${hoverGrid.cols} Table` : 'Insert Table'}
                </div>
                <div className="grid grid-cols-6 gap-1 mb-3">
                  {Array.from({ length: 6 }).map((_, r) =>
                    Array.from({ length: 6 }).map((_, c) => {
                      const row = r + 1;
                      const col = c + 1;
                      const isHovered = row <= hoverGrid.rows && col <= hoverGrid.cols;
                      return (
                        <div
                          key={`${r}-${c}`}
                          onMouseEnter={() => setHoverGrid({ rows: row, cols: col })}
                          onClick={() => handleInsertGridTable(row, col)}
                          className={`w-6 h-6 border rounded-sm cursor-pointer transition ${
                            isHovered ? 'bg-blue-200 border-blue-500' : 'bg-gray-50 border-gray-200'
                          }`}
                        />
                      );
                    })
                  )}
                </div>
                <div className="h-px bg-gray-200 my-2" />
                <button
                  onClick={() => {
                    setShowTablePicker(false);
                    onOpenTableDialog();
                  }}
                  className="w-full text-left text-xs py-1 px-2 hover:bg-blue-50 text-blue-700 rounded font-medium"
                >
                  Custom Table Dimensions…
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="word-group-label">Tables</div>
      </div>

      <div className="word-group-separator" />

      {/* 3. Illustrations Group */}
      <div className="word-ribbon-group">
        <div className="word-group-content">
          <button onClick={handleInsertImage} className="ribbon-btn-large" title="Insert Picture from file">
            <ImageIcon size={22} className="text-[#107C41]" />
            <span>Pictures</span>
          </button>

          <div className="flex flex-col gap-0.5 justify-center">
            <button
              onClick={() => handleInsertShape('rect')}
              className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-gray-100 rounded text-xs text-gray-700"
              title="Rectangle Shape"
            >
              <Shapes size={12} className="text-blue-600" />
              <span>Rectangle</span>
            </button>
            <button
              onClick={() => handleInsertShape('circle')}
              className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-gray-100 rounded text-xs text-gray-700"
              title="Circle Shape"
            >
              <Shapes size={12} className="text-green-600" />
              <span>Circle</span>
            </button>
            <button
              onClick={() => handleInsertShape('arrow')}
              className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-gray-100 rounded text-xs text-gray-700"
              title="Arrow Shape"
            >
              <Shapes size={12} className="text-amber-600" />
              <span>Arrow</span>
            </button>
          </div>
        </div>
        <div className="word-group-label">Illustrations</div>
      </div>

      <div className="word-group-separator" />

      {/* 4. Links & Media */}
      <div className="word-ribbon-group">
        <div className="word-group-content">
          <button onClick={handleInsertLink} className="ribbon-btn-large" title="Insert Hyperlink (Cmd+K)">
            <LinkIcon size={22} className="text-[#185ABD]" />
            <span>Link</span>
          </button>
          <button
            onClick={() => {
              const name = prompt('Enter Bookmark Name:', 'Bookmark1');
              if (name) {
                editor.chain().focus().insertContent(`<span id="bm_${name}" class="bookmark-flag">[🚩 ${name}]</span>`).run();
              }
            }}
            className="ribbon-btn-large"
            title="Insert Bookmark"
          >
            <Bookmark size={22} className="text-[#185ABD]" />
            <span>Bookmark</span>
          </button>
        </div>
        <div className="word-group-label">Links</div>
      </div>

      <div className="word-group-separator" />

      {/* 5. Text & Time */}
      <div className="word-ribbon-group">
        <div className="word-group-content">
          <button onClick={handleInsertDateTime} className="ribbon-btn-large" title="Insert Date & Time">
            <Calendar size={22} className="text-[#2B579A]" />
            <span>Date & Time</span>
          </button>
        </div>
        <div className="word-group-label">Text</div>
      </div>

      <div className="word-group-separator" />

      {/* 6. Symbols & Equations */}
      <div className="word-ribbon-group">
        <div className="word-group-content">
          <button onClick={onOpenEquationDialog} className="ribbon-btn-large" title="Insert Equation">
            <Pi size={22} className="text-[#2B579A]" />
            <span>Equation</span>
          </button>
          <button onClick={onOpenSymbolDialog} className="ribbon-btn-large" title="Insert Special Symbol">
            <Omega size={22} className="text-[#2B579A]" />
            <span>Symbol</span>
          </button>
        </div>
        <div className="word-group-label">Symbols</div>
      </div>
    </div>
  );
};
