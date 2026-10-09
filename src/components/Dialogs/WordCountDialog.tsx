import React from 'react';
import { X, FileSpreadsheet } from 'lucide-react';
import { DocumentState } from '../../types/document';
import { calculateTextStatistics } from '../../core/documentModel';

interface WordCountDialogProps {
  docState: DocumentState;
  onClose: () => void;
}

export const WordCountDialog: React.FC<WordCountDialogProps> = ({ docState, onClose }) => {
  const stats = calculateTextStatistics(docState.htmlContent);
  const totalPages = docState.metadata.pageCount || 1;

  return (
    <div className="word-dialog-overlay" onClick={onClose}>
      <div className="word-dialog-box w-80" onClick={(e) => e.stopPropagation()}>
        <div className="word-dialog-header">
          <div className="flex items-center gap-2">
            <FileSpreadsheet size={16} className="text-[#185ABD]" />
            <span>Word Count</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <X size={14} />
          </button>
        </div>

        <div className="word-dialog-content flex flex-col gap-2.5 text-xs">
          <div className="flex justify-between py-1 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Pages:</span>
            <span className="font-semibold text-gray-900">{totalPages}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Words:</span>
            <span className="font-semibold text-gray-900">{stats.words.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Characters (no spaces):</span>
            <span className="font-semibold text-gray-900">{stats.charsNoSpaces.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Characters (with spaces):</span>
            <span className="font-semibold text-gray-900">{stats.chars.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Paragraphs:</span>
            <span className="font-semibold text-gray-900">{stats.paragraphs.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-600 font-medium">Lines:</span>
            <span className="font-semibold text-gray-900">{stats.lines.toLocaleString()}</span>
          </div>
        </div>

        <div className="word-dialog-footer">
          <button onClick={onClose} className="btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
