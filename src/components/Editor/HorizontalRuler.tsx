import React from 'react';
import { PageSetup } from '../../types/document';
import { getPageDimensionsPx } from '../../core/pagination/paginationEngine';

interface HorizontalRulerProps {
  pageSetup: PageSetup;
  zoomLevel: number;
  scrollLeft?: number;
  onUpdateMargins: (left: number, right: number) => void;
}

export const HorizontalRuler: React.FC<HorizontalRulerProps> = ({
  pageSetup,
  zoomLevel,
}) => {
  const { pageWidthPx, marginLeftPx, marginRightPx } = getPageDimensionsPx(pageSetup);
  const scale = zoomLevel / 100;
  const printableWidthPx = pageWidthPx - marginLeftPx - marginRightPx;
  const printableInches = Math.floor(printableWidthPx / 96);

  return (
    <div className="horizontal-ruler-container h-[20px] bg-[#EDEDED] border-b border-[#E1DFDD] flex items-center justify-center relative select-none w-full overflow-hidden">
      {/* Ruler Body matching Page Width & Zoom */}
      <div
        className="horizontal-ruler h-[16px] bg-[#F8F9FA] border-x border-[#E1DFDD] relative select-none"
        style={{
          width: `${pageWidthPx * scale}px`,
          minWidth: `${pageWidthPx * scale}px`,
        }}
      >
        {/* 1. Left margin shaded area */}
        <div
          className="absolute left-0 top-0 bottom-0 bg-[#EDEBE9] border-r border-[#D1D1D6]"
          style={{ width: `${marginLeftPx * scale}px` }}
        >
          {/* First Line Indent (inverted triangle at top) */}
          <div
            className="absolute -top-[1px] right-0 translate-x-1/2 w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-t-[4.5px] border-t-[#323130] cursor-ew-resize z-30"
            title={`First Line Indent: ${pageSetup.margins.left}"`}
          />
          {/* Hanging Indent (upward triangle at bottom) */}
          <div
            className="absolute bottom-[3px] right-0 translate-x-1/2 w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[4.5px] border-b-[#323130] cursor-ew-resize z-30"
            title={`Hanging Indent: ${pageSetup.margins.left}"`}
          />
          {/* Left Indent base box */}
          <div
            className="absolute bottom-0 right-0 translate-x-1/2 w-[7px] h-[3px] bg-[#323130] cursor-ew-resize z-30"
            title={`Left Indent: ${pageSetup.margins.left}"`}
          />
        </div>

        {/* 2. White Printable Area with tick marks and numbers */}
        <div
          className="absolute top-0 bottom-0 bg-white overflow-hidden"
          style={{
            left: `${marginLeftPx * scale}px`,
            width: `${printableWidthPx * scale}px`,
          }}
        >
          {/* Quarter-inch ticks across full printable width */}
          {Array.from({ length: Math.floor((printableWidthPx / 96) * 4) + 1 }).map((_, qIdx) => {
            const x = (qIdx * 24) * scale;
            if (x > printableWidthPx * scale) return null;
            const isInch = qIdx % 4 === 0;
            const isHalf = qIdx % 2 === 0;

            if (isInch) return null;

            return (
              <div
                key={`q-${qIdx}`}
                className="absolute top-0 w-px bg-[#8A8886]"
                style={{
                  left: `${x}px`,
                  height: isHalf ? '4px' : '2.5px',
                }}
              />
            );
          })}

          {/* Inch Marks & Labels: 1, 2, 3... */}
          {Array.from({ length: printableInches }).map((_, idx) => {
            const inchNum = idx + 1;
            const x = (inchNum * 96) * scale;
            if (x >= printableWidthPx * scale) return null;

            return (
              <div
                key={`inch-${inchNum}`}
                className="absolute top-0 bottom-0 flex flex-col justify-between items-center pointer-events-none"
                style={{ left: `${x}px`, transform: 'translateX(-50%)' }}
              >
                {/* Top tick */}
                <div className="w-px h-[4px] bg-[#605E5C]" />

                {/* Number label */}
                <span className="text-[9px] font-sans font-normal text-[#605E5C] leading-none select-none">
                  {inchNum}
                </span>

                {/* Bottom tick */}
                <div className="w-px h-[3px] bg-[#8A8886]" />
              </div>
            );
          })}
        </div>

        {/* 3. Right margin shaded area */}
        <div
          className="absolute right-0 top-0 bottom-0 bg-[#EDEBE9] border-l border-[#D1D1D6]"
          style={{ width: `${marginRightPx * scale}px` }}
        >
          {/* Right Indent Marker (upward triangle) */}
          <div
            className="absolute bottom-0 left-0 -translate-x-1/2 w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[5px] border-b-[#323130] cursor-ew-resize z-30"
            title={`Right Indent: ${pageSetup.margins.right}"`}
          />
        </div>
      </div>
    </div>
  );
};
