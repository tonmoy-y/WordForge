import React, { useState } from 'react';
import { X, Layout } from 'lucide-react';
import { PageSetup, PageSize, PageOrientation, PAGE_SIZES } from '../../types/document';

interface PageSetupDialogProps {
  pageSetup: PageSetup;
  onSave: (updates: Partial<PageSetup>) => void;
  onClose: () => void;
}

export const PageSetupDialog: React.FC<PageSetupDialogProps> = ({
  pageSetup,
  onSave,
  onClose,
}) => {
  const [paperSize, setPaperSize] = useState<PageSize>(pageSetup.paperSize);
  const [orientation, setOrientation] = useState<PageOrientation>(pageSetup.orientation);
  const [top, setTop] = useState(pageSetup.margins.top);
  const [bottom, setBottom] = useState(pageSetup.margins.bottom);
  const [left, setLeft] = useState(pageSetup.margins.left);
  const [right, setRight] = useState(pageSetup.margins.right);
  const [headerDistance, setHeaderDistance] = useState(pageSetup.headerDistance);
  const [footerDistance, setFooterDistance] = useState(pageSetup.footerDistance);
  const [differentFirstPage, setDifferentFirstPage] = useState(pageSetup.differentFirstPage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      paperSize,
      orientation,
      margins: { top, bottom, left, right },
      headerDistance,
      footerDistance,
      differentFirstPage,
    });
    onClose();
  };

  return (
    <div className="word-dialog-overlay" onClick={onClose}>
      <div className="word-dialog-box w-[460px]" onClick={(e) => e.stopPropagation()}>
        <div className="word-dialog-header">
          <div className="flex items-center gap-2">
            <Layout size={16} className="text-[#185ABD]" />
            <span>Page Setup</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="word-dialog-content flex flex-col gap-4 text-xs">
            {/* Margins */}
            <div>
              <div className="font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1">
                Margins (Inches)
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-gray-600 font-medium">Top:</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.2"
                    max="4"
                    value={top}
                    onChange={(e) => setTop(parseFloat(e.target.value) || 1)}
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-right"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-gray-600 font-medium">Bottom:</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.2"
                    max="4"
                    value={bottom}
                    onChange={(e) => setBottom(parseFloat(e.target.value) || 1)}
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-right"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-gray-600 font-medium">Left:</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.2"
                    max="4"
                    value={left}
                    onChange={(e) => setLeft(parseFloat(e.target.value) || 1)}
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-right"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-gray-600 font-medium">Right:</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.2"
                    max="4"
                    value={right}
                    onChange={(e) => setRight(parseFloat(e.target.value) || 1)}
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-right"
                  />
                </div>
              </div>
            </div>

            {/* Orientation */}
            <div>
              <div className="font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1">
                Orientation
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                  <input
                    type="radio"
                    name="orientation"
                    checked={orientation === 'portrait'}
                    onChange={() => setOrientation('portrait')}
                    className="text-blue-600"
                  />
                  <span>Portrait (Vertical)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                  <input
                    type="radio"
                    name="orientation"
                    checked={orientation === 'landscape'}
                    onChange={() => setOrientation('landscape')}
                    className="text-blue-600"
                  />
                  <span>Landscape (Horizontal)</span>
                </label>
              </div>
            </div>

            {/* Paper Size */}
            <div>
              <div className="font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1">
                Paper Size
              </div>
              <select
                value={paperSize}
                onChange={(e) => setPaperSize(e.target.value as PageSize)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 bg-white font-medium"
              >
                {(Object.keys(PAGE_SIZES) as PageSize[]).map((sz) => (
                  <option key={sz} value={sz}>
                    {PAGE_SIZES[sz].name}
                  </option>
                ))}
              </select>
            </div>

            {/* Header & Footer Layout */}
            <div>
              <div className="font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1">
                Headers and Footers
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium">
                  <input
                    type="checkbox"
                    checked={differentFirstPage}
                    onChange={(e) => setDifferentFirstPage(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Different first page</span>
                </label>
              </div>
            </div>
          </div>

          <div className="word-dialog-footer">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              OK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
