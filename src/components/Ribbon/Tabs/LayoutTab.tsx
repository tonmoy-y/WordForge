import React, { useState } from 'react';
import {
  FileText,
  Compass,
  Maximize2,
  Columns as ColumnsIcon,
  Scissors,
  AlignLeft,
  ChevronDown,
} from 'lucide-react';
import { PageSetup, PageSize, PageOrientation, MARGIN_PRESETS, PAGE_SIZES } from '../../../types/document';

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
        <div className="word-group-content">
          {/* Margins */}
          <div className="relative">
            <button
              onClick={() => setShowMargins(!showMargins)}
              className="ribbon-btn-large"
              title="Page Margins"
            >
              <FileText size={22} className="text-[#185ABD]" />
              <span>Margins</span>
            </button>
            {showMargins && (
              <div className="absolute top-16 left-0 bg-white border border-gray-300 rounded shadow-xl p-2 z-50 w-56 text-xs">
                {Object.entries(MARGIN_PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => {
                      onUpdatePageSetup({ margins: preset.margins });
                      setShowMargins(false);
                    }}
                    className="w-full text-left px-2 py-1.5 hover:bg-blue-50 rounded"
                  >
                    <div className="font-semibold text-gray-800">{preset.name}</div>
                    <div className="text-[10px] text-gray-500">{preset.description}</div>
                  </button>
                ))}
                <div className="h-px bg-gray-200 my-1" />
                <button
                  onClick={() => {
                    setShowMargins(false);
                    onOpenPageSetupDialog();
                  }}
                  className="w-full text-left px-2 py-1.5 hover:bg-blue-50 rounded font-medium text-blue-700"
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
              <Compass size={22} className="text-[#185ABD]" />
              <span>Orientation</span>
            </button>
            {showOrientation && (
              <div className="absolute top-16 left-0 bg-white border border-gray-300 rounded shadow-lg p-1.5 z-50 w-36 text-xs">
                <button
                  onClick={() => {
                    onUpdatePageSetup({ orientation: 'portrait' });
                    setShowOrientation(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between ${
                    pageSetup.orientation === 'portrait' ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-gray-100'
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
                    pageSetup.orientation === 'landscape' ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-gray-100'
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
              <Maximize2 size={22} className="text-[#185ABD]" />
              <span>Size</span>
            </button>
            {showSizes && (
              <div className="absolute top-16 left-0 bg-white border border-gray-300 rounded shadow-xl p-1.5 z-50 w-48 text-xs">
                {(Object.keys(PAGE_SIZES) as PageSize[]).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      onUpdatePageSetup({ paperSize: sz });
                      setShowSizes(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded ${
                      pageSetup.paperSize === sz ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-gray-100'
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
              title="Number of Columns"
            >
              <ColumnsIcon size={22} className="text-[#185ABD]" />
              <span>Columns</span>
            </button>
            {showColumns && (
              <div className="absolute top-16 left-0 bg-white border border-gray-300 rounded shadow-lg p-1 z-50 w-32 text-xs">
                {[1, 2, 3].map((cols) => (
                  <button
                    key={cols}
                    onClick={() => {
                      onUpdatePageSetup({ columns: cols as 1 | 2 | 3 });
                      setShowColumns(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded ${
                      pageSetup.columns === cols ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-gray-100'
                    }`}
                  >
                    {cols === 1 ? 'One' : cols === 2 ? 'Two' : 'Three'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Breaks */}
          <button
            onClick={() => onInsertBreak('page')}
            className="ribbon-btn-large"
            title="Insert Page Break"
          >
            <Scissors size={22} className="text-[#D83B01]" />
            <span>Breaks</span>
          </button>
        </div>
        <div className="word-group-label">Page Setup</div>
      </div>

      <div className="word-group-separator" />

      {/* 2. Paragraph Spacing & Indents */}
      <div className="word-ribbon-group">
        <div className="flex flex-col gap-1.5 flex-1 justify-center">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-gray-600 w-12">Indent:</span>
            <span className="text-xs text-gray-500">Left:</span>
            <input
              type="number"
              step="0.1"
              defaultValue="0"
              className="w-12 h-5 border border-gray-300 rounded px-1 text-xs"
              onChange={(e) => {
                // Adjust indent
              }}
            />
            <span className="text-xs text-gray-500">Right:</span>
            <input
              type="number"
              step="0.1"
              defaultValue="0"
              className="w-12 h-5 border border-gray-300 rounded px-1 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-gray-600 w-12">Spacing:</span>
            <span className="text-xs text-gray-500">Before:</span>
            <input
              type="number"
              step="1"
              defaultValue="0"
              className="w-12 h-5 border border-gray-300 rounded px-1 text-xs"
            />
            <span className="text-xs text-gray-500">After:</span>
            <input
              type="number"
              step="1"
              defaultValue="8"
              className="w-12 h-5 border border-gray-300 rounded px-1 text-xs"
            />
          </div>
        </div>
        <div className="word-group-label">Paragraph</div>
      </div>
    </div>
  );
};
