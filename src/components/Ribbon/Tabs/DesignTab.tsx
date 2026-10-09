import React, { useState } from 'react';
import {
  Palette,
  Type,
  LayoutTemplate,
  Droplet,
  Stamp,
  Square,
} from 'lucide-react';
import { DOCUMENT_THEMES, COLOR_PALETTES, FONT_PAIRINGS } from '../../../core/themes/documentThemes';
import { PageSetup } from '../../../types/document';

interface DesignTabProps {
  activeThemeId: string;
  onSelectTheme: (themeId: string) => void;
  pageSetup: PageSetup;
  onUpdatePageSetup: (updates: Partial<PageSetup>) => void;
}

export const DesignTab: React.FC<DesignTabProps> = ({
  activeThemeId,
  onSelectTheme,
  pageSetup,
  onUpdatePageSetup,
}) => {
  const [showWatermarks, setShowWatermarks] = useState(false);
  const [showPageColors, setShowPageColors] = useState(false);

  const watermarks = ['DRAFT', 'CONFIDENTIAL', 'DO NOT COPY', 'SAMPLE', 'URGENT'];
  const pageColors = ['#FFFFFF', '#FAFAFA', '#FFFDF5', '#F0FDF4', '#EFF6FF', '#1E293B'];

  return (
    <div className="word-ribbon-panel">
      {/* 1. Themes */}
      <div className="word-ribbon-group">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative">
            <label className="text-[11px] font-semibold text-gray-700 block mb-1">Active Theme</label>
            <select
              value={activeThemeId}
              onChange={(e) => onSelectTheme(e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1 bg-white w-36 shadow-sm"
            >
              {Object.values(DOCUMENT_THEMES).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="word-group-label">Document Formatting</div>
      </div>

      <div className="word-group-separator" />

      {/* 2. Coordinated Colors & Fonts */}
      <div className="word-ribbon-group">
        <div className="flex flex-col gap-1 flex-1 justify-center">
          <div className="flex items-center gap-1.5">
            <Palette size={14} className="text-[#185ABD]" />
            <span className="text-xs text-gray-600 font-medium">Palette:</span>
            <div className="flex items-center gap-1">
              {COLOR_PALETTES.slice(0, 4).map((p) => (
                <div
                  key={p.name}
                  onClick={() => {
                    // Update active theme colors
                    alert(`Color palette '${p.name}' applied to headings and accents.`);
                  }}
                  className="w-4 h-4 rounded cursor-pointer border border-gray-300 hover:scale-110 transition shadow-xs"
                  style={{ backgroundColor: p.primary }}
                  title={p.name}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Type size={14} className="text-[#185ABD]" />
            <span className="text-xs text-gray-600 font-medium">Fonts:</span>
            <select
              onChange={(e) => {
                alert(`Font pairing '${e.target.value}' applied.`);
              }}
              className="text-xs border border-gray-300 rounded px-1.5 py-0.5 bg-white w-32"
            >
              {FONT_PAIRINGS.map((fp) => (
                <option key={fp.name} value={fp.name}>
                  {fp.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="word-group-label">Style Presets</div>
      </div>

      <div className="word-group-separator" />

      {/* 3. Page Background: Watermark, Page Color, Page Borders */}
      <div className="word-ribbon-group">
        <div className="word-group-content">
          {/* Watermark Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowWatermarks(!showWatermarks)}
              className="ribbon-btn-large"
              title="Add Watermark to pages"
            >
              <Stamp size={22} className="text-[#185ABD]" />
              <span>Watermark</span>
            </button>
            {showWatermarks && (
              <div className="absolute top-16 left-0 bg-white border border-gray-300 rounded shadow-lg p-2 z-50 w-44 text-xs">
                <button
                  onClick={() => {
                    onUpdatePageSetup({ watermarkText: undefined });
                    setShowWatermarks(false);
                  }}
                  className="w-full text-left px-2 py-1.5 hover:bg-gray-100 rounded text-red-600 font-medium"
                >
                  Remove Watermark
                </button>
                <div className="h-px bg-gray-200 my-1" />
                {watermarks.map((wm) => (
                  <button
                    key={wm}
                    onClick={() => {
                      onUpdatePageSetup({ watermarkText: wm });
                      setShowWatermarks(false);
                    }}
                    className="w-full text-left px-2 py-1.5 hover:bg-blue-50 hover:text-blue-700 rounded font-semibold text-gray-500"
                  >
                    {wm}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Page Color Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPageColors(!showPageColors)}
              className="ribbon-btn-large"
              title="Page Color"
            >
              <Droplet size={22} className="text-[#107C41]" />
              <span>Page Color</span>
            </button>
            {showPageColors && (
              <div className="absolute top-16 left-0 bg-white border border-gray-300 rounded shadow-lg p-2 z-50 w-36 grid grid-cols-3 gap-1.5">
                {pageColors.map((col) => (
                  <div
                    key={col}
                    onClick={() => {
                      onUpdatePageSetup({ pageColor: col });
                      setShowPageColors(false);
                    }}
                    className="w-8 h-8 rounded border border-gray-300 cursor-pointer hover:scale-105 transition"
                    style={{ backgroundColor: col }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Page Borders */}
          <button
            onClick={() => onUpdatePageSetup({ showPageBorders: !pageSetup.showPageBorders })}
            className={`ribbon-btn-large ${pageSetup.showPageBorders ? 'active' : ''}`}
            title="Toggle decorative page border"
          >
            <Square size={22} className="text-[#2B579A]" />
            <span>Page Borders</span>
          </button>
        </div>
        <div className="word-group-label">Page Background</div>
      </div>
    </div>
  );
};
