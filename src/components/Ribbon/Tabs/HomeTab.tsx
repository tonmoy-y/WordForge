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
  ChevronDown,
  PaintBucket,
  Square,
  ArrowDownAZ,
  Maximize2,
  Pilcrow,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { Editor } from '@tiptap/react';
import { ThemeColorPicker } from '../ThemeColorPicker';

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
  const [showUnderlineMenu, setShowUnderlineMenu] = useState(false);
  const [showCaseMenu, setShowCaseMenu] = useState(false);
  const [showLineSpacing, setShowLineSpacing] = useState(false);
  const [showShadingPicker, setShowShadingPicker] = useState(false);
  const [showBordersMenu, setShowBordersMenu] = useState(false);
  const [showBulletsMenu, setShowBulletsMenu] = useState(false);
  const [showNumbersMenu, setShowNumbersMenu] = useState(false);
  const [styleScrollOffset, setStyleScrollOffset] = useState(0);

  if (!editor) return null;

  const fontFamilies = [
    'Aptos',
    'Aptos Display',
    'Calibri',
    'Calibri Light',
    'Arial',
    'Times New Roman',
    'Georgia',
    'Helvetica',
    'Verdana',
    'Trebuchet MS',
    'Courier New',
    'Consolas',
    'Palatino',
    'Garamond',
  ];

  const fontSizes = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '36', '48', '72'];

  const highlightColors = [
    '#FFFF00', '#00FF00', '#00FFFF', '#FF00FF', '#0000FF',
    '#FF0000', '#000080', '#008080', '#008000', '#800080',
    '#800000', '#808000', '#808080', '#C0C0C0', '#FCE4D6',
  ];

  const stylesGallery = [
    { id: 'normal', name: 'Normal', preview: 'AaBbCcDd', action: () => editor.chain().focus().setParagraph().run(), active: editor.isActive('paragraph') && !editor.isActive('heading') },
    { id: 'nospacing', name: 'No Spacing', preview: 'AaBbCcDd', action: () => editor.chain().focus().setParagraph().run(), active: false },
    { id: 'h1', name: 'Heading 1', preview: 'AaBbCcDd', color: '#1F4E79', bold: true, size: 'text-sm', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
    { id: 'h2', name: 'Heading 2', preview: 'AaBbCcDd', color: '#2E75B6', bold: true, size: 'text-xs', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
    { id: 'h3', name: 'Heading 3', preview: 'AaBbCcDd', color: '#1F4E79', size: 'text-xs', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }) },
    { id: 'title', name: 'Title', preview: 'AaBbCcDd', color: '#1F4E79', bold: true, size: 'text-base', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: false },
    { id: 'subtitle', name: 'Subtitle', preview: 'AaBbCcDd', color: '#595959', italic: true, size: 'text-xs', action: () => editor.chain().focus().setParagraph().run(), active: false },
    { id: 'quote', name: 'Quote', preview: '“AaBbCc”', color: '#4B5563', italic: true, size: 'text-xs', action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
  ];

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFontFamily(val);
    (editor.chain().focus() as any).setFontFamily(val).run();
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFontSize(val);
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

  const handleCaseChange = (caseType: 'sentence' | 'lower' | 'upper' | 'title') => {
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, ' ');
    if (!text) return;
    let modified = text;
    if (caseType === 'lower') modified = text.toLowerCase();
    else if (caseType === 'upper') modified = text.toUpperCase();
    else if (caseType === 'sentence') modified = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    else if (caseType === 'title') modified = text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase());

    editor.chain().focus().insertContentAt({ from, to }, modified).run();
    setShowCaseMenu(false);
  };

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
            title="Paste (⌘V)"
          >
            <Clipboard size={22} className="text-[#185ABD]" />
            <span>Paste</span>
          </button>
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => document.execCommand('cut')}
              className="ribbon-btn-small"
              title="Cut (⌘X)"
            >
              <Scissors size={13} />
            </button>
            <button
              onClick={() => document.execCommand('copy')}
              className="ribbon-btn-small"
              title="Copy (⌘C)"
            >
              <Copy size={13} />
            </button>
            <button
              onClick={() => alert('Format Painter activated. Select text to apply formatting.')}
              className="ribbon-btn-small"
              title="Format Painter"
            >
              <Paintbrush size={13} />
            </button>
          </div>
        </div>
        <div className="word-group-label">Clipboard</div>
      </div>

      <div className="word-group-separator" />

      {/* 2. Font Group */}
      <div className="word-ribbon-group">
        <div className="flex flex-col gap-1 flex-1 justify-center">
          {/* Row 1: Font Family, Size, Size +/- , Case, Clear */}
          <div className="flex items-center gap-1">
            <select
              value={fontFamily}
              onChange={handleFontChange}
              className="h-6 text-xs px-2 border border-gray-300 rounded bg-white font-medium text-gray-800 outline-none w-32 focus:border-blue-500"
            >
              {fontFamilies.map((f) => (
                <option key={f} value={f} style={{ fontFamily: f }}>
                  {f}
                </option>
              ))}
            </select>

            <select
              value={fontSize}
              onChange={handleFontSizeChange}
              className="h-6 text-xs px-1 border border-gray-300 rounded bg-white font-medium text-gray-800 outline-none w-12 text-center focus:border-blue-500"
            >
              {fontSizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <button
              onClick={handleIncreaseSize}
              className="ribbon-btn-small flex items-baseline justify-center"
              title="Increase Font Size (⌘>)"
            >
              <span className="text-xs font-semibold">A</span>
              <span className="text-[7px] font-bold text-gray-500 ml-0.5">▲</span>
            </button>
            <button
              onClick={handleDecreaseSize}
              className="ribbon-btn-small flex items-baseline justify-center"
              title="Decrease Font Size (⌘<)"
            >
              <span className="text-xs font-semibold">A</span>
              <span className="text-[7px] font-bold text-gray-500 ml-0.5">▼</span>
            </button>

            {/* Change Case Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCaseMenu(!showCaseMenu)}
                className="ribbon-btn-small text-xs font-semibold flex items-center"
                title="Change Case"
              >
                <span>Aa</span>
              </button>
              {showCaseMenu && (
                <div className="absolute top-7 left-0 bg-white border border-gray-300 rounded shadow-xl py-1 z-50 text-xs w-44">
                  <button onClick={() => handleCaseChange('sentence')} className="w-full text-left px-3 py-1 hover:bg-blue-50 text-gray-800">Sentence case.</button>
                  <button onClick={() => handleCaseChange('lower')} className="w-full text-left px-3 py-1 hover:bg-blue-50 text-gray-800">lowercase</button>
                  <button onClick={() => handleCaseChange('upper')} className="w-full text-left px-3 py-1 hover:bg-blue-50 text-gray-800">UPPERCASE</button>
                  <button onClick={() => handleCaseChange('title')} className="w-full text-left px-3 py-1 hover:bg-blue-50 text-gray-800">Capitalize Each Word</button>
                </div>
              )}
            </div>

            <button
              onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
              className="ribbon-btn-small"
              title="Clear All Formatting"
            >
              <span className="text-[11px] font-bold text-gray-500">A⌫</span>
            </button>
          </div>

          {/* Row 2: Bold, Italic, Underline, Strike, Sub, Super, Text Effect, Highlight, Font Color */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`ribbon-btn-small font-bold text-xs ${editor.isActive('bold') ? 'active' : ''}`}
              title="Bold (⌘B)"
            >
              <Bold size={13} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`ribbon-btn-small italic text-xs ${editor.isActive('italic') ? 'active' : ''}`}
              title="Italic (⌘I)"
            >
              <Italic size={13} />
            </button>

            {/* Underline with Split Dropdown */}
            <div className="relative flex items-center">
              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`ribbon-btn-small underline text-xs ${editor.isActive('underline') ? 'active' : ''}`}
                title="Underline (⌘U)"
              >
                <Underline size={13} />
              </button>
              <button
                onClick={() => setShowUnderlineMenu(!showUnderlineMenu)}
                className="w-3 h-6 flex items-center justify-center hover:bg-gray-100 rounded-r text-gray-500"
              >
                <ChevronDown size={9} />
              </button>
              {showUnderlineMenu && (
                <div className="absolute top-7 left-0 bg-white border border-gray-300 rounded shadow-xl py-1 z-50 text-xs w-36">
                  <button onClick={() => { editor.chain().focus().toggleUnderline().run(); setShowUnderlineMenu(false); }} className="w-full text-left px-3 py-1 hover:bg-blue-50">Single Underline</button>
                  <button onClick={() => { editor.chain().focus().setMark('textStyle', { textDecoration: 'underline double' }).run(); setShowUnderlineMenu(false); }} className="w-full text-left px-3 py-1 hover:bg-blue-50">Double Underline</button>
                  <button onClick={() => { editor.chain().focus().setMark('textStyle', { textDecoration: 'underline dotted' }).run(); setShowUnderlineMenu(false); }} className="w-full text-left px-3 py-1 hover:bg-blue-50">Dotted Underline</button>
                  <button onClick={() => { editor.chain().focus().setMark('textStyle', { textDecoration: 'underline dashed' }).run(); setShowUnderlineMenu(false); }} className="w-full text-left px-3 py-1 hover:bg-blue-50">Dashed Underline</button>
                  <button onClick={() => { editor.chain().focus().setMark('textStyle', { textDecoration: 'underline wavy' }).run(); setShowUnderlineMenu(false); }} className="w-full text-left px-3 py-1 hover:bg-blue-50">Wavy Underline</button>
                </div>
              )}
            </div>

            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`ribbon-btn-small line-through text-xs ${editor.isActive('strike') ? 'active' : ''}`}
              title="Strikethrough"
            >
              <Strikethrough size={13} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              className={`ribbon-btn-small text-xs ${editor.isActive('subscript') ? 'active' : ''}`}
              title="Subscript (⌘=)"
            >
              <Subscript size={13} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              className={`ribbon-btn-small text-xs ${editor.isActive('superscript') ? 'active' : ''}`}
              title="Superscript (⇧⌘+)"
            >
              <Superscript size={13} />
            </button>

            <button
              onClick={() => alert('Text Effects: Outline, Shadow, Reflection applied to selection.')}
              className="ribbon-btn-small text-xs font-bold text-cyan-600"
              title="Text Effects & Typography"
            >
              <Sparkles size={13} />
            </button>

            {/* Highlight Picker */}
            <div className="relative">
              <button
                onClick={() => setShowHighlightPicker(!showHighlightPicker)}
                className="ribbon-btn-small flex items-center gap-0.5"
                title="Text Highlight Color"
              >
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-bold text-gray-700 leading-tight">ab</span>
                  <div className="w-3.5 h-1 bg-yellow-400 rounded-xs" />
                </div>
                <ChevronDown size={8} className="text-gray-400" />
              </button>
              {showHighlightPicker && (
                <div className="absolute top-7 left-0 bg-white p-2 border border-gray-300 rounded shadow-xl z-50 w-44">
                  <div className="text-[10px] font-semibold text-gray-500 uppercase mb-1">Highlight Colors</div>
                  <div className="grid grid-cols-5 gap-1 mb-2">
                    {highlightColors.map((c) => (
                      <div
                        key={c}
                        onClick={() => {
                          (editor.chain().focus() as any).toggleHighlight({ color: c }).run();
                          setShowHighlightPicker(false);
                        }}
                        className="w-5 h-5 rounded-xs cursor-pointer border border-gray-300 hover:scale-115 transition"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      (editor.chain().focus() as any).unsetHighlight().run();
                      setShowHighlightPicker(false);
                    }}
                    className="w-full text-left text-xs text-gray-700 hover:bg-gray-100 p-1 rounded"
                  >
                    No Color
                  </button>
                </div>
              )}
            </div>

            {/* Font Color with Office Theme Palette */}
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="ribbon-btn-small flex items-center gap-0.5"
                title="Font Color"
              >
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-gray-800 leading-tight">A</span>
                  <div className="w-3.5 h-1 bg-red-600 rounded-xs" />
                </div>
                <ChevronDown size={8} className="text-gray-400" />
              </button>
              {showColorPicker && (
                <ThemeColorPicker
                  onSelectColor={(color) => {
                    if (color) (editor.chain().focus() as any).setColor(color).run();
                    else (editor.chain().focus() as any).unsetColor().run();
                    setShowColorPicker(false);
                  }}
                  onClose={() => setShowColorPicker(false)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Group Label + Font Dialog Launcher Button */}
        <div className="flex items-center justify-between px-1">
          <span className="word-group-label flex-1 text-center">Font</span>
          <button
            onClick={onOpenFontDialog}
            className="p-0.5 text-gray-400 hover:text-blue-600 rounded transition"
            title="Open Font Dialog (⌘D)"
          >
            <Maximize2 size={10} />
          </button>
        </div>
      </div>

      <div className="word-group-separator" />

      {/* 3. Paragraph Group */}
      <div className="word-ribbon-group">
        <div className="flex flex-col gap-1 flex-1 justify-center">
          {/* Row 1: Bullets, Numbering, Multilevel, Indents, Sort, Pilcrow */}
          <div className="flex items-center gap-1">
            {/* Bullets with dropdown */}
            <div className="relative flex items-center">
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`ribbon-btn-small ${editor.isActive('bulletList') ? 'active' : ''}`}
                title="Bullets"
              >
                <List size={13} />
              </button>
              <button
                onClick={() => setShowBulletsMenu(!showBulletsMenu)}
                className="w-3 h-6 flex items-center justify-center hover:bg-gray-100 rounded-r text-gray-500"
              >
                <ChevronDown size={8} />
              </button>
              {showBulletsMenu && (
                <div className="absolute top-7 left-0 bg-white border border-gray-300 rounded shadow-xl p-2 z-50 grid grid-cols-3 gap-1.5 w-36">
                  {['•', '◦', '■', '★', '➔', '✓'].map((bullet) => (
                    <button
                      key={bullet}
                      onClick={() => {
                        editor.chain().focus().toggleBulletList().run();
                        setShowBulletsMenu(false);
                      }}
                      className="h-8 border border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded flex items-center justify-center text-sm font-bold"
                    >
                      {bullet}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Numbering with dropdown */}
            <div className="relative flex items-center">
              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`ribbon-btn-small ${editor.isActive('orderedList') ? 'active' : ''}`}
                title="Numbering"
              >
                <ListOrdered size={13} />
              </button>
              <button
                onClick={() => setShowNumbersMenu(!showNumbersMenu)}
                className="w-3 h-6 flex items-center justify-center hover:bg-gray-100 rounded-r text-gray-500"
              >
                <ChevronDown size={8} />
              </button>
              {showNumbersMenu && (
                <div className="absolute top-7 left-0 bg-white border border-gray-300 rounded shadow-xl p-2 z-50 grid grid-cols-2 gap-1.5 w-40">
                  {['1. 2. 3.', 'A. B. C.', 'a) b) c)', 'i. ii. iii.'].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        editor.chain().focus().toggleOrderedList().run();
                        setShowNumbersMenu(false);
                      }}
                      className="h-8 border border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded flex items-center justify-center text-xs font-mono"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => (editor.chain().focus() as any).liftListItem?.('listItem')?.run?.()}
              className="ribbon-btn-small"
              title="Decrease Indent"
            >
              <Outdent size={13} />
            </button>
            <button
              onClick={() => (editor.chain().focus() as any).sinkListItem?.('listItem')?.run?.()}
              className="ribbon-btn-small"
              title="Increase Indent"
            >
              <Indent size={13} />
            </button>
            <button
              onClick={() => alert('Sort paragraphs alphabetically')}
              className="ribbon-btn-small"
              title="Sort"
            >
              <ArrowDownAZ size={13} />
            </button>
            <button
              onClick={() => alert('Show/Hide Paragraph marks (¶)')}
              className="ribbon-btn-small"
              title="Show/Hide Paragraph Marks (¶)"
            >
              <Pilcrow size={13} />
            </button>
          </div>

          {/* Row 2: Align Left, Center, Right, Justify, Line Spacing, Shading, Borders */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => (editor.chain().focus() as any).setTextAlign('left').run()}
              className={`ribbon-btn-small ${(editor.isActive as any)({ textAlign: 'left' }) ? 'active' : ''}`}
              title="Align Left (⌘L)"
            >
              <AlignLeft size={13} />
            </button>
            <button
              onClick={() => (editor.chain().focus() as any).setTextAlign('center').run()}
              className={`ribbon-btn-small ${(editor.isActive as any)({ textAlign: 'center' }) ? 'active' : ''}`}
              title="Center (⌘E)"
            >
              <AlignCenter size={13} />
            </button>
            <button
              onClick={() => (editor.chain().focus() as any).setTextAlign('right').run()}
              className={`ribbon-btn-small ${(editor.isActive as any)({ textAlign: 'right' }) ? 'active' : ''}`}
              title="Align Right (⌘R)"
            >
              <AlignRight size={13} />
            </button>
            <button
              onClick={() => (editor.chain().focus() as any).setTextAlign('justify').run()}
              className={`ribbon-btn-small ${(editor.isActive as any)({ textAlign: 'justify' }) ? 'active' : ''}`}
              title="Justify (⌘J)"
            >
              <AlignJustify size={13} />
            </button>

            {/* Line Spacing */}
            <div className="relative">
              <button
                onClick={() => setShowLineSpacing(!showLineSpacing)}
                className="ribbon-btn-small flex items-center"
                title="Line and Paragraph Spacing"
              >
                <div className="flex flex-col items-center">
                  <div className="w-3 h-0.5 bg-gray-700 mb-0.5" />
                  <div className="w-3 h-0.5 bg-gray-700 mb-0.5" />
                  <div className="w-3 h-0.5 bg-gray-700" />
                </div>
                <ChevronDown size={8} className="text-gray-400 ml-0.5" />
              </button>
              {showLineSpacing && (
                <div className="absolute top-7 left-0 bg-white border border-gray-300 rounded shadow-xl py-1 z-50 text-xs w-36">
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

            {/* Shading Paint Bucket */}
            <div className="relative">
              <button
                onClick={() => setShowShadingPicker(!showShadingPicker)}
                className="ribbon-btn-small flex items-center gap-0.5"
                title="Shading"
              >
                <PaintBucket size={13} />
                <ChevronDown size={8} className="text-gray-400" />
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

            {/* Borders */}
            <div className="relative">
              <button
                onClick={() => setShowBordersMenu(!showBordersMenu)}
                className="ribbon-btn-small flex items-center gap-0.5"
                title="Borders"
              >
                <Square size={13} />
                <ChevronDown size={8} className="text-gray-400" />
              </button>
              {showBordersMenu && (
                <div className="absolute top-7 left-0 bg-white border border-gray-300 rounded shadow-xl py-1 z-50 text-xs w-40">
                  <button onClick={() => setShowBordersMenu(false)} className="w-full text-left px-3 py-1 hover:bg-blue-50">Bottom Border</button>
                  <button onClick={() => setShowBordersMenu(false)} className="w-full text-left px-3 py-1 hover:bg-blue-50">Top Border</button>
                  <button onClick={() => setShowBordersMenu(false)} className="w-full text-left px-3 py-1 hover:bg-blue-50">Left Border</button>
                  <button onClick={() => setShowBordersMenu(false)} className="w-full text-left px-3 py-1 hover:bg-blue-50">Right Border</button>
                  <button onClick={() => setShowBordersMenu(false)} className="w-full text-left px-3 py-1 hover:bg-blue-50">All Borders</button>
                  <button onClick={() => setShowBordersMenu(false)} className="w-full text-left px-3 py-1 hover:bg-blue-50">Outside Borders</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Group Label + Paragraph Dialog Launcher Button */}
        <div className="flex items-center justify-between px-1">
          <span className="word-group-label flex-1 text-center">Paragraph</span>
          <button
            onClick={onOpenParagraphDialog}
            className="p-0.5 text-gray-400 hover:text-blue-600 rounded transition"
            title="Open Paragraph Dialog"
          >
            <Maximize2 size={10} />
          </button>
        </div>
      </div>

      <div className="word-group-separator" />

      {/* 4. Styles Gallery Group with Authentic Word Cards */}
      <div className="word-ribbon-group">
        <div className="flex items-center gap-1.5 flex-1 overflow-hidden max-w-[360px]">
          {stylesGallery.slice(styleScrollOffset, styleScrollOffset + 4).map((s) => (
            <div
              key={s.id}
              onClick={s.action}
              className={`w-20 h-14 rounded-xs border p-1.5 cursor-pointer transition select-none flex flex-col justify-between ${
                s.active
                  ? 'border-[#185ABD] bg-blue-50/60 ring-1 ring-[#185ABD]'
                  : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50 bg-white'
              }`}
              title={s.name}
            >
              <div
                className={`truncate ${s.size || 'text-xs'} ${s.bold ? 'font-bold' : ''} ${s.italic ? 'italic' : ''}`}
                style={{ color: s.color || '#1F2937' }}
              >
                {s.preview}
              </div>
              <div className="text-[10px] text-gray-600 font-medium truncate">{s.name}</div>
            </div>
          ))}

          {/* Stepper controls */}
          <div className="flex flex-col gap-1 shrink-0 ml-1">
            <button
              onClick={() => setStyleScrollOffset(Math.max(0, styleScrollOffset - 1))}
              disabled={styleScrollOffset === 0}
              className="p-1 hover:bg-gray-100 rounded text-gray-600 disabled:opacity-30"
              title="Previous Styles"
            >
              <ChevronLeft size={11} />
            </button>
            <button
              onClick={() => setStyleScrollOffset(Math.min(stylesGallery.length - 4, styleScrollOffset + 1))}
              disabled={styleScrollOffset >= stylesGallery.length - 4}
              className="p-1 hover:bg-gray-100 rounded text-gray-600 disabled:opacity-30"
              title="Next Styles"
            >
              <ChevronRight size={11} />
            </button>
          </div>
        </div>
        <div className="word-group-label">Styles</div>
      </div>

      <div className="word-group-separator" />

      {/* 5. Editing Group */}
      <div className="word-ribbon-group">
        <div className="flex flex-col gap-1 justify-center flex-1">
          <button
            onClick={onOpenFind}
            className="h-6 flex items-center gap-1.5 px-2 text-xs font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded transition border border-transparent hover:border-gray-300 cursor-pointer"
            title="Find Text (⌘F)"
          >
            <Search size={12} className="text-[#185ABD] shrink-0" />
            <span>Find</span>
          </button>
          <button
            onClick={onOpenReplace}
            className="h-6 flex items-center gap-1.5 px-2 text-xs font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded transition border border-transparent hover:border-gray-300 cursor-pointer"
            title="Replace Text (⌥⌘F)"
          >
            <Replace size={12} className="text-[#107C41] shrink-0" />
            <span>Replace</span>
          </button>
        </div>
        <div className="word-group-label">Editing</div>
      </div>
    </div>
  );
};
