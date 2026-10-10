import React from 'react';
import {
  FileText,
  Globe,
  BookOpen,
  Maximize,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';

interface ViewTabProps {
  viewMode: 'print' | 'web' | 'read' | 'focus';
  onSetViewMode: (mode: 'print' | 'web' | 'read' | 'focus') => void;
  showRuler: boolean;
  onToggleRuler: () => void;
  showNavPane: boolean;
  onToggleNavPane: () => void;
  zoomLevel: number;
  onSetZoom: (zoom: number) => void;
}

export const ViewTab: React.FC<ViewTabProps> = ({
  viewMode,
  onSetViewMode,
  showRuler,
  onToggleRuler,
  showNavPane,
  onToggleNavPane,
  zoomLevel,
  onSetZoom,
}) => {
  return (
    <div className="word-ribbon-panel">
      {/* 1. Views */}
      <div className="word-ribbon-group">
        <button
          onClick={() => onSetViewMode('print')}
          className={`ribbon-btn-large ${viewMode === 'print' ? 'active' : ''}`}
          title="Print Layout (Paginated sheets)"
        >
          <FileText size={24} className="text-[#0F6CBD]" />
          <span>Print Layout</span>
        </button>
        <button
          onClick={() => onSetViewMode('web')}
          className={`ribbon-btn-large ${viewMode === 'web' ? 'active' : ''}`}
          title="Web Layout"
        >
          <Globe size={24} className="text-[#107C41]" />
          <span>Web Layout</span>
        </button>
        <button
          onClick={() => onSetViewMode('read')}
          className={`ribbon-btn-large ${viewMode === 'read' ? 'active' : ''}`}
          title="Read Mode"
        >
          <BookOpen size={24} className="text-[#742774]" />
          <span>Read Mode</span>
        </button>
        <button
          onClick={() => onSetViewMode('focus')}
          className={`ribbon-btn-large ${viewMode === 'focus' ? 'active' : ''}`}
          title="Focus Mode"
        >
          <Maximize size={24} className="text-[#D83B01]" />
          <span>Focus</span>
        </button>
      </div>

      <div className="word-group-divider" />

      {/* 2. Show / Hide */}
      <div className="word-ribbon-group">
        <div className="flex flex-col gap-1.5 justify-center">
          <label className="flex items-center gap-1.5 text-xs text-[#242424] cursor-pointer">
            <input
              type="checkbox"
              checked={showRuler}
              onChange={onToggleRuler}
              className="rounded text-[#0F6CBD]"
            />
            <span>Ruler</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-[#242424] cursor-pointer">
            <input
              type="checkbox"
              checked={showNavPane}
              onChange={onToggleNavPane}
              className="rounded text-[#0F6CBD]"
            />
            <span>Navigation Pane</span>
          </label>
        </div>
      </div>

      <div className="word-group-divider" />

      {/* 3. Zoom */}
      <div className="word-ribbon-group">
        <button
          onClick={() => onSetZoom(100)}
          className={`ribbon-btn-large ${zoomLevel === 100 ? 'active' : ''}`}
          title="100% Zoom"
        >
          <Maximize2 size={24} className="text-[#0F6CBD]" />
          <span>100%</span>
        </button>
        <button
          onClick={() => onSetZoom(Math.min(500, zoomLevel + 25))}
          className="ribbon-btn-large"
          title="Zoom In"
        >
          <ZoomIn size={24} className="text-[#616161]" />
          <span>Zoom In</span>
        </button>
        <button
          onClick={() => onSetZoom(Math.max(25, zoomLevel - 25))}
          className="ribbon-btn-large"
          title="Zoom Out"
        >
          <ZoomOut size={24} className="text-[#616161]" />
          <span>Zoom Out</span>
        </button>
      </div>
    </div>
  );
};
