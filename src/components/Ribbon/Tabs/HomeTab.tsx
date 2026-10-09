import React, { useState } from 'react';
import {
  Clipboard,
  Copy,
  Scissors,
  Paintbrush,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Search,
  Replace,
  CheckSquare,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { Editor } from '@tiptap/react';

interface HomeTabProps {
  editor: Editor | null;
  onOpenFind: () => void;
  onOpenReplace: () => void;
  onOpenFontDialog: () => void;
  onOpenParagraphDialog: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  editor,
  onOpenFind,
  onOpenReplace,
  onOpenFontDialog,
  onOpenParagraphDialog,
}) => {
  const [fontFamily, setFontFamily] = useState('Aptos');
  const [fontSize, setFontSize] = useState('11');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showLineSpacing, setShowLineSpacing] = useState(false);

  if (!editor) return null;

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFontFamily(val);
    (editor.chain().focus() as any).setFontFamily(val).run();
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFontSize(val);
    // TipTap text style with custom font size
    editor.chain().focus().setMark('textStyle', { fontSize: `${val}pt` }).run();
  };

  const handleIncreaseSize = () => {
    const current = parseInt(fontSize, 10) || 11;
    const next = current + 1;
    setFontSize(String(next));
    editor.chain().focus().setMark('textStyle', { fontSize: `${next}pt` }).run();
  };

  const handleDecreaseSize = () => {
    const current = parseInt(fontSize, 10) || 11;
    const next = Math.max(8, current - 1);
    setFontSize(String(next));
    editor.chain().focus().setMark('textStyle', { fontSize: `${next}pt` }).run();
  };

  const handleClearFormatting = () => {
    editor.chain().focus().unsetAllMarks().clearNodes().run();
  };

  const colors = [
    '#000000', '#1F4E79', '#2E75B6', '#0078D4', '#107C41',
    '#D83B01', '#A80000', '#5C2D91', '#742774', '#595959',
  ];

  const highlights = [
    '#FFFF00', '#00FF00', '#00FFFF', '#FF00FF', '#0000FF',
    '#FF0000', '#000080', '#008080', '#008000', '#800080',
  ];

  return (
    <div className="word-ribbon-panel">
      {/* 1. Clipboard Group */}
      <div className="word-ribbon-group">
        <div className="word-group-content">
          <button
            onClick={() => {
              navigator.clipboard?.readText().then((txt) => {
                editor.commands.insertContent(txt);
              });
            }}
            className="ribbon-btn-large"
            title="Paste (Cmd+V)"
          >
            <Clipboard size={22} className="text-[#185ABD]" />
            <span>Paste</span>
          </button>
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => {
                document.execCommand('cut');
              }}
              className="ribbon-btn-small"
              title="Cut (Cmd+X)"
            >
              <Scissors size={14} />
            </button>
            <button
              onClick={() => {
                document.execCommand('copy');
              }}
              className="ribbon-btn-small"
              title="Copy (Cmd+C)"
            >
              <Copy size={14} />
            </button>
            <button
              onClick={() => {
                alert('Format Painter: Click text to apply formatting');
              }}
              className="ribbon-btn-small"
              title="Format Painter"
            >
              <Paintbrush size={14} />
            </button>
          </div>
        </div>
        <div className="word-group-label">Clipboard</div>
      </div>

      <div className="word-group-separator" />

      {/* 2. Font Group */}
      <div className="word-ribbon-group">
        <div className="flex flex-col gap-1.5 flex-1 justify-center">
          {/* Row 1: Font Family, Size, Steppers, Clear */}
          <div className="flex items-center gap-1">
            <select
              value={fontFamily}
              onChange={handleFontChange}
              className="h-6 text-xs border border-gray-300 rounded px-1.5 w-32 bg-white"
            >
              <option value="Aptos">Aptos</option>
              <option value="Calibri">Calibri</option>
              <option value="Arial">Arial</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Fira Code">Fira Code</option>
              <option value="Playfair Display">Playfair Display</option>
              <option value="Inter">Inter</option>
            </select>

            <select
              value={fontSize}
              onChange={handleFontSizeChange}
              className="h-6 text-xs border border-gray-300 rounded px-1 w-14 bg-white"
            >
              {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 36, 48, 72].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <button
              onClick={handleIncreaseSize}
              className="ribbon-btn-small text-xs font-semibold"
              title="Increase Font Size (Cmd+Shift+>)"
            >
              A<span className="text-[10px]">▲</span>
            </button>
            <button
              onClick={handleDecreaseSize}
              className="ribbon-btn-small text-xs font-semibold"
              title="Decrease Font Size (Cmd+Shift+<)"
            >
              A<span className="text-[10px]">▼</span>
            </button>
            <button
              onClick={handleClearFormatting}
              className="ribbon-btn-small"
              title="Clear All Formatting"
            >
              <RotateCcw size={13} className="text-red-500" />
            </button>
          </div>

          {/* Row 2: B, I, U, S, Sub, Sup, Highlight, Color */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`ribbon-btn-small ${editor.isActive('bold') ? 'active' : ''}`}
              title="Bold (Cmd+B)"
            >
              <Bold size={14} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`ribbon-btn-small ${editor.isActive('italic') ? 'active' : ''}`}
              title="Italic (Cmd+I)"
            >
              <Italic size={14} />
            </button>
            <button
              onClick={() => (editor.chain().focus() as any).toggleUnderline().run()}
              className={`ribbon-btn-small ${(editor.isActive as any)('underline') ? 'active' : ''}`}
              title="Underline (Cmd+U)"
            >
              <Underline size={14} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`ribbon-btn-small ${editor.isActive('strike') ? 'active' : ''}`}
              title="Strikethrough"
            >
              <Strikethrough size={14} />
            </button>
            <button
              onClick={() => (editor.chain().focus() as any).toggleSubscript().run()}
              className={`ribbon-btn-small ${(editor.isActive as any)('subscript') ? 'active' : ''}`}
              title="Subscript"
            >
              <Subscript size={14} />
            </button>
            <button
              onClick={() => (editor.chain().focus() as any).toggleSuperscript().run()}
              className={`ribbon-btn-small ${(editor.isActive as any)('superscript') ? 'active' : ''}`}
              title="Superscript"
            >
              <Superscript size={14} />
            </button>

            {/* Text Highlight */}
            <div className="relative">
              <button
                onClick={() => setShowHighlightPicker(!showHighlightPicker)}
                className="ribbon-btn-small flex items-center"
                title="Text Highlight Color"
              >
                <Highlighter size={13} className="text-yellow-600" />
              </button>
              {showHighlightPicker && (
                <div className="absolute top-7 left-0 bg-white p-2 border border-gray-300 rounded shadow-lg z-50 grid grid-cols-5 gap-1 w-36">
                  {highlights.map((c) => (
                    <div
                      key={c}
                      onClick={() => {
                        (editor.chain().focus() as any).toggleHighlight({ color: c }).run();
                        setShowHighlightPicker(false);
                      }}
                      className="w-5 h-5 rounded cursor-pointer border border-gray-200 hover:scale-110 transition"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Font Color */}
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="ribbon-btn-small flex items-center font-bold text-xs"
                title="Font Color"
              >
                <span className="underline decoration-red-600 decoration-2">A</span>
              </button>
              {showColorPicker && (
                <div className="absolute top-7 left-0 bg-white p-2 border border-gray-300 rounded shadow-lg z-50 grid grid-cols-5 gap-1 w-36">
                  {colors.map((c) => (
                    <div
                      key={c}
                      onClick={() => {
                        (editor.chain().focus() as any).setColor(c).run();
                        setShowColorPicker(false);
                      }}
                      className="w-5 h-5 rounded cursor-pointer border border-gray-200 hover:scale-110 transition"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="word-group-label">Font</div>
      </div>

      <div className="word-group-separator" />

      {/* 3. Paragraph Group */}
      <div className="word-ribbon-group">
        <div className="flex flex-col gap-1.5 flex-1 justify-center">
          {/* Row 1: Bullets, Numbers, Indents */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`ribbon-btn-small ${editor.isActive('bulletList') ? 'active' : ''}`}
              title="Bullets"
            >
              <List size={14} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`ribbon-btn-small ${editor.isActive('orderedList') ? 'active' : ''}`}
              title="Numbering"
            >
              <ListOrdered size={14} />
            </button>
            <button
              onClick={() => (editor.chain().focus() as any).liftListItem?.('listItem')?.run?.()}
              className="ribbon-btn-small"
              title="Decrease Indent"
            >
              <Outdent size={14} />
            </button>
            <button
              onClick={() => (editor.chain().focus() as any).sinkListItem?.('listItem')?.run?.()}
              className="ribbon-btn-small"
              title="Increase Indent"
            >
              <Indent size={14} />
            </button>
          </div>

          {/* Row 2: Alignment & Line Spacing */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => (editor.chain().focus() as any).setTextAlign('left').run()}
              className={`ribbon-btn-small ${(editor.isActive as any)({ textAlign: 'left' }) ? 'active' : ''}`}
              title="Align Left (Cmd+L)"
            >
              <AlignLeft size={14} />
            </button>
            <button
              onClick={() => (editor.chain().focus() as any).setTextAlign('center').run()}
              className={`ribbon-btn-small ${(editor.isActive as any)({ textAlign: 'center' }) ? 'active' : ''}`}
              title="Center (Cmd+E)"
            >
              <AlignCenter size={14} />
            </button>
            <button
              onClick={() => (editor.chain().focus() as any).setTextAlign('right').run()}
              className={`ribbon-btn-small ${(editor.isActive as any)({ textAlign: 'right' }) ? 'active' : ''}`}
              title="Align Right (Cmd+R)"
            >
              <AlignRight size={14} />
            </button>
            <button
              onClick={() => (editor.chain().focus() as any).setTextAlign('justify').run()}
              className={`ribbon-btn-small ${(editor.isActive as any)({ textAlign: 'justify' }) ? 'active' : ''}`}
              title="Justify (Cmd+J)"
            >
              <AlignJustify size={14} />
            </button>

            {/* Line Spacing Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLineSpacing(!showLineSpacing)}
                className="ribbon-btn-small"
                title="Line & Paragraph Spacing"
              >
                <ChevronDown size={13} />
              </button>
              {showLineSpacing && (
                <div className="absolute top-7 left-0 bg-white border border-gray-300 rounded shadow-lg py-1 z-50 text-xs w-32">
                  {[1.0, 1.15, 1.5, 2.0, 2.5, 3.0].map((spacing) => (
                    <button
                      key={spacing}
                      onClick={() => {
                        editor.chain().focus().setMark('textStyle', { lineHeight: String(spacing) }).run();
                        setShowLineSpacing(false);
                      }}
                      className="w-full text-left px-3 py-1 hover:bg-blue-600 hover:text-white"
                    >
                      {spacing.toFixed(2)}
                    </button>
                  ))}
                  <div className="h-px bg-gray-200 my-1" />
                  <button
                    onClick={() => {
                      onOpenParagraphDialog();
                      setShowLineSpacing(false);
                    }}
                    className="w-full text-left px-3 py-1 hover:bg-blue-600 hover:text-white"
                  >
                    Line Spacing Options…
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="word-group-label">Paragraph</div>
      </div>

      <div className="word-group-separator" />

      {/* 4. Styles Gallery Group */}
      <div className="word-ribbon-group">
        <div className="flex items-center gap-1.5 flex-1">
          <div
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`border rounded px-2.5 py-1 text-center cursor-pointer transition w-20 ${
              editor.isActive('paragraph') && !editor.isActive('heading')
                ? 'border-blue-600 bg-blue-50 text-blue-800 font-medium'
                : 'border-gray-200 hover:border-gray-400 bg-white'
            }`}
          >
            <div className="text-xs">Normal</div>
            <div className="text-[10px] text-gray-500 font-sans">AaBbCc</div>
          </div>

          <div
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`border rounded px-2.5 py-1 text-center cursor-pointer transition w-22 ${
              editor.isActive('heading', { level: 1 })
                ? 'border-blue-600 bg-blue-50 text-blue-800 font-semibold'
                : 'border-gray-200 hover:border-gray-400 bg-white'
            }`}
          >
            <div className="text-xs font-semibold text-[#1F4E79]">Heading 1</div>
            <div className="text-[10px] text-gray-500">AaBbCc</div>
          </div>

          <div
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`border rounded px-2.5 py-1 text-center cursor-pointer transition w-22 ${
              editor.isActive('heading', { level: 2 })
                ? 'border-blue-600 bg-blue-50 text-blue-800 font-medium'
                : 'border-gray-200 hover:border-gray-400 bg-white'
            }`}
          >
            <div className="text-xs font-medium text-[#2E75B6]">Heading 2</div>
            <div className="text-[10px] text-gray-500">AaBbCc</div>
          </div>

          <div
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`border rounded px-2.5 py-1 text-center cursor-pointer transition w-22 ${
              editor.isActive('heading', { level: 3 })
                ? 'border-blue-600 bg-blue-50 text-blue-800'
                : 'border-gray-200 hover:border-gray-400 bg-white'
            }`}
          >
            <div className="text-xs text-[#1F4E79]">Heading 3</div>
            <div className="text-[10px] text-gray-500">AaBbCc</div>
          </div>

          <div
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`border rounded px-2.5 py-1 text-center cursor-pointer transition w-20 ${
              editor.isActive('blockquote')
                ? 'border-blue-600 bg-blue-50 text-blue-800 italic'
                : 'border-gray-200 hover:border-gray-400 bg-white italic'
            }`}
          >
            <div className="text-xs">Quote</div>
            <div className="text-[10px] text-gray-500">“AaBbCc”</div>
          </div>
        </div>
        <div className="word-group-label">Styles</div>
      </div>

      <div className="word-group-separator" />

      {/* 5. Editing Group */}
      <div className="word-ribbon-group">
        <div className="flex flex-col gap-0.5 flex-1 justify-center">
          <button
            onClick={onOpenFind}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded text-xs text-gray-700"
            title="Find (Cmd+F)"
          >
            <Search size={13} className="text-[#185ABD]" />
            <span>Find</span>
          </button>
          <button
            onClick={onOpenReplace}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded text-xs text-gray-700"
            title="Replace (Cmd+H)"
          >
            <Replace size={13} className="text-[#185ABD]" />
            <span>Replace</span>
          </button>
          <button
            onClick={() => editor.chain().focus().selectAll().run()}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded text-xs text-gray-700"
            title="Select All (Cmd+A)"
          >
            <CheckSquare size={13} className="text-[#185ABD]" />
            <span>Select All</span>
          </button>
        </div>
        <div className="word-group-label">Editing</div>
      </div>
    </div>
  );
};
