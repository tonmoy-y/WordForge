import React from 'react';
import {
  PenTool,
  Highlighter,
  Eraser,
  MousePointer,
  Trash2,
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
    { name: 'Blue Pen', color: '#0F6CBD', width: 2, isHighlighter: false },
    { name: 'Red Pen', color: '#D83B01', width: 2, isHighlighter: false },
    { name: 'Green Pen', color: '#107C41', width: 2, isHighlighter: false },
    { name: 'Yellow Highlighter', color: '#FFEB3B', width: 12, isHighlighter: true },
    { name: 'Pink Highlighter', color: '#FF4081', width: 12, isHighlighter: true },
  ];

  return (
    <div className="word-ribbon-panel">
      {/* 1. Tools Group */}
      <div className="word-ribbon-group">
        <button
          onClick={() => setDrawingMode('select')}
          className={`ribbon-btn-large ${drawingMode === 'select' ? 'active' : ''}`}
          title="Select & Type Normally"
        >
          <MousePointer size={24} className="text-[#0F6CBD]" />
          <span>Select</span>
        </button>
        <button
          onClick={() => setDrawingMode('pen')}
          className={`ribbon-btn-large ${drawingMode === 'pen' ? 'active' : ''}`}
          title="Draw with Pen"
        >
          <PenTool size={24} className="text-[#0F6CBD]" />
          <span>Pen</span>
        </button>
        <button
          onClick={() => setDrawingMode('highlighter')}
          className={`ribbon-btn-large ${drawingMode === 'highlighter' ? 'active' : ''}`}
          title="Draw with Highlighter"
        >
          <Highlighter size={24} className="text-yellow-600" />
          <span>Highlighter</span>
        </button>
        <button
          onClick={() => setDrawingMode('eraser')}
          className={`ribbon-btn-large ${drawingMode === 'eraser' ? 'active' : ''}`}
          title="Stroke Eraser"
        >
          <Eraser size={24} className="text-[#616161]" />
          <span>Eraser</span>
        </button>
      </div>

      <div className="word-group-divider" />

      {/* 2. Pens Gallery */}
      <div className="word-ribbon-group">
        <div className="flex items-center gap-1.5">
          {defaultPens.map((pen, idx) => (
            <button
              key={idx}
              onClick={() => {
                setStrokeColor(pen.color);
                setStrokeWidth(pen.width);
                setDrawingMode(pen.isHighlighter ? 'highlighter' : 'pen');
              }}
              className={`p-1.5 border rounded-[3px] flex flex-col items-center justify-center transition w-12 h-14 ${
                strokeColor === pen.color && drawingMode !== 'select' && drawingMode !== 'eraser'
                  ? 'border-[#0F6CBD] bg-[#EFF6FC]'
                  : 'border-[#EDEBE9] hover:border-[#8A8886] bg-white'
              }`}
              title={pen.name}
            >
              <div
                className="w-2.5 h-6 rounded-t-full mb-1"
                style={{ backgroundColor: pen.color }}
              />
              <span className="text-[9px] text-[#616161] truncate w-full text-center">
                {pen.width}px
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="word-group-divider" />

      {/* 3. Actions */}
      <div className="word-ribbon-group">
        <button
          onClick={onClearDrawings}
          className="ribbon-btn-large text-[#C53929] hover:bg-[#FEF2F2]"
          title="Clear all inking drawings"
        >
          <Trash2 size={24} />
          <span>Clear All</span>
        </button>
      </div>
    </div>
  );
};
