import React, { useState } from 'react';
import { X, Mail, FileDown, CheckCircle } from 'lucide-react';
import { MailMergeState, DocumentState } from '../../types/document';
import { generateMergedBatch, substituteMergeFields } from '../../core/mailmerge/mailMergeEngine';
import { exportToDocx } from '../../core/docx/docxExporter';

interface MailMergeDialogProps {
  mailMerge: MailMergeState;
  docState: DocumentState;
  onApplyMergedDocument: (mergedHtml: string) => void;
  onClose: () => void;
}

export const MailMergeDialog: React.FC<MailMergeDialogProps> = ({
  mailMerge,
  docState,
  onApplyMergedDocument,
  onClose,
}) => {
  const [outputMode, setOutputMode] = useState<'combined' | 'current'>('combined');
  const [isExporting, setIsExporting] = useState(false);

  const totalRecords = mailMerge.records.length;

  const handleExportDocx = async () => {
    setIsExporting(true);
    try {
      const mergedHtml =
        outputMode === 'combined'
          ? generateMergedBatch(docState.htmlContent, mailMerge.records)
          : substituteMergeFields(
              docState.htmlContent,
              mailMerge.records[mailMerge.currentRecordIndex] || {}
            );

      const blob = await exportToDocx({
        ...docState,
        htmlContent: mergedHtml,
        metadata: {
          ...docState.metadata,
          title: `${docState.title} - Merged`,
        },
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${docState.title.replace(/\s+/g, '_')}_Merged.docx`;
      a.click();
      URL.revokeObjectURL(url);
      onClose();
    } catch (e: any) {
      alert(`Export error: ${e.message || String(e)}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleApplyToEditor = () => {
    const mergedHtml =
      outputMode === 'combined'
        ? generateMergedBatch(docState.htmlContent, mailMerge.records)
        : substituteMergeFields(
            docState.htmlContent,
            mailMerge.records[mailMerge.currentRecordIndex] || {}
          );

    onApplyMergedDocument(mergedHtml);
    onClose();
  };

  return (
    <div className="word-dialog-overlay" onClick={onClose}>
      <div className="word-dialog-box w-[500px]" onClick={(e) => e.stopPropagation()}>
        <div className="word-dialog-header">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-[#185ABD]" />
            <span>Finish & Merge Mailings</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <X size={14} />
          </button>
        </div>

        <div className="word-dialog-content flex flex-col gap-3.5 text-xs">
          {/* Data Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-semibold text-blue-900">Connected Recipient List</div>
              <div className="text-blue-700 text-[11px]">
                {totalRecords} records found with {mailMerge.fields.length} available merge fields.
              </div>
            </div>
            <CheckCircle size={20} className="text-blue-600" />
          </div>

          {/* Merge Mode Options */}
          <div>
            <div className="font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1">
              Merge Output Options
            </div>
            <div className="flex flex-col gap-2">
              <label className="flex items-start gap-2 cursor-pointer p-2 rounded hover:bg-gray-50 border border-gray-200">
                <input
                  type="radio"
                  name="mergeMode"
                  checked={outputMode === 'combined'}
                  onChange={() => setOutputMode('combined')}
                  className="mt-0.5 text-blue-600"
                />
                <div>
                  <div className="font-semibold text-gray-800">
                    All Records (Combined Document)
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Generates a single continuous document containing all {totalRecords} records
                    separated by page breaks.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-2 cursor-pointer p-2 rounded hover:bg-gray-50 border border-gray-200">
                <input
                  type="radio"
                  name="mergeMode"
                  checked={outputMode === 'current'}
                  onChange={() => setOutputMode('current')}
                  className="mt-0.5 text-blue-600"
                />
                <div>
                  <div className="font-semibold text-gray-800">
                    Current Record Only (Record {mailMerge.currentRecordIndex + 1})
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Applies substitutions only for the active recipient in the stepper preview.
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="word-dialog-footer">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleApplyToEditor} className="btn-secondary">
            Apply to Canvas
          </button>
          <button
            onClick={handleExportDocx}
            disabled={isExporting}
            className="btn-primary flex items-center gap-1.5"
          >
            <FileDown size={14} />
            <span>{isExporting ? 'Exporting…' : 'Export Merged DOCX'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
