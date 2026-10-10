import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface FontPickerProps {
  value: string;
  onChange: (font: string) => void;
}

const FONTS = [
  { name: 'Aptos', category: 'Theme Font' },
  { name: 'Aptos Display', category: 'Theme Font' },
  { name: 'Calibri', category: 'Classic Office' },
  { name: 'Calibri Light', category: 'Classic Office' },
  { name: 'Arial', category: 'Standard' },
  { name: 'Times New Roman', category: 'Serif' },
  { name: 'Georgia', category: 'Serif' },
  { name: 'Helvetica', category: 'macOS Native' },
  { name: 'Verdana', category: 'Standard' },
  { name: 'Trebuchet MS', category: 'Sans-Serif' },
  { name: 'Courier New', category: 'Monospace' },
  { name: 'Consolas', category: 'Monospace' },
  { name: 'Palatino', category: 'Serif' },
  { name: 'Garamond', category: 'Serif' },
];

export const FontPicker: React.FC<FontPickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-6 w-32 px-2 flex items-center justify-between bg-white border border-[#D1D1D6] hover:border-[#8A8886] rounded-[3px] text-xs text-[#201F1E] transition-colors select-none focus:outline-none focus:border-[#0F6CBD]"
        title="Font Family"
      >
        <span className="truncate text-left font-normal" style={{ fontFamily: value }}>
          {value}
        </span>
        <ChevronDown size={10} className="text-[#616161] shrink-0 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute top-7 left-0 w-48 max-h-72 overflow-y-auto bg-white border border-[#D1D1D6] rounded-md shadow-xl py-1 z-50 text-xs">
          <div className="px-2 py-1 text-[10px] font-semibold text-[#8A8886] uppercase tracking-wider">
            Theme Fonts
          </div>
          {FONTS.slice(0, 2).map((f) => (
            <button
              key={f.name}
              onClick={() => {
                onChange(f.name);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#F3F2F1] transition-colors ${
                value === f.name ? 'bg-[#EFF6FC] text-[#0F6CBD] font-medium' : 'text-[#201F1E]'
              }`}
            >
              <span style={{ fontFamily: f.name }}>{f.name}</span>
              {value === f.name && <Check size={12} className="text-[#0F6CBD]" />}
            </button>
          ))}

          <div className="border-t border-[#EDEBE9] my-1" />
          <div className="px-2 py-1 text-[10px] font-semibold text-[#8A8886] uppercase tracking-wider">
            All Fonts
          </div>
          {FONTS.slice(2).map((f) => (
            <button
              key={f.name}
              onClick={() => {
                onChange(f.name);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-[#F3F2F1] transition-colors ${
                value === f.name ? 'bg-[#EFF6FC] text-[#0F6CBD] font-medium' : 'text-[#201F1E]'
              }`}
            >
              <span style={{ fontFamily: f.name }}>{f.name}</span>
              {value === f.name && <Check size={12} className="text-[#0F6CBD]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
