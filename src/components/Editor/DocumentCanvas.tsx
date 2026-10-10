import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Editor, EditorContent } from '@tiptap/react';
import { DocumentState } from '../../types/document';
import {
  getPageDimensionsPx,
  calculatePages,
} from '../../core/pagination/paginationEngine';
import { DrawLayer } from './DrawLayer';
import { HorizontalRuler } from './HorizontalRuler';
import { VerticalRuler } from './VerticalRuler';

interface DocumentCanvasProps {
  editor: Editor | null;
  docState: DocumentState;
  onUpdateDocState: (updates: Partial<DocumentState>) => void;
  drawingMode: 'select' | 'pen' | 'highlighter' | 'eraser';
  strokeColor: string;
  strokeWidth: number;
}

export const DocumentCanvas: React.FC<DocumentCanvasProps> = ({
  editor,
  docState,
  onUpdateDocState,
  drawingMode,
  strokeColor,
  strokeWidth,
}) => {
  const { pageSetup, headerFooter, zoomLevel, viewMode, showRuler, drawings } = docState;
  const canvasViewportRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState(0);

  const pageDimensions = useMemo(() => getPageDimensionsPx(pageSetup), [pageSetup]);

  // Calculated pages for page count
  const pages = useMemo(() => {
    return calculatePages(docState.htmlContent, pageSetup);
  }, [docState.htmlContent, pageSetup]);

  const scale = zoomLevel / 100;

  // Sync scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollLeft(e.currentTarget.scrollLeft);
  };

  const handleAddStroke = (stroke: any) => {
    onUpdateDocState({
      drawings: [...drawings, stroke],
      isDirty: true,
    });
  };

  const handleRemoveStroke = (strokeId: string) => {
    onUpdateDocState({
      drawings: drawings.filter((d) => d.id !== strokeId),
      isDirty: true,
    });
  };

  // Render Footer Page Number text
  const formatPageNumber = (pageNumber: number, total: number) => {
    if (headerFooter.pageNumberFormat === 'Page X of Y') {
      return `Page ${pageNumber} of ${total}`;
    }
    if (headerFooter.pageNumberFormat === 'i, ii, iii') {
      const roman = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
      return roman[pageNumber - 1] || String(pageNumber);
    }
    return String(pageNumber);
  };

  const totalPageCount = pages.length;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#EDEDED]">
      {/* 1. Horizontal Ruler Bar */}
      {showRuler && viewMode === 'print' && (
        <div className="w-full z-20 shrink-0">
          <HorizontalRuler
            pageSetup={pageSetup}
            zoomLevel={zoomLevel}
            scrollLeft={scrollLeft}
            onUpdateMargins={(left, right) => {
              onUpdateDocState({
                pageSetup: {
                  ...pageSetup,
                  margins: { ...pageSetup.margins, left, right },
                },
                isDirty: true,
              });
            }}
          />
        </div>
      )}

      {/* 2. Main Viewport & Document Desk */}
      <div
        ref={canvasViewportRef}
        onScroll={handleScroll}
        className={`word-canvas-viewport flex-1 overflow-auto relative ${
          viewMode === 'focus' ? 'bg-[#0F172A]' : 'bg-[#EDEDED]'
        }`}
      >
        <div className="flex justify-center p-6 min-h-full">
          {/* Vertical Ruler on the left when enabled */}
          {showRuler && viewMode === 'print' && (
            <div className="mr-3 pt-1">
              <VerticalRuler pageSetup={pageSetup} zoomLevel={zoomLevel} />
            </div>
          )}

          {/* Scaled Page Container */}
          <div
            className="flex flex-col items-center origin-top transition-transform duration-75"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
            }}
          >
            {viewMode === 'print' ? (
              /* PRINT LAYOUT: Authentic Microsoft Word for Mac Paper Sheet */
              <div
                className="word-page-sheet relative bg-white transition-all"
                style={{
                  width: `${pageDimensions.pageWidthPx}px`,
                  minHeight: `${pageDimensions.pageHeightPx}px`,
                  backgroundColor: pageSetup.pageColor || '#FFFFFF',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
                  border: pageSetup.showPageBorders ? '2px solid #0F6CBD' : '1px solid rgba(0, 0, 0, 0.08)',
                  paddingLeft: `${pageDimensions.marginLeftPx}px`,
                  paddingRight: `${pageDimensions.marginRightPx}px`,
                  paddingTop: `${pageDimensions.marginTopPx}px`,
                  paddingBottom: `${pageDimensions.marginBottomPx}px`,
                }}
              >
                {/* Watermark */}
                {pageSetup.watermarkText && (
                  <div className="word-page-watermark select-none pointer-events-none">
                    {pageSetup.watermarkText}
                  </div>
                )}

                {/* Top Margin Header Zone */}
                <div
                  className="word-page-header absolute top-0 left-0 right-0 flex items-center justify-between group hover:border-b hover:border-dashed hover:border-gray-300 transition-all select-none"
                  style={{
                    height: `${pageDimensions.marginTopPx}px`,
                    paddingLeft: `${pageDimensions.marginLeftPx}px`,
                    paddingRight: `${pageDimensions.marginRightPx}px`,
                  }}
                >
                  <span className="text-[11px] text-gray-500 font-sans tracking-tight">
                    {pageSetup.differentFirstPage
                      ? headerFooter.firstPageHeaderText || ''
                      : headerFooter.headerText || ''}
                  </span>
                  <span className="text-[9px] text-gray-400 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                    Header
                  </span>
                </div>

                {/* Main Editable Body Area */}
                <div className="word-page-content-area relative min-h-[700px] outline-none">
                  <EditorContent editor={editor} />
                </div>

                {/* Bottom Margin Footer Zone */}
                <div
                  className="word-page-footer absolute bottom-0 left-0 right-0 flex items-center justify-between group hover:border-t hover:border-dashed hover:border-gray-300 transition-all select-none"
                  style={{
                    height: `${pageDimensions.marginBottomPx}px`,
                    paddingLeft: `${pageDimensions.marginLeftPx}px`,
                    paddingRight: `${pageDimensions.marginRightPx}px`,
                  }}
                >
                  <span className="text-[11px] text-gray-500 font-sans tracking-tight">
                    {pageSetup.differentFirstPage
                      ? headerFooter.firstPageFooterText || ''
                      : headerFooter.footerText || ''}
                  </span>
                  {headerFooter.showPageNumbers && (
                    <span className="text-[11px] text-gray-500 font-medium">
                      {formatPageNumber(1, totalPageCount)}
                    </span>
                  )}
                  <span className="text-[9px] text-gray-400 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                    Footer
                  </span>
                </div>

                {/* Digital Inking Overlay */}
                <DrawLayer
                  pageIndex={0}
                  width={pageDimensions.pageWidthPx}
                  height={pageDimensions.pageHeightPx}
                  drawingMode={drawingMode}
                  strokeColor={strokeColor}
                  strokeWidth={strokeWidth}
                  drawings={drawings}
                  onAddStroke={handleAddStroke}
                  onRemoveStroke={handleRemoveStroke}
                />
              </div>
            ) : viewMode === 'web' ? (
              /* WEB LAYOUT: Responsive continuous document */
              <div
                className="bg-white shadow-md p-12 max-w-4xl w-full min-h-[90vh] my-6 rounded border border-gray-200"
                style={{ backgroundColor: pageSetup.pageColor || '#FFFFFF' }}
              >
                <EditorContent editor={editor} />
              </div>
            ) : viewMode === 'read' ? (
              /* READ MODE: Book-like reading format */
              <div className="bg-[#FFFDF7] shadow-xl p-16 max-w-3xl w-full min-h-[90vh] my-8 rounded-lg border border-[#E6E1D3]">
                <div className="text-center font-serif text-2xl font-bold mb-6 text-[#2D2A26]">
                  {docState.title}
                </div>
                <EditorContent editor={editor} />
              </div>
            ) : (
              /* FOCUS MODE: Dark distraction-free mode */
              <div className="bg-[#1E293B] text-[#F8FAFC] shadow-2xl p-16 max-w-3xl w-full min-h-[90vh] my-8 rounded-lg border border-slate-700">
                <EditorContent editor={editor} />
              </div>
            )}
          </div>

          {/* Symmetric spacer on right so page sheet remains centered identically to HorizontalRuler */}
          {showRuler && viewMode === 'print' && (
            <div className="w-[30px] shrink-0 pointer-events-none" />
          )}
        </div>
      </div>
    </div>
  );
};
