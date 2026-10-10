import React from 'react';

interface ThemeColorPickerProps {
  onSelectColor: (color: string) => void;
  onClose: () => void;
  showNoColor?: boolean;
}

export const ThemeColorPicker: React.FC<ThemeColorPickerProps> = ({
  onSelectColor,
  onClose,
  showNoColor = true,
}) => {
  // Microsoft Office Theme Colors (10 theme columns with 5 tints/shades each)
  const themeColumns = [
    { base: '#FFFFFF', shades: ['#F2F2F2', '#D9D9D9', '#BFBFBF', '#A6A6A6', '#7F7F7F'] },
    { base: '#000000', shades: ['#7F7F7F', '#595959', '#3F3F3F', '#262626', '#0C0C0C'] },
    { base: '#E7E6E6', shades: ['#D0CECE', '#AEAAAA', '#757171', '#3A3838', '#161616'] },
    { base: '#44546A', shades: ['#D6DCE4', '#ACB9CA', '#8497B0', '#333F48', '#222A35'] },
    { base: '#4472C4', shades: ['#D9E1F2', '#B4C6E7', '#8EA9DB', '#305496', '#203764'] },
    { base: '#ED7D31', shades: ['#FCE4D6', '#F8CBAD', '#F4B084', '#C65911', '#833C0C'] },
    { base: '#A5A5A5', shades: ['#EDEDED', '#DBDBDB', '#C9C9C9', '#7B7B7B', '#525252'] },
    { base: '#FFC000', shades: ['#FFF2CC', '#FFE699', '#FFD966', '#BF8F00', '#7F6000'] },
    { base: '#5B9BD5', shades: ['#DEEBF7', '#BDD7EE', '#9CC2E5', '#2E75B6', '#1F4E78'] },
    { base: '#70AD47', shades: ['#E2EFDA', '#C6E0B4', '#A9D08E', '#548235', '#375623'] },
  ];

  const standardColors = [
    '#C00000', '#FF0000', '#FFC000', '#FFFF00', '#92D050',
    '#00B050', '#00B0F0', '#0070C0', '#002060', '#7030A0',
  ];

  return (
    <div
      className="absolute top-8 left-0 bg-white border border-[#CBD5E1] rounded shadow-xl p-2.5 z-50 w-[212px] text-xs select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Theme Colors Title */}
      <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-tight mb-1.5">
        Theme Colors
      </div>

      {/* Base row (10 swatches) */}
      <div className="grid grid-cols-10 gap-1 mb-1">
        {themeColumns.map((col, idx) => (
          <div
            key={idx}
            onClick={() => {
              onSelectColor(col.base);
              onClose();
            }}
            className="w-4 h-4 rounded-xs border border-gray-300 hover:scale-115 hover:shadow-xs transition cursor-pointer"
            style={{ backgroundColor: col.base }}
            title={col.base}
          />
        ))}
      </div>

      {/* 5 shades rows */}
      <div className="grid grid-cols-10 gap-1 mb-2.5">
        {[0, 1, 2, 3, 4].map((shadeIdx) =>
          themeColumns.map((col, colIdx) => (
            <div
              key={`${colIdx}-${shadeIdx}`}
              onClick={() => {
                onSelectColor(col.shades[shadeIdx]);
                onClose();
              }}
              className="w-4 h-3 rounded-xs border border-gray-200 hover:scale-115 hover:shadow-xs transition cursor-pointer"
              style={{ backgroundColor: col.shades[shadeIdx] }}
              title={col.shades[shadeIdx]}
            />
          ))
        )}
      </div>

      {/* Standard Colors Title */}
      <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-tight mb-1.5">
        Standard Colors
      </div>

      {/* Standard row */}
      <div className="grid grid-cols-10 gap-1 mb-2">
        {standardColors.map((color, idx) => (
          <div
            key={idx}
            onClick={() => {
              onSelectColor(color);
              onClose();
            }}
            className="w-4 h-4 rounded-xs border border-gray-300 hover:scale-115 hover:shadow-xs transition cursor-pointer"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200 my-1.5" />

      {/* No Color option */}
      {showNoColor && (
        <button
          onClick={() => {
            onSelectColor('');
            onClose();
          }}
          className="w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2"
        >
          <div className="w-4 h-4 border border-gray-400 bg-white relative flex items-center justify-center">
            <div className="w-4 h-0.5 bg-red-500 rotate-45 absolute" />
          </div>
          <span>Automatic / No Color</span>
        </button>
      )}
    </div>
  );
};
