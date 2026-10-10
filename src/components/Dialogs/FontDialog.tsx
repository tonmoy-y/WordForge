import React, { useState } from 'react';
import { X, Type } from 'lucide-react';
import { Editor } from '@tiptap/react';

interface FontDialogProps {
  editor: Editor | null;
  onClose: () => void;
}

export const FontDialog: React.FC<FontDialogProps> = ({ editor, onClose }) => {
  const [font, setFont] = useState('Aptos');
  const [style, setStyle] = useState('Regular');
  const [size, setSize] = useState('11');
  const [color, setColor] = useState('#1F2937');
  const [underline, setUnderline] = useState(false);
  const [strikethrough, setStrikethrough] = useState(false);
  const [superscript, setSuperscript] = useState(false);
  const [subscript, setSubscript] = useState(false);

  if (!editor) return null;

  const handleApply = () => {
    const chain = editor.chain().focus();
    (chain as any).setFontFamily(font);
    (chain as any).setColor(color);

    if (style.includes('Bold')) chain.setBold();
    else chain.unsetBold();

    if (style.includes('Italic')) chain.setItalic();
    else chain.unsetItalic();

    if (underline) (chain as any).setUnderline();
    else (chain as any).unsetUnderline();

    if (strikethrough) chain.setStrike();
    else chain.unsetStrike();

    if (superscript) (chain as any).setSuperscript();
    else (chain as any).unsetSuperscript();

    if (subscript) (chain as any).setSubscript();
    else (chain as any).unsetSubscript();

    chain.run();
    onClose();
  };

  return (
    <div className="word-dialog-overlay" onClick={onClose}>
      <div className="word-dialog-box w-[480px]" onClick={(e) => e.stopPropagation()}>
        <div className="word-dialog-header">
          <div className="flex items-center gap-2">
            <Type size={16} className="text-[#185ABD]" />
            <span>Font</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <X size={14} />
          </button>
        </div>

        <div className="word-dialog-content flex flex-col gap-4 text-xs">
          {/* Font, Style, Size Column Selection */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Font:</label>
              <select
                size={6}
                value={font}
                onChange={(e) => setFont(e.target.value)}
                className="w-full border border-gray-300 rounded p-1 bg-white outline-none"
              >
                {['Aptos', 'Calibri', 'Arial', 'Georgia', 'Times New Roman', 'Fira Code', 'Playfair Display', 'Inter'].map(
                  (f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">Font style:</label>
              <select
                size={6}
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full border border-gray-300 rounded p-1 bg-white outline-none"
              >
                {['Regular', 'Italic', 'Bold', 'Bold Italic'].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">Size:</label>
              <select
                size={6}
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full border border-gray-300 rounded p-1 bg-white outline-none"
              >
                {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 36, 48, 72].map((s) => (
                  <option key={s} value={String(s)}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Color & Effects */}
          <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="font-semibold text-gray-700">Font color:</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-6 h-6 border-0 cursor-pointer rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <label className="flex items-center gap-1.5 cursor-pointer text-gray-700">
                <input
                  type="checkbox"
                  checked={underline}
                  onChange={(e) => setUnderline(e.target.checked)}
                />
                <span>Underline</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-gray-700">
                <input
                  type="checkbox"
                  checked={strikethrough}
                  onChange={(e) => setStrikethrough(e.target.checked)}
                />
                <span>Strikethrough</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-gray-700">
                <input
                  type="checkbox"
                  checked={superscript}
                  onChange={(e) => {
                    setSuperscript(e.target.checked);
                    if (e.target.checked) setSubscript(false);
                  }}
                />
                <span>Superscript</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-gray-700">
                <input
                  type="checkbox"
                  checked={subscript}
                  onChange={(e) => {
                    setSubscript(e.target.checked);
                    if (e.target.checked) setSuperscript(false);
                  }}
                />
                <span>Subscript</span>
              </label>
            </div>
          </div>

          {/* Preview Box */}
          <div className="border border-gray-300 rounded p-4 bg-gray-50 flex items-center justify-center min-h-[64px]">
            <span
              style={{
                fontFamily: font,
                fontSize: `${size}pt`,
                color: color,
                fontWeight: style.includes('Bold') ? 'bold' : 'normal',
                fontStyle: style.includes('Italic') ? 'italic' : 'normal',
                textDecoration: underline ? 'underline' : strikethrough ? 'line-through' : 'none',
              }}
            >
              WordForge Sample Typography
            </span>
          </div>
        </div>

        <div className="word-dialog-footer">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleApply} className="btn-primary">
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
