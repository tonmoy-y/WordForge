import React from 'react';
import { PageSetup } from '../../types/document';
import { getPageDimensionsPx } from '../../core/pagination/paginationEngine';

interface HorizontalRulerProps {
  pageSetup: PageSetup;
  zoomLevel: number;
  onUpdateMargins: (left: number, right: number) => void;
}

export const HorizontalRuler: React.FC<HorizontalRulerProps> = ({
  pageSetup,
  zoomLevel,
  onUpdateMargins,
}) => {
  const { pageWidthPx, marginLeftPx, marginRightPx } = getPageDimensionsPx(pageSetup);
  const totalInches = Math.round(pageWidthPx / 96);

  return (
    <div
      className="horizontal-ruler h-5 bg-[#F1F5F9] border-b border-[#CBD5E1] flex items-center relative select-none mx-auto shadow-xs"
      style={{
        width: `${pageWidthPx}px`,
        transform: `scale(${zoomLevel / 100})`,
        transformOrigin: 'top center',
      }}
    >
      {/* Left margin shaded area */}
      <div
        className="h-full bg-[#E2E8F0] absolute left-0 top-0 border-r border-[#94A3B8] flex items-center justify-end"
        style={{ width: `${marginLeftPx}px` }}
      >
        {/* Left Indent Marker */}
        <div
          className="w-2.5 h-3 bg-blue-600 border border-blue-800 -mr-1.5 cursor-ew-resize z-10 rounded-xs shadow-xs"
          title={`Left Margin: ${pageSetup.margins.left}" (Drag to adjust)`}
        />
      </div>

      {/* Printable Area with tick marks */}
      <div
        className="h-full bg-white relative flex items-center"
        style={{
          left: `${marginLeftPx}px`,
          width: `${pageWidthPx - marginLeftPx - marginRightPx}px`,
        }}
      >
        {Array.from({ length: totalInches }).map((_, idx) => {
          const inchPx = 96;
          return (
            <div
              key={idx}
              className="absolute top-0 bottom-0 flex flex-col justify-between"
              style={{ left: `${idx * inchPx}px` }}
            >
              <div className="w-px h-1.5 bg-[#64748B]" />
              <span className="text-[9px] font-mono text-[#475569] -ml-1 select-none leading-none mb-0.5">
                {idx + 1}
              </span>
              <div className="w-px h-1.5 bg-[#64748B]" />
            </div>
          );
        })}
      </div>

      {/* Right margin shaded area */}
      <div
        className="h-full bg-[#E2E8F0] absolute right-0 top-0 border-l border-[#94A3B8] flex items-center justify-start"
        style={{ width: `${marginRightPx}px` }}
      >
        {/* Right Margin Marker */}
        <div
          className="w-2.5 h-3 bg-blue-600 border border-blue-800 -ml-1.5 cursor-ew-resize z-10 rounded-xs shadow-xs"
          title={`Right Margin: ${pageSetup.margins.right}" (Drag to adjust)`}
        />
      </div>
    </div>
  );
};
