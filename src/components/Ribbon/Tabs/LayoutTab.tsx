import React, { useState } from 'react';
import {
  FileText,
  Compass,
  Maximize2,
  Columns as ColumnsIcon,
  Scissors,
  ChevronDown,
} from 'lucide-react';
import { PageSetup, PageSize, MARGIN_PRESETS, PAGE_SIZES } from '../../../types/document';

interface LayoutTabProps {
  pageSetup: PageSetup;
  onUpdatePageSetup: (updates: Partial<PageSetup>) => void;
  onOpenPageSetupDialog: () => void;
  onInsertBreak: (type: 'page' | 'section') => void;
}

export const LayoutTab: React.FC<LayoutTabProps> = ({
  pageSetup,
  onUpdatePageSetup,
  onOpenPageSetupDialog,
  onInsertBreak,
}) => {
  const [showMargins, setShowMargins] = useState(false);
  const [showOrientation, setShowOrientation] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const [showColumns, setShowColumns] = useState(false);

  return (
    <div className="word-ribbon-panel">
      {/* 1. Page Setup Group */}
      <div className="word-ribbon-group">
        {/* Margins */}
        <div className="relative">
          <button
            onClick={() => setShowMargins(!showMargins)}
            className="ribbon-btn-large"
            title="Page Margins"
          >
            <FileText size={24} className="text-[#0F6CBD]" />
            <div className="flex items-center gap-0.5">
              <span>Margins</span>
              <ChevronDown size={9} className="text-[#616161]" />
            </div>
          </button>
          {showMargins && (
            <div className="absolute top-16 left-0 bg-white border border-[#D1D1D6] rounded-md shadow-xl p-2 z-50 w-56 text-xs">
              {Object.entries(MARGIN_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => {
                    onUpdatePageSetup({ margins: preset.margins });
                    setShowMargins(false);
                  }}
                  className="w-full text-left px-2 py-1.5 hover:bg-[#F3F2F1] rounded"
                >
                  <div className="font-semibold text-[#242424]">{preset.name}</div>
                  <div className="text-[10px] text-[#616161]">{preset.description}</div>
                </button>
              ))}
              <div className="h-px bg-[#EDEBE9] my-1" />
              <button
                onClick={() => {
                  setShowMargins(false);
                  onOpenPageSetupDialog();
                }}
                className="w-full text-left px-2 py-1.5 hover:bg-[#EFF6FC] rounded font-medium text-[#0F6CBD]"
              >
                Custom Margins…
              </button>
            </div>
          )}
        </div>

        {/* Orientation */}
        <div className="relative">
          <button
            onClick={() => setShowOrientation(!showOrientation)}
            className="ribbon-btn-large"
            title="Page Orientation"
          >
            <Compass size={24} className="text-[#0F6CBD]" />
            <div className="flex items-center gap-0.5">
              <span>Orientation</span>
              <ChevronDown size={9} className="text-[#616161]" />
            </div>
          </button>
          {showOrientation && (
            <div className="absolute top-16 left-0 bg-white border border-[#D1D1D6] rounded-md shadow-lg p-1.5 z-50 w-36 text-xs">
              <button
                onClick={() => {
                  onUpdatePageSetup({ orientation: 'portrait' });
                  setShowOrientation(false);
                }}
                className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between ${
                  pageSetup.orientation === 'portrait' ? 'bg-[#EFF6FC] text-[#0F6CBD] font-semibold' : 'hover:bg-[#F3F2F1]'
                }`}
              >
                <span>Portrait</span>
                <span>📄</span>
              </button>
              <button
                onClick={() => {
                  onUpdatePageSetup({ orientation: 'landscape' });
                  setShowOrientation(false);
                }}
                className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between ${
                  pageSetup.orientation === 'landscape' ? 'bg-[#EFF6FC] text-[#0F6CBD] font-semibold' : 'hover:bg-[#F3F2F1]'
                }`}
              >
                <span>Landscape</span>
                <span>📃</span>
              </button>
            </div>
          )}
        </div>

        {/* Paper Size */}
        <div className="relative">
          <button
            onClick={() => setShowSizes(!showSizes)}
            className="ribbon-btn-large"
            title="Paper Size"
          >
            <Maximize2 size={24} className="text-[#0F6CBD]" />
            <div className="flex items-center gap-0.5">
              <span>Size</span>
              <ChevronDown size={9} className="text-[#616161]" />
            </div>
          </button>
          {showSizes && (
            <div className="absolute top-16 left-0 bg-white border border-[#D1D1D6] rounded-md shadow-xl p-1.5 z-50 w-48 text-xs">
              {(Object.keys(PAGE_SIZES) as PageSize[]).map((sz) => (
                <button
                  key={sz}
                  onClick={() => {
                    onUpdatePageSetup({ paperSize: sz });
                    setShowSizes(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded ${
                    pageSetup.paperSize === sz ? 'bg-[#EFF6FC] text-[#0F6CBD] font-semibold' : 'hover:bg-[#F3F2F1]'
                  }`}
                >
                  {PAGE_SIZES[sz].name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Columns */}
        <div className="relative">
          <button
            onClick={() => setShowColumns(!showColumns)}
            className="ribbon-btn-large"
            title="Columns"
          >
            <ColumnsIcon size={24} className="text-[#0F6CBD]" />
            <div className="flex items-center gap-0.5">
              <span>Columns</span>
              <ChevronDown size={9} className="text-[#616161]" />
            </div>
          </button>
          {showColumns && (
            <div className="absolute top-16 left-0 bg-white border border-[#D1D1D6] rounded-md shadow-lg p-1.5 z-50 w-36 text-xs">
              {[
                { count: 1, label: 'One' },
                { count: 2, label: 'Two' },
                { count: 3, label: 'Three' },
              ].map((col) => (
                <button
                  key={col.count}
                  onClick={() => {
                    onUpdatePageSetup({ columns: col.count as 1 | 2 | 3 });
                    setShowColumns(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded ${
                    pageSetup.columns === col.count ? 'bg-[#EFF6FC] text-[#0F6CBD] font-semibold' : 'hover:bg-[#F3F2F1]'
                  }`}
                >
                  {col.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Page & Section Breaks */}
        <button
          onClick={() => onInsertBreak('page')}
          className="ribbon-btn-large"
          title="Insert Page Break (⌘↵)"
        >
          <Scissors size={24} className="text-[#616161]" />
          <span>Breaks</span>
        </button>
      </div>

      <div className="word-group-divider" />

      {/* 2. Indents & Spacing Steppers */}
      <div className="word-ribbon-group">
        <div className="flex flex-col gap-1.5 justify-center">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-14 text-[#616161]">Indent Left:</span>
            <input
              type="number"
              step="0.1"
              value={pageSetup.margins.left}
              onChange={(e) =>
                onUpdatePageSetup({
                  margins: { ...pageSetup.margins, left: parseFloat(e.target.value) || 1 },
                })
              }
              className="w-14 h-5 px-1 border border-[#D1D1D6] rounded-[3px] text-xs text-center"
            />
            <span className="text-[#616161]">in</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="w-14 text-[#616161]">Indent Right:</span>
            <input
              type="number"
              step="0.1"
              value={pageSetup.margins.right}
              onChange={(e) =>
                onUpdatePageSetup({
                  margins: { ...pageSetup.margins, right: parseFloat(e.target.value) || 1 },
                })
              }
              className="w-14 h-5 px-1 border border-[#D1D1D6] rounded-[3px] text-xs text-center"
            />
            <span className="text-[#616161]">in</span>
          </div>
        </div>
      </div>
    </div>
  );
};
