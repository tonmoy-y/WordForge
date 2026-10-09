import React from 'react';
import {
  PenTool,
  Highlighter,
  Eraser,
  MousePointer,
  Trash2,
  Palette,
} from 'lucide-react';

interface DrawTabProps {
  drawingMode: 'select' | 'pen' | 'highlighter' | 'eraser';
  setDrawingMode: (mode: 'select' | 'pen' | 'highlighter' | 'eraser') => void;
  strokeColor: string;
  setStrokeColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  onClearDrawings: () => void;
}

export const DrawTab: React.FC<DrawTabProps> = ({
  drawingMode,
  setDrawingMode,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  onClearDrawings,
}) => {
  const defaultPens = [
    { name: 'Black Pen', color: '#000000', width: 2, isHighlighter: false },
    { name: 'Blue Pen', color: '#185ABD', width: 2, isHighlighter: false },
    { name: 'Red Pen', color: '#D83B01', width: 2, isHighlighter: false },
    { name: 'Green Pen', color: '#107C41', width: 2, isHighlighter: false },
    { name: 'Yellow Highlighter', color: '#FFEB3B', width: 12, isHighlighter: true },
    { name: 'Pink Highlighter', color: '#FF4081', width: 12, isHighlighter: true },
  ];

  return (
    <div className="word-ribbon-panel">
      {/* 1. Tools Group */}
      <div className="word-ribbon-group">
        <div className="word-group-content">
          <button
            onClick={() => setDrawingMode('select')}
            className={`ribbon-btn-large ${drawingMode === 'select' ? 'active' : ''}`}
            title="Select & Type Normally"
          >
            <MousePointer size={22} className="text-[#185ABD]" />
            <span>Select</span>
          </button>
          <button
            onClick={() => setDrawingMode('pen')}
            className={`ribbon-btn-large ${drawingMode === 'pen' ? 'active' : ''}`}
            title="Draw with Pen"
          >
            <PenTool size={22} className="text-[#185ABD]" />
            <span>Pen</span>
          </button>
          <button
            onClick={() => setDrawingMode('highlighter')}
            className={`ribbon-btn-large ${drawingMode === 'highlighter' ? 'active' : ''}`}
            title="Draw with Highlighter"
          >
            <Highlighter size={22} className="text-yellow-600" />
            <span>Highlighter</span>
          </button>
          <button
            onClick={() => setDrawingMode('eraser')}
            className={`ribbon-btn-large ${drawingMode === 'eraser' ? 'active' : ''}`}
            title="Stroke Eraser"
          >
            <Eraser size={22} className="text-gray-600" />
            <span>Eraser</span>
          </button>
        </div>
        <div className="word-group-label">Tools</div>
      </div>

      <div className="word-group-separator" />

      {/* 2. Pens Gallery */}
      <div className="word-ribbon-group">
        <div className="flex items-center gap-1.5 flex-1">
          {defaultPens.map((pen, idx) => (
            <button
              key={idx}
              onClick={() => {
                setStrokeColor(pen.color);
                setStrokeWidth(pen.width);
                setDrawingMode(pen.isHighlighter ? 'highlighter' : 'pen');
              }}
              className={`p-1.5 border rounded flex flex-col items-center justify-center transition w-12 h-14 ${
                strokeColor === pen.color && drawingMode !== 'select' && drawingMode !== 'eraser'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-400 bg-white'
              }`}
              title={pen.name}
            >
              <div
                className="w-4 h-4 rounded-full border border-gray-300 mb-1"
                style={{ backgroundColor: pen.color }}
              />
              <span className="text-[10px] text-gray-600 leading-tight">
                {pen.isHighlighter ? 'H-Lite' : `${pen.width}px`}
              </span>
            </button>
          ))}
        </div>
        <div className="word-group-label">Pens</div>
      </div>

      <div className="word-group-separator" />

      {/* 3. Color & Thickness */}
      <div className="word-ribbon-group">
        <div className="flex flex-col gap-1 flex-1 justify-center">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600 flex items-center gap-1">
              <Palette size={13} />
              <span>Color:</span>
            </label>
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="w-6 h-6 border-0 p-0 cursor-pointer rounded"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Size:</span>
            {[1, 2, 4, 8, 16].map((w) => (
              <button
                key={w}
                onClick={() => setStrokeWidth(w)}
                className={`text-xs px-1.5 py-0.5 rounded border ${
                  strokeWidth === w ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
        <div className="word-group-label">Thickness</div>
      </div>

      <div className="word-group-separator" />

      {/* 4. Canvas Actions */}
      <div className="word-ribbon-group">
        <div className="word-group-content">
          <button
            onClick={onClearDrawings}
            className="ribbon-btn-large text-red-600 hover:text-red-700"
            title="Erase all digital inking on this document"
          >
            <Trash2 size={22} />
            <span>Clear Ink</span>
          </button>
        </div>
        <div className="word-group-label">Manage</div>
      </div>
    </div>
  );
};
