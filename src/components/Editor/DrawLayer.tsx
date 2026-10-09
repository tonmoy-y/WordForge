import React, { useRef, useState } from 'react';
import { DrawingStroke, DrawingPoint } from '../../types/document';

interface DrawLayerProps {
  pageIndex: number;
  width: number;
  height: number;
  drawingMode: 'select' | 'pen' | 'highlighter' | 'eraser';
  strokeColor: string;
  strokeWidth: number;
  drawings: DrawingStroke[];
  onAddStroke: (stroke: DrawingStroke) => void;
  onRemoveStroke: (strokeId: string) => void;
}

export const DrawLayer: React.FC<DrawLayerProps> = ({
  pageIndex,
  width,
  height,
  drawingMode,
  strokeColor,
  strokeWidth,
  drawings,
  onAddStroke,
  onRemoveStroke,
}) => {
  const [currentPoints, setCurrentPoints] = useState<DrawingPoint[]>([]);
  const isDrawing = useRef(false);

  const isInkActive = drawingMode !== 'select';

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isInkActive) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (drawingMode === 'eraser') {
      // Find any stroke near this point
      const hit = drawings.find((s) =>
        s.pageIndex === pageIndex &&
        s.points.some((p) => Math.hypot(p.x - x, p.y - y) < 15)
      );
      if (hit) {
        onRemoveStroke(hit.id);
      }
      return;
    }

    isDrawing.current = true;
    setCurrentPoints([{ x, y }]);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isInkActive || !isDrawing.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentPoints((prev) => [...prev, { x, y }]);
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isInkActive || !isDrawing.current) return;
    isDrawing.current = false;

    if (currentPoints.length > 1) {
      const newStroke: DrawingStroke = {
        id: 'stroke_' + Math.random().toString(36).substring(2, 9),
        pageIndex,
        tool: drawingMode === 'highlighter' ? 'highlighter' : 'pen',
        color: strokeColor,
        width: drawingMode === 'highlighter' ? strokeWidth * 2.5 : strokeWidth,
        points: currentPoints,
      };
      onAddStroke(newStroke);
    }
    setCurrentPoints([]);
  };

  const pageStrokes = drawings.filter((d) => d.pageIndex === pageIndex);

  function pointsToPath(points: DrawingPoint[]): string {
    if (points.length === 0) return '';
    return points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  }

  return (
    <svg
      width={width}
      height={height}
      className={`absolute inset-0 z-20 ${
        isInkActive ? (drawingMode === 'eraser' ? 'cursor-cell' : 'cursor-crosshair') : 'pointer-events-none'
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ touchAction: 'none' }}
    >
      {/* Existing saved strokes */}
      {pageStrokes.map((s) => (
        <path
          key={s.id}
          d={pointsToPath(s.points)}
          fill="none"
          stroke={s.color}
          strokeWidth={s.width}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={s.tool === 'highlighter' ? 0.45 : 1}
          style={{
            mixBlendMode: s.tool === 'highlighter' ? 'multiply' : 'normal',
          }}
        />
      ))}

      {/* Current stroke preview */}
      {currentPoints.length > 1 && (
        <path
          d={pointsToPath(currentPoints)}
          fill="none"
          stroke={strokeColor}
          strokeWidth={drawingMode === 'highlighter' ? strokeWidth * 2.5 : strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={drawingMode === 'highlighter' ? 0.45 : 1}
          style={{
            mixBlendMode: drawingMode === 'highlighter' ? 'multiply' : 'normal',
          }}
        />
      )}
    </svg>
  );
};
