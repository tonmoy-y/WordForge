import React, { useState } from 'react';
import {
  Palette,
  Droplet,
  Stamp,
  Square,
  ChevronDown,
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
        <div className="flex flex-col gap-1 justify-center">
          <label className="text-[10px] font-semibold text-[#8A8886] uppercase tracking-wider block">
            Theme
          </label>
          <select
            value={activeThemeId}
            onChange={(e) => onSelectTheme(e.target.value)}
            className="h-6 text-xs border border-[#D1D1D6] rounded-[3px] px-2 bg-white w-36 outline-none"
          >
            {Object.values(DOCUMENT_THEMES).map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="word-group-divider" />

      {/* 2. Coordinated Colors & Fonts */}
      <div className="word-ribbon-group">
        <div className="flex flex-col gap-1 justify-center">
          <div className="flex items-center gap-1.5">
            <Palette size={14} className="text-[#0F6CBD]" />
            <span className="text-xs text-[#616161]">Palette:</span>
            <div className="flex items-center gap-1">
              {COLOR_PALETTES.slice(0, 4).map((p) => (
                <div
                  key={p.name}
                  onClick={() => {
                    alert(`Color palette '${p.name}' applied.`);
                  }}
                  className="w-4 h-4 rounded-xs cursor-pointer border border-[#D1D1D6] hover:scale-110 transition shadow-xs"
                  style={{ backgroundColor: p.primary }}
                  title={p.name}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#616161]">Fonts:</span>
            <select
              onChange={(e) => {
                alert(`Font pairing '${e.target.value}' applied.`);
              }}
              className="h-5 text-xs border border-[#D1D1D6] rounded-[3px] px-1 bg-white w-28"
            >
              {FONT_PAIRINGS.map((fp) => (
                <option key={fp.name} value={fp.name}>
                  {fp.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="word-group-divider" />

      {/* 3. Page Background: Watermark, Page Color, Page Borders */}
      <div className="word-ribbon-group">
        {/* Watermark Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowWatermarks(!showWatermarks)}
            className="ribbon-btn-large"
            title="Add Watermark to pages"
          >
            <Stamp size={24} className="text-[#0F6CBD]" />
            <div className="flex items-center gap-0.5">
              <span>Watermark</span>
              <ChevronDown size={9} className="text-[#616161]" />
            </div>
          </button>
          {showWatermarks && (
            <div className="absolute top-16 left-0 bg-white border border-[#D1D1D6] rounded-md shadow-lg p-2 z-50 w-44 text-xs">
              <button
                onClick={() => {
                  onUpdatePageSetup({ watermarkText: undefined });
                  setShowWatermarks(false);
                }}
                className="w-full text-left px-2 py-1.5 hover:bg-[#F3F2F1] rounded text-[#C53929] font-medium"
              >
                Remove Watermark
              </button>
              <div className="h-px bg-[#EDEBE9] my-1" />
              {watermarks.map((wm) => (
                <button
                  key={wm}
                  onClick={() => {
                    onUpdatePageSetup({ watermarkText: wm });
                    setShowWatermarks(false);
                  }}
                  className="w-full text-left px-2 py-1.5 hover:bg-[#EFF6FC] hover:text-[#0F6CBD] rounded font-semibold text-[#616161]"
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
            <Droplet size={24} className="text-[#107C41]" />
            <div className="flex items-center gap-0.5">
              <span>Page Color</span>
              <ChevronDown size={9} className="text-[#616161]" />
            </div>
          </button>
          {showPageColors && (
            <div className="absolute top-16 left-0 bg-white border border-[#D1D1D6] rounded-md shadow-lg p-2 z-50 w-36 grid grid-cols-3 gap-1.5">
              {pageColors.map((col) => (
                <div
                  key={col}
                  onClick={() => {
                    onUpdatePageSetup({ pageColor: col });
                    setShowPageColors(false);
                  }}
                  className="w-8 h-8 rounded border border-[#D1D1D6] cursor-pointer hover:scale-105 transition"
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
          <Square size={24} className="text-[#0F6CBD]" />
          <span>Page Borders</span>
        </button>
      </div>
    </div>
  );
};
