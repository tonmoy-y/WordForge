import React, { useState } from 'react';
import {
  FileText,
  FilePlus,
  Table as TableIcon,
  Image as ImageIcon,
  Shapes,
  Link as LinkIcon,
  Pi,
  Omega,
  Columns,
  MessageSquarePlus,
  ChevronDown,
  Hash,
} from 'lucide-react';
import { Editor } from '@tiptap/react';
import { TableGridPicker } from '../TableGridPicker';

interface InsertTabProps {
  editor: Editor | null;
  onOpenTableDialog: () => void;
  onOpenSymbolDialog: () => void;
  onOpenEquationDialog: () => void;
  onNewComment?: () => void;
}

export const InsertTab: React.FC<InsertTabProps> = ({
  editor,
  onOpenTableDialog,
  onOpenSymbolDialog,
  onOpenEquationDialog,
  onNewComment,
}) => {
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [showShapesMenu, setShowShapesMenu] = useState(false);

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

  const handleInsertShape = (shapeType: string) => {
    let svgHtml = '';
    if (shapeType === 'rect') {
      svgHtml = `<div style="display:inline-block; margin: 8px 0;"><svg width="120" height="60"><rect width="120" height="60" rx="4" fill="#EFF6FC" stroke="#0F6CBD" stroke-width="2"/></svg></div>`;
    } else if (shapeType === 'circle') {
      svgHtml = `<div style="display:inline-block; margin: 8px 0;"><svg width="70" height="70"><circle cx="35" cy="35" r="32" fill="#EFF6FC" stroke="#0F6CBD" stroke-width="2"/></svg></div>`;
    } else if (shapeType === 'arrow') {
      svgHtml = `<div style="display:inline-block; margin: 8px 0;"><svg width="100" height="40"><path d="M5 20 L75 20 L75 10 L95 20 L75 30 L75 20" fill="#0F6CBD"/></svg></div>`;
    } else if (shapeType === 'star') {
      svgHtml = `<div style="display:inline-block; margin: 8px 0;"><svg width="60" height="60" viewBox="0 0 51 48"><polygon fill="#FFD700" stroke="#DAA520" stroke-width="2" points="25,1 32,18 49,18 35,29 40,46 25,36 10,46 15,29 1,18 18,18"/></svg></div>`;
    }
    if (svgHtml) {
      editor.chain().focus().insertContent(svgHtml).run();
    }
    setShowShapesMenu(false);
  };

  return (
    <div className="word-ribbon-panel">
      {/* 1. Pages Group */}
      <div className="word-ribbon-group">
        <button
          onClick={() => editor.chain().focus().insertContent('<h1>Document Title</h1><p class="subtitle">Subtitle</p><hr><p></p>').run()}
          className="ribbon-btn-large"
          title="Insert Pre-formatted Cover Page"
        >
          <FileText size={24} className="text-[#0F6CBD]" />
          <span>Cover Page</span>
        </button>
        <button
          onClick={handleInsertPageBreak}
          className="ribbon-btn-large"
          title="Insert Blank Page"
        >
          <FilePlus size={24} className="text-[#107C41]" />
          <span>Blank Page</span>
        </button>
        <button
          onClick={handleInsertPageBreak}
          className="ribbon-btn-large"
          title="Page Break (⌘↵)"
        >
          <Columns size={24} className="text-[#0F6CBD]" />
          <span>Page Break</span>
        </button>
      </div>

      <div className="word-group-divider" />

      {/* 2. Tables Group with Interactive 10x8 Grid Picker */}
      <div className="word-ribbon-group">
        <div className="relative">
          <button
            onClick={() => setShowTablePicker(!showTablePicker)}
            className="ribbon-btn-large"
            title="Insert Table"
          >
            <TableIcon size={24} className="text-[#0F6CBD]" />
            <div className="flex items-center gap-0.5">
              <span>Table</span>
              <ChevronDown size={9} className="text-[#616161]" />
            </div>
          </button>
          {showTablePicker && (
            <TableGridPicker
              onInsertTable={(rows, cols) => {
                (editor.chain().focus() as any).insertTable({ rows, cols, withHeaderRow: true }).run();
                setShowTablePicker(false);
              }}
              onOpenTableDialog={() => {
                setShowTablePicker(false);
                onOpenTableDialog();
              }}
              onClose={() => setShowTablePicker(false)}
            />
          )}
        </div>
      </div>

      <div className="word-group-divider" />

      {/* 3. Illustrations Group */}
      <div className="word-ribbon-group">
        <button
          onClick={handleInsertImage}
          className="ribbon-btn-large"
          title="Insert Picture from disk"
        >
          <ImageIcon size={24} className="text-[#107C41]" />
          <span>Pictures</span>
        </button>

        {/* Shapes Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowShapesMenu(!showShapesMenu)}
            className="ribbon-btn-large"
            title="Insert Geometric Shapes"
          >
            <Shapes size={24} className="text-[#D83B01]" />
            <div className="flex items-center gap-0.5">
              <span>Shapes</span>
              <ChevronDown size={9} className="text-[#616161]" />
            </div>
          </button>
          {showShapesMenu && (
            <div className="absolute top-16 left-0 bg-white border border-[#D1D1D6] rounded-md shadow-xl p-2 z-50 grid grid-cols-2 gap-2 w-48 text-xs">
              <button
                onClick={() => handleInsertShape('rect')}
                className="p-2 border border-[#EDEBE9] hover:bg-[#EFF6FC] rounded flex items-center gap-2"
              >
                <div className="w-5 h-3 bg-blue-100 border border-[#0F6CBD] rounded-xs" />
                <span>Rectangle</span>
              </button>
              <button
                onClick={() => handleInsertShape('circle')}
                className="p-2 border border-[#EDEBE9] hover:bg-[#EFF6FC] rounded flex items-center gap-2"
              >
                <div className="w-4 h-4 bg-blue-100 border border-[#0F6CBD] rounded-full" />
                <span>Circle</span>
              </button>
              <button
                onClick={() => handleInsertShape('arrow')}
                className="p-2 border border-[#EDEBE9] hover:bg-[#EFF6FC] rounded flex items-center gap-2"
              >
                <span className="text-[#0F6CBD] font-bold">➔</span>
                <span>Arrow</span>
              </button>
              <button
                onClick={() => handleInsertShape('star')}
                className="p-2 border border-[#EDEBE9] hover:bg-[#EFF6FC] rounded flex items-center gap-2"
              >
                <span className="text-amber-500">★</span>
                <span>Star</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="word-group-divider" />

      {/* 4. Links & Comments Group */}
      <div className="word-ribbon-group">
        <button
          onClick={() => {
            const url = prompt('Enter Hyperlink URL:', 'https://');
            if (url) (editor.chain().focus() as any).toggleLink({ href: url }).run();
          }}
          className="ribbon-btn-large"
          title="Insert Hyperlink (⌘K)"
        >
          <LinkIcon size={24} className="text-[#0F6CBD]" />
          <span>Link</span>
        </button>
        {onNewComment && (
          <button
            onClick={onNewComment}
            className="ribbon-btn-large"
            title="Add Comment (⌘⌥M)"
          >
            <MessageSquarePlus size={24} className="text-[#742774]" />
            <span>Comment</span>
          </button>
        )}
      </div>

      <div className="word-group-divider" />

      {/* 5. Header & Footer Group */}
      <div className="word-ribbon-group">
        <button
          onClick={() => alert('Double click on top margin of any page to edit Header.')}
          className="ribbon-btn-large"
          title="Header"
        >
          <FileText size={24} className="text-[#616161]" />
          <span>Header</span>
        </button>
        <button
          onClick={() => alert('Double click on bottom margin of any page to edit Footer.')}
          className="ribbon-btn-large"
          title="Footer"
        >
          <FileText size={24} className="text-[#616161]" />
          <span>Footer</span>
        </button>
        <button
          onClick={() => alert('Page Number options: Bottom of Page is active.')}
          className="ribbon-btn-large"
          title="Page Numbers"
        >
          <Hash size={24} className="text-[#616161]" />
          <span>Page Number</span>
        </button>
      </div>

      <div className="word-group-divider" />

      {/* 6. Symbols Group */}
      <div className="word-ribbon-group">
        <button
          onClick={onOpenEquationDialog}
          className="ribbon-btn-large"
          title="Insert Math Equation (⌥=)"
        >
          <Pi size={24} className="text-[#0F6CBD]" />
          <span>Equation</span>
        </button>
        <button
          onClick={onOpenSymbolDialog}
          className="ribbon-btn-large"
          title="Insert Symbol Palette"
        >
          <Omega size={24} className="text-[#0F6CBD]" />
          <span>Symbol</span>
        </button>
      </div>
    </div>
  );
};
