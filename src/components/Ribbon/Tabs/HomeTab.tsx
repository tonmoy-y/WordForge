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
  Pilcrow,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Layers,
  Mic,
  FileCheck,
} from 'lucide-react';
import { Editor } from '@tiptap/react';
import { ThemeColorPicker } from '../ThemeColorPicker';
import { FontPicker } from '../FontPicker';
import { FontSizePicker } from '../FontSizePicker';

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

  const highlightColors = [
    '#FFFF00', '#00FF00', '#00FFFF', '#FF00FF', '#0000FF',
    '#FF0000', '#000080', '#008080', '#008000', '#800080',
    '#800000', '#808000', '#808080', '#C0C0C0', '#FCE4D6',
  ];

  const stylesGallery = [
    { id: 'normal', name: 'Normal', preview: 'AaBbCcDd', color: '#201F1E', bold: false, size: 'text-[12px]', action: () => editor.chain().focus().setParagraph().run(), active: editor.isActive('paragraph') && !editor.isActive('heading') },
    { id: 'nospacing', name: 'No Spacing', preview: 'AaBbCcDd', color: '#201F1E', bold: false, size: 'text-[12px]', action: () => editor.chain().focus().setParagraph().run(), active: false },
    { id: 'h1', name: 'Heading 1', preview: 'AaBbCcD', color: '#1F4E79', bold: true, size: 'text-[13px]', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
    { id: 'h2', name: 'Heading 2', preview: 'AaBbCcD', color: '#2E75B6', bold: true, size: 'text-[12px]', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
    { id: 'title', name: 'Title', preview: 'AaBb', color: '#1F4E79', bold: true, size: 'text-[15px]', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: false },
    { id: 'subtitle', name: 'Subtitle', preview: 'AaBbCc', color: '#595959', italic: true, size: 'text-[11px]', action: () => editor.chain().focus().setParagraph().run(), active: false },
    { id: 'quote', name: 'Quote', preview: '“AaBb”', color: '#4B5563', italic: true, size: 'text-[11px]', action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
  ];

  const handleFontChange = (font: string) => {
    setFontFamily(font);
    (editor.chain().focus() as any).setFontFamily(font).run();
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    editor.chain().focus().setMark('textStyle', { fontSize: `${size}pt` }).run();
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
        <button
          onClick={() => {
            navigator.clipboard?.readText().then((txt) => {
              editor.commands.insertContent(txt);
            });
          }}
          className="ribbon-btn-large"
          title="Paste (⌘V)"
        >
          <Clipboard size={22} className="text-[#0F6CBD]" />
          <div className="flex items-center gap-0.5 mt-0.5">
            <span className="text-[11px] font-normal text-[#201F1E]">Paste</span>
            <ChevronDown size={8} className="text-[#605E5C]" />
          </div>
        </button>
        <div className="flex flex-col gap-0.5 justify-center">
          <button
            onClick={() => document.execCommand('cut')}
            className="ribbon-btn-small"
            title="Cut (⌘X)"
          >
            <Scissors size={14} />
          </button>
          <button
            onClick={() => document.execCommand('copy')}
            className="ribbon-btn-small"
            title="Copy (⌘C)"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={() => alert('Format Painter: Select text to copy and apply styling.')}
            className="ribbon-btn-small"
            title="Format Painter"
          >
            <Paintbrush size={14} />
          </button>
        </div>
      </div>

      <div className="word-group-divider" />

      {/* 2. Font Group */}
      <div className="word-ribbon-group">
        <div className="flex flex-col gap-1 justify-center">
          {/* Row 1: Font Family, Size, Size +/- , Case, Clear */}
          <div className="flex items-center gap-1">
            <FontPicker value={fontFamily} onChange={handleFontChange} />
            <FontSizePicker value={fontSize} onChange={handleFontSizeChange} />

            <button
              onClick={handleIncreaseSize}
              className="ribbon-btn-small flex items-baseline justify-center"
              title="Increase Font Size (⌘>)"
            >
              <span className="text-xs font-semibold">A</span>
              <span className="text-[7px] font-bold text-[#616161] ml-0.5">▲</span>
            </button>
            <button
              onClick={handleDecreaseSize}
              className="ribbon-btn-small flex items-baseline justify-center"
              title="Decrease Font Size (⌘<)"
            >
              <span className="text-xs font-semibold">A</span>
              <span className="text-[7px] font-bold text-[#616161] ml-0.5">▼</span>
            </button>

            {/* Change Case Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCaseMenu(!showCaseMenu)}
                className="ribbon-btn-small text-xs font-medium flex items-center"
                title="Change Case"
              >
                <span>Aa</span>
                <ChevronDown size={8} className="text-[#616161] ml-0.5" />
              </button>
              {showCaseMenu && (
                <div className="absolute top-7 left-0 bg-white border border-[#D1D1D6] rounded-md shadow-xl py-1 z-50 text-xs w-44">
                  <button onClick={() => handleCaseChange('sentence')} className="w-full text-left px-3 py-1 hover:bg-[#F3F2F1] text-[#242424]">Sentence case.</button>
                  <button onClick={() => handleCaseChange('lower')} className="w-full text-left px-3 py-1 hover:bg-[#F3F2F1] text-[#242424]">lowercase</button>
                  <button onClick={() => handleCaseChange('upper')} className="w-full text-left px-3 py-1 hover:bg-[#F3F2F1] text-[#242424]">UPPERCASE</button>
                  <button onClick={() => handleCaseChange('title')} className="w-full text-left px-3 py-1 hover:bg-[#F3F2F1] text-[#242424]">Capitalize Each Word</button>
                </div>
              )}
            </div>

            <button
              onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
              className="ribbon-btn-small"
              title="Clear All Formatting"
            >
              <span className="text-[11px] font-medium text-[#616161]">A⌫</span>
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
                className="w-2.5 h-6 flex items-center justify-center hover:bg-black/5 rounded-r text-[#616161]"
              >
                <ChevronDown size={8} />
              </button>
              {showUnderlineMenu && (
                <div className="absolute top-7 left-0 bg-white border border-[#D1D1D6] rounded-md shadow-xl py-1 z-50 text-xs w-36">
                  <button onClick={() => { editor.chain().focus().toggleUnderline().run(); setShowUnderlineMenu(false); }} className="w-full text-left px-3 py-1 hover:bg-[#F3F2F1]">Single Underline</button>
                  <button onClick={() => { editor.chain().focus().setMark('textStyle', { textDecoration: 'underline double' }).run(); setShowUnderlineMenu(false); }} className="w-full text-left px-3 py-1 hover:bg-[#F3F2F1]">Double Underline</button>
                  <button onClick={() => { editor.chain().focus().setMark('textStyle', { textDecoration: 'underline dotted' }).run(); setShowUnderlineMenu(false); }} className="w-full text-left px-3 py-1 hover:bg-[#F3F2F1]">Dotted Underline</button>
                  <button onClick={() => { editor.chain().focus().setMark('textStyle', { textDecoration: 'underline dashed' }).run(); setShowUnderlineMenu(false); }} className="w-full text-left px-3 py-1 hover:bg-[#F3F2F1]">Dashed Underline</button>
                  <button onClick={() => { editor.chain().focus().setMark('textStyle', { textDecoration: 'underline wavy' }).run(); setShowUnderlineMenu(false); }} className="w-full text-left px-3 py-1 hover:bg-[#F3F2F1]">Wavy Underline</button>
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
              className="ribbon-btn-small text-xs font-bold text-cyan-700"
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
                  <span className="text-[11px] font-bold text-[#242424] leading-tight">ab</span>
                  <div className="w-3.5 h-1 bg-yellow-400 rounded-xs" />
                </div>
                <ChevronDown size={8} className="text-[#616161]" />
              </button>
              {showHighlightPicker && (
                <div className="absolute top-7 left-0 bg-white p-2 border border-[#D1D1D6] rounded-md shadow-xl z-50 w-44">
                  <div className="text-[10px] font-semibold text-[#8A8886] uppercase mb-1">Highlight Colors</div>
                  <div className="grid grid-cols-5 gap-1 mb-2">
                    {highlightColors.map((c) => (
                      <div
                        key={c}
                        onClick={() => {
                          (editor.chain().focus() as any).toggleHighlight({ color: c }).run();
                          setShowHighlightPicker(false);
                        }}
                        className="w-5 h-5 rounded-xs cursor-pointer border border-[#D1D1D6] hover:scale-115 transition"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      (editor.chain().focus() as any).unsetHighlight().run();
                      setShowHighlightPicker(false);
                    }}
                    className="w-full text-left text-xs text-[#242424] hover:bg-[#F3F2F1] p-1 rounded"
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
                  <span className="text-xs font-bold text-[#242424] leading-tight">A</span>
                  <div className="w-3.5 h-1 bg-red-600 rounded-xs" />
                </div>
                <ChevronDown size={8} className="text-[#616161]" />
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
      </div>

      <div className="word-group-divider" />

      {/* 3. Paragraph Group */}
      <div className="word-ribbon-group">
        <div className="flex flex-col gap-1 justify-center">
          {/* Row 1: Bullets, Numbering, Multilevel, Indents, Sort, Pilcrow */}
          <div className="flex items-center gap-1">
            {/* Bullets with dropdown */}
            <div className="relative flex items-center">
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`ribbon-btn-small ${editor.isActive('bulletList') ? 'active' : ''}`}
                title="Bullets"
              >
                <List size={14} />
              </button>
              <button
                onClick={() => setShowBulletsMenu(!showBulletsMenu)}
                className="w-2.5 h-6 flex items-center justify-center hover:bg-black/5 rounded-r text-[#616161]"
              >
                <ChevronDown size={8} />
              </button>
              {showBulletsMenu && (
                <div className="absolute top-7 left-0 bg-white border border-[#D1D1D6] rounded-md shadow-xl p-2 z-50 grid grid-cols-3 gap-1.5 w-36">
                  {['•', '◦', '■', '★', '➔', '✓'].map((bullet) => (
                    <button
                      key={bullet}
                      onClick={() => {
                        editor.chain().focus().toggleBulletList().run();
                        setShowBulletsMenu(false);
                      }}
                      className="h-8 border border-[#EDEBE9] hover:border-[#0F6CBD] hover:bg-[#EFF6FC] rounded flex items-center justify-center text-sm font-bold"
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
                <ListOrdered size={14} />
              </button>
              <button
                onClick={() => setShowNumbersMenu(!showNumbersMenu)}
                className="w-2.5 h-6 flex items-center justify-center hover:bg-black/5 rounded-r text-[#616161]"
              >
                <ChevronDown size={8} />
              </button>
              {showNumbersMenu && (
                <div className="absolute top-7 left-0 bg-white border border-[#D1D1D6] rounded-md shadow-xl p-2 z-50 grid grid-cols-2 gap-1.5 w-40">
                  {['1. 2. 3.', 'A. B. C.', 'a) b) c)', 'i. ii. iii.'].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        editor.chain().focus().toggleOrderedList().run();
                        setShowNumbersMenu(false);
                      }}
                      className="h-8 border border-[#EDEBE9] hover:border-[#0F6CBD] hover:bg-[#EFF6FC] rounded flex items-center justify-center text-xs font-mono"
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
              <Outdent size={14} />
            </button>
            <button
              onClick={() => (editor.chain().focus() as any).sinkListItem?.('listItem')?.run?.()}
              className="ribbon-btn-small"
              title="Increase Indent"
            >
              <Indent size={14} />
            </button>
            <button
              onClick={() => alert('Sort paragraphs alphabetically')}
              className="ribbon-btn-small"
              title="Sort"
            >
              <ArrowDownAZ size={14} />
            </button>
            <button
              onClick={() => alert('Show/Hide Paragraph marks (¶)')}
              className="ribbon-btn-small"
              title="Show/Hide Paragraph Marks (¶)"
            >
              <Pilcrow size={14} />
            </button>
          </div>

          {/* Row 2: Align Left, Center, Right, Justify, Line Spacing, Shading, Borders */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => (editor.chain().focus() as any).setTextAlign('left').run()}
              className={`ribbon-btn-small ${(editor.isActive as any)({ textAlign: 'left' }) ? 'active' : ''}`}
              title="Align Left (⌘L)"
            >
              <AlignLeft size={14} />
            </button>
            <button
              onClick={() => (editor.chain().focus() as any).setTextAlign('center').run()}
              className={`ribbon-btn-small ${(editor.isActive as any)({ textAlign: 'center' }) ? 'active' : ''}`}
              title="Center (⌘E)"
            >
              <AlignCenter size={14} />
            </button>
            <button
              onClick={() => (editor.chain().focus() as any).setTextAlign('right').run()}
              className={`ribbon-btn-small ${(editor.isActive as any)({ textAlign: 'right' }) ? 'active' : ''}`}
              title="Align Right (⌘R)"
            >
              <AlignRight size={14} />
            </button>
            <button
              onClick={() => (editor.chain().focus() as any).setTextAlign('justify').run()}
              className={`ribbon-btn-small ${(editor.isActive as any)({ textAlign: 'justify' }) ? 'active' : ''}`}
              title="Justify (⌘J)"
            >
              <AlignJustify size={14} />
            </button>

            {/* Line Spacing */}
            <div className="relative">
              <button
                onClick={() => setShowLineSpacing(!showLineSpacing)}
                className="ribbon-btn-small flex items-center"
                title="Line and Paragraph Spacing"
              >
                <div className="flex flex-col items-center">
                  <div className="w-3 h-0.5 bg-[#424242] mb-0.5" />
                  <div className="w-3 h-0.5 bg-[#424242] mb-0.5" />
                  <div className="w-3 h-0.5 bg-[#424242]" />
                </div>
                <ChevronDown size={8} className="text-[#616161] ml-0.5" />
              </button>
              {showLineSpacing && (
                <div className="absolute top-7 left-0 bg-white border border-[#D1D1D6] rounded-md shadow-xl py-1 z-50 text-xs w-40">
                  {[1.0, 1.15, 1.5, 2.0, 2.5, 3.0].map((spacing) => (
                    <button
                      key={spacing}
                      onClick={() => {
                        editor.chain().focus().setMark('textStyle', { lineHeight: String(spacing) }).run();
                        setShowLineSpacing(false);
                      }}
                      className="w-full text-left px-3 py-1 hover:bg-[#EFF6FC] hover:text-[#0F6CBD]"
                    >
                      {spacing.toFixed(2)}
                    </button>
                  ))}
                  <div className="h-px bg-[#EDEBE9] my-1" />
                  <button
                    onClick={() => {
                      onOpenParagraphDialog();
                      setShowLineSpacing(false);
                    }}
                    className="w-full text-left px-3 py-1 hover:bg-[#EFF6FC] hover:text-[#0F6CBD]"
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
                <PaintBucket size={14} />
                <ChevronDown size={8} className="text-[#616161]" />
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
                <Square size={14} />
                <ChevronDown size={8} className="text-[#616161]" />
              </button>
              {showBordersMenu && (
                <div className="absolute top-7 left-0 bg-white border border-[#D1D1D6] rounded-md shadow-xl py-1 z-50 text-xs w-40">
                  <button onClick={() => setShowBordersMenu(false)} className="w-full text-left px-3 py-1 hover:bg-[#F3F2F1]">Bottom Border</button>
                  <button onClick={() => setShowBordersMenu(false)} className="w-full text-left px-3 py-1 hover:bg-[#F3F2F1]">Top Border</button>
                  <button onClick={() => setShowBordersMenu(false)} className="w-full text-left px-3 py-1 hover:bg-[#F3F2F1]">Left Border</button>
                  <button onClick={() => setShowBordersMenu(false)} className="w-full text-left px-3 py-1 hover:bg-[#F3F2F1]">Right Border</button>
                  <button onClick={() => setShowBordersMenu(false)} className="w-full text-left px-3 py-1 hover:bg-[#F3F2F1]">All Borders</button>
                  <button onClick={() => setShowBordersMenu(false)} className="w-full text-left px-3 py-1 hover:bg-[#F3F2F1]">Outside Borders</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="word-group-divider" />

      {/* 4. Styles Gallery Group (Authentic Word for Mac Gallery) */}
      <div className="word-ribbon-group">
        <div className="flex items-center gap-1.5 overflow-hidden">
          {stylesGallery.slice(styleScrollOffset, styleScrollOffset + 4).map((s) => (
            <button
              key={s.id}
              onClick={s.action}
              className={`style-gallery-tile ${s.active ? 'active' : ''}`}
              title={s.name}
            >
              <div
                className={`truncate w-full text-center ${s.size || 'text-xs'} ${s.bold ? 'font-bold' : ''} ${s.italic ? 'italic' : ''}`}
                style={{ color: s.color || '#242424' }}
              >
                {s.preview}
              </div>
              <div className="text-[10px] text-[#616161] font-normal truncate w-full text-center">{s.name}</div>
            </button>
          ))}

          {/* Stepper controls */}
          <div className="flex flex-col gap-0.5 shrink-0">
            <button
              onClick={() => setStyleScrollOffset(Math.max(0, styleScrollOffset - 1))}
              disabled={styleScrollOffset === 0}
              className="p-1 hover:bg-black/5 rounded text-[#424242] disabled:opacity-30"
              title="Previous Styles"
            >
              <ChevronLeft size={10} />
            </button>
            <button
              onClick={() => setStyleScrollOffset(Math.min(stylesGallery.length - 4, styleScrollOffset + 1))}
              disabled={styleScrollOffset >= stylesGallery.length - 4}
              className="p-1 hover:bg-black/5 rounded text-[#424242] disabled:opacity-30"
              title="Next Styles"
            >
              <ChevronRight size={10} />
            </button>
          </div>
        </div>

        {/* Styles Pane Button */}
        <button
          onClick={() => alert('Styles Pane: Manage and create custom paragraph & character styles.')}
          className="ribbon-btn-large ml-1"
          title="Open Styles Pane"
        >
          <Layers size={22} className="text-[#0F6CBD]" />
          <span>Styles</span>
        </button>
      </div>

      <div className="word-group-divider" />

      {/* 5. Voice & Dictation */}
      <div className="word-ribbon-group">
        <button
          onClick={() => alert('Dictation: Speak to enter text.')}
          className="ribbon-btn-large"
          title="Dictate (⌥D)"
        >
          <Mic size={22} className="text-[#0F6CBD]" />
          <span>Dictate</span>
        </button>

        <button
          onClick={() => alert('Editor: Proofreading, conciseness, and grammar checker.')}
          className="ribbon-btn-large"
          title="Microsoft Editor"
        >
          <FileCheck size={22} className="text-[#107C41]" />
          <span>Editor</span>
        </button>
      </div>

      <div className="word-group-divider" />

      {/* 6. Editing Group */}
      <div className="word-ribbon-group">
        <div className="flex flex-col gap-1 justify-center">
          <button
            onClick={onOpenFind}
            className="h-6 flex items-center gap-1.5 px-2 text-xs font-normal text-[#242424] hover:bg-black/5 rounded transition cursor-pointer"
            title="Find Text (⌘F)"
          >
            <Search size={13} className="text-[#0F6CBD] shrink-0" />
            <span>Find</span>
          </button>
          <button
            onClick={onOpenReplace}
            className="h-6 flex items-center gap-1.5 px-2 text-xs font-normal text-[#242424] hover:bg-black/5 rounded transition cursor-pointer"
            title="Replace Text (⌥⌘F)"
          >
            <Replace size={13} className="text-[#107C41] shrink-0" />
            <span>Replace</span>
          </button>
        </div>
      </div>
    </div>
  );
};
