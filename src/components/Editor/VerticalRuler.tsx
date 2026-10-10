import React from 'react';
import { PageSetup } from '../../types/document';
import { getPageDimensionsPx } from '../../core/pagination/paginationEngine';

interface VerticalRulerProps {
  pageSetup: PageSetup;
  zoomLevel: number;
}

export const VerticalRuler: React.FC<VerticalRulerProps> = ({ pageSetup, zoomLevel }) => {
  const { pageHeightPx, marginTopPx, marginBottomPx } = getPageDimensionsPx(pageSetup);
  const scale = zoomLevel / 100;
  const printableHeightPx = pageHeightPx - marginTopPx - marginBottomPx;
  const printableInches = Math.floor(printableHeightPx / 96);

  return (
    <div
      className="vertical-ruler bg-[#EDEFEF] border-r border-[#CBD5E1] select-none relative shadow-xs shrink-0"
      style={{
        width: '18px',
        height: `${pageHeightPx * scale}px`,
      }}
    >
      {/* 1. Top margin shaded area */}
      <div
        className="w-full bg-[#D8DEE4] absolute top-0 left-0 border-b border-[#94A3B8]"
        style={{ height: `${marginTopPx * scale}px` }}
      />

      {/* 2. Printable white area */}
      <div
        className="w-full bg-white absolute left-0 overflow-hidden"
        style={{
          top: `${marginTopPx * scale}px`,
          height: `${printableHeightPx * scale}px`,
        }}
      >
        {/* Quarter-inch ticks */}
        {Array.from({ length: Math.floor((printableHeightPx / 96) * 4) + 1 }).map((_, qIdx) => {
          const y = (qIdx * 24) * scale;
          if (y > printableHeightPx * scale) return null;
          const isInch = qIdx % 4 === 0;
          const isHalf = qIdx % 2 === 0;

          if (isInch) return null;

          return (
            <div
              key={`vq-${qIdx}`}
              className="absolute right-0 h-px bg-[#94A3B8]"
              style={{
                top: `${y}px`,
                width: isHalf ? '5px' : '3px',
              }}
            />
          );
        })}

        {/* Inch marks: 1, 2, 3... */}
        {Array.from({ length: printableInches }).map((_, idx) => {
          const inchNum = idx + 1;
          const y = (inchNum * 96) * scale;
          if (y >= printableHeightPx * scale) return null;

          return (
            <div
              key={`vinch-${inchNum}`}
              className="absolute left-0 right-0 flex items-center justify-between pointer-events-none"
              style={{ top: `${y}px`, transform: 'translateY(-50%)' }}
            >
              <span className="text-[8px] font-sans font-semibold text-[#475569] select-none pl-1 leading-none">
                {inchNum}
              </span>
              <div className="h-px w-[6px] bg-[#64748B]" />
            </div>
          );
        })}
      </div>

      {/* 3. Bottom margin shaded area */}
      <div
        className="w-full bg-[#D8DEE4] absolute bottom-0 left-0 border-t border-[#94A3B8]"
        style={{ height: `${marginBottomPx * scale}px` }}
      />
    </div>
  );
};
