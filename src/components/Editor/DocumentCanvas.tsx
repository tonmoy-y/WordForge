import React, { useMemo } from 'react';
import { Editor, EditorContent } from '@tiptap/react';
import { DocumentState } from '../../types/document';
import {
  getPageDimensionsPx,
  calculatePages,
} from '../../core/pagination/paginationEngine';
import { DrawLayer } from './DrawLayer';
import { HorizontalRuler } from './HorizontalRuler';

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

  const pageDimensions = useMemo(() => getPageDimensionsPx(pageSetup), [pageSetup]);

  // Paginated breakdown
  const pages = useMemo(() => {
    return calculatePages(docState.htmlContent, pageSetup);
  }, [docState.htmlContent, pageSetup]);

  const scale = zoomLevel / 100;

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

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#E8ECEF]">
      {/* Horizontal Ruler */}
      {showRuler && viewMode === 'print' && (
        <div className="w-full bg-[#F1F5F9] border-b border-[#CBD5E1] overflow-hidden z-20">
          <HorizontalRuler
            pageSetup={pageSetup}
            zoomLevel={zoomLevel}
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

      {/* Main Viewport */}
      <div
        className={`word-canvas-viewport ${
          viewMode === 'focus' ? 'bg-[#1E293B]' : 'bg-[#E8ECEF]'
        }`}
      >
        <div
          className="flex flex-col items-center origin-top transition-transform duration-75"
          style={{
            transform: `scale(${scale})`,
          }}
        >
          {viewMode === 'print' ? (
            /* PRINT LAYOUT: Paginated Paper Sheets */
            pages.map((page, index) => {
              const isFirst = index === 0;
              const headerText =
                isFirst && pageSetup.differentFirstPage
                  ? headerFooter.firstPageHeaderText || ''
                  : headerFooter.headerText;
              const footerText =
                isFirst && pageSetup.differentFirstPage
                  ? headerFooter.firstPageFooterText || ''
                  : headerFooter.footerText;

              return (
                <div
                  key={index}
                  className="word-page-sheet"
                  style={{
                    width: `${pageDimensions.pageWidthPx}px`,
                    minHeight: `${pageDimensions.pageHeightPx}px`,
                    height: `${pageDimensions.pageHeightPx}px`,
                    backgroundColor: pageSetup.pageColor || '#FFFFFF',
                    border: pageSetup.showPageBorders ? '2px solid #185ABD' : '1px solid #D5DAE0',
                  }}
                >
                  {/* Watermark */}
                  {pageSetup.watermarkText && (
                    <div className="word-page-watermark">{pageSetup.watermarkText}</div>
                  )}

                  {/* Header Area */}
                  <div
                    className="word-page-header"
                    style={{
                      paddingLeft: `${pageDimensions.marginLeftPx}px`,
                      paddingRight: `${pageDimensions.marginRightPx}px`,
                    }}
                  >
                    <span>{headerText}</span>
                    <span className="text-[10px] text-gray-400">Header</span>
                  </div>

                  {/* Printable Content Area */}
                  <div
                    className="word-page-content-area"
                    style={{
                      paddingLeft: `${pageDimensions.marginLeftPx}px`,
                      paddingRight: `${pageDimensions.marginRightPx}px`,
                    }}
                  >
                    {isFirst ? (
                      /* Live editable TipTap instance on first page or master flow */
                      <EditorContent editor={editor} />
                    ) : (
                      /* Subsequent paginated overflow flow preview */
                      <div
                        className="ProseMirror"
                        dangerouslySetInnerHTML={{ __html: page.htmlContent }}
                      />
                    )}
                  </div>

                  {/* Footer Area */}
                  <div
                    className="word-page-footer"
                    style={{
                      paddingLeft: `${pageDimensions.marginLeftPx}px`,
                      paddingRight: `${pageDimensions.marginRightPx}px`,
                    }}
                  >
                    <span>{footerText}</span>
                    {headerFooter.showPageNumbers && (
                      <span className="font-medium text-gray-500">
                        {formatPageNumber(page.pageNumber, page.totalPageCount)}
                      </span>
                    )}
                  </div>

                  {/* Digital Inking Overlay */}
                  <DrawLayer
                    pageIndex={index}
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
              );
            })
          ) : viewMode === 'web' ? (
            /* WEB LAYOUT: Responsive continuous document */
            <div
              className="bg-white shadow-md p-12 max-w-4xl w-full min-h-[90vh] my-6 rounded"
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
            <div className="bg-[#0F172A] text-[#F8FAFC] shadow-2xl p-16 max-w-3xl w-full min-h-[90vh] my-8 rounded-lg border border-slate-700">
              <EditorContent editor={editor} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
