import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface FontSizePickerProps {
  value: string;
  onChange: (size: string) => void;
}

const SIZES = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '36', '48', '72'];

export const FontSizePicker: React.FC<FontSizePickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

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

  const handleInputSubmit = () => {
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 500) {
      onChange(String(parsed));
    } else {
      setInputValue(value);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-flex items-center" ref={containerRef}>
      <div className="h-6 w-12 px-1 flex items-center justify-between bg-white border border-[#D1D1D6] hover:border-[#8A8886] rounded-[3px] text-xs text-[#201F1E] transition-colors focus-within:border-[#0F6CBD]">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleInputSubmit();
            if (e.key === 'Escape') {
              setInputValue(value);
              setIsOpen(false);
            }
          }}
          onBlur={handleInputSubmit}
          className="w-6 text-center outline-none bg-transparent text-xs text-[#201F1E] font-normal"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-0.5 text-[#616161] hover:text-[#201F1E] focus:outline-none"
        >
          <ChevronDown size={10} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-7 left-0 w-16 max-h-56 overflow-y-auto bg-white border border-[#D1D1D6] rounded-md shadow-xl py-1 z-50 text-xs text-center">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => {
                onChange(s);
                setInputValue(s);
                setIsOpen(false);
              }}
              className={`w-full py-1 text-center hover:bg-[#F3F2F1] transition-colors ${
                value === s ? 'bg-[#EFF6FC] text-[#0F6CBD] font-medium' : 'text-[#201F1E]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
