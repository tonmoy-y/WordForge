import React from 'react';
import {
  FileText,
  Globe,
  BookOpen,
  Maximize,
  SlidersHorizontal,
  Compass,
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
        <div className="word-group-content">
          <button
            onClick={() => onSetViewMode('print')}
            className={`ribbon-btn-large ${viewMode === 'print' ? 'active' : ''}`}
            title="Print Layout (Paginated sheets)"
          >
            <FileText size={22} className="text-[#185ABD]" />
            <span>Print Layout</span>
          </button>
          <button
            onClick={() => onSetViewMode('web')}
            className={`ribbon-btn-large ${viewMode === 'web' ? 'active' : ''}`}
            title="Web Layout (Continuous responsive canvas)"
          >
            <Globe size={22} className="text-[#107C41]" />
            <span>Web Layout</span>
          </button>
          <button
            onClick={() => onSetViewMode('read')}
            className={`ribbon-btn-large ${viewMode === 'read' ? 'active' : ''}`}
            title="Read Mode (Comfortable distraction-free reading)"
          >
            <BookOpen size={22} className="text-[#742774]" />
            <span>Read Mode</span>
          </button>
          <button
            onClick={() => onSetViewMode('focus')}
            className={`ribbon-btn-large ${viewMode === 'focus' ? 'active' : ''}`}
            title="Focus Mode (Distraction-free dark writing space)"
          >
            <Maximize size={22} className="text-[#D83B01]" />
            <span>Focus</span>
          </button>
        </div>
        <div className="word-group-label">Views</div>
      </div>

      <div className="word-group-separator" />

      {/* 2. Show / Hide */}
      <div className="word-ribbon-group">
        <div className="flex flex-col gap-1.5 flex-1 justify-center">
          <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={showRuler}
              onChange={onToggleRuler}
              className="rounded text-blue-600"
            />
            <span>Ruler</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={showNavPane}
              onChange={onToggleNavPane}
              className="rounded text-blue-600"
            />
            <span>Navigation Pane</span>
          </label>
        </div>
        <div className="word-group-label">Show</div>
      </div>

      <div className="word-group-separator" />

      {/* 3. Zoom */}
      <div className="word-ribbon-group">
        <div className="word-group-content">
          <button
            onClick={() => onSetZoom(100)}
            className={`ribbon-btn-large ${zoomLevel === 100 ? 'active' : ''}`}
            title="100% Zoom"
          >
            <span className="text-sm font-bold text-[#185ABD]">100%</span>
            <span>100%</span>
          </button>
          <button
            onClick={() => onSetZoom(125)}
            className="ribbon-btn-large"
            title="Page Width Zoom"
          >
            <Maximize2 size={22} className="text-[#185ABD]" />
            <span>Page Width</span>
          </button>
          <div className="flex flex-col gap-1 justify-center">
            <button
              onClick={() => onSetZoom(Math.min(500, zoomLevel + 10))}
              className="ribbon-btn-small"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => onSetZoom(Math.max(10, zoomLevel - 10))}
              className="ribbon-btn-small"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
          </div>
        </div>
        <div className="word-group-label">Zoom</div>
      </div>
    </div>
  );
};
