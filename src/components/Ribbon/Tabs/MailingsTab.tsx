import React, { useState } from 'react';
import {
  Mail,
  Users,
  Code,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  CheckCircle,
} from 'lucide-react';
import { Editor } from '@tiptap/react';
import { MailMergeState } from '../../../types/document';
import { parseCsvRecipients } from '../../../core/mailmerge/mailMergeEngine';

interface MailingsTabProps {
  editor: Editor | null;
  mailMerge: MailMergeState;
  onUpdateMailMerge: (updates: Partial<MailMergeState>) => void;
  onOpenMailMergeDialog: () => void;
  onFinishAndMerge: () => void;
}

export const MailingsTab: React.FC<MailingsTabProps> = ({
  editor,
  mailMerge,
  onUpdateMailMerge,
  onOpenMailMergeDialog,
  onFinishAndMerge,
}) => {
  const [showFields, setShowFields] = useState(false);

  if (!editor) return null;

  const handleImportCsv = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,text/csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          const csvText = re.target?.result as string;
          const { fields, records, error } = parseCsvRecipients(csvText);
          if (error) {
            alert(`CSV Error: ${error}`);
          } else {
            onUpdateMailMerge({
              enabled: true,
              fields,
              records,
              currentRecordIndex: 0,
            });
            alert(`Imported ${records.length} recipient records with fields: ${fields.join(', ')}`);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleInsertField = (field: string) => {
    editor.chain().focus().insertContent(`&laquo;${field}&raquo;`).run();
    setShowFields(false);
  };

  const totalRecords = mailMerge.records.length;
  const currentIndex = mailMerge.currentRecordIndex;

  return (
    <div className="word-ribbon-panel">
      {/* 1. Start Mail Merge */}
      <div className="word-ribbon-group">
        <div className="word-group-content">
          <button onClick={handleImportCsv} className="ribbon-btn-large" title="Select Recipients (Import CSV file)">
            <Users size={22} className="text-[#185ABD]" />
            <span>Select Recipients</span>
          </button>
          <button onClick={onOpenMailMergeDialog} className="ribbon-btn-large" title="Open Mail Merge Wizard">
            <Mail size={22} className="text-[#107C41]" />
            <span>Merge Wizard</span>
          </button>
        </div>
        <div className="word-group-label">Start Merge</div>
      </div>

      <div className="word-group-separator" />

      {/* 2. Write & Insert Fields */}
      <div className="word-ribbon-group">
        <div className="word-group-content">
          <div className="relative">
            <button
              onClick={() => setShowFields(!showFields)}
              disabled={mailMerge.fields.length === 0}
              className={`ribbon-btn-large ${mailMerge.fields.length === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
              title="Insert Mail Merge Field into document"
            >
              <Code size={22} className="text-[#742774]" />
              <span>Insert Field</span>
            </button>
            {showFields && (
              <div className="absolute top-16 left-0 bg-white border border-gray-300 rounded shadow-xl p-1.5 z-50 w-44 text-xs">
                {mailMerge.fields.map((f) => (
                  <button
                    key={f}
                    onClick={() => handleInsertField(f)}
                    className="w-full text-left px-2 py-1.5 hover:bg-blue-50 hover:text-blue-700 rounded font-mono"
                  >
                    &laquo;{f}&raquo;
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="word-group-label">Insert Fields</div>
      </div>

      <div className="word-group-separator" />

      {/* 3. Preview Results */}
      <div className="word-ribbon-group">
        <div className="flex flex-col gap-1.5 flex-1 justify-center">
          <button
            onClick={() => onUpdateMailMerge({ enabled: !mailMerge.enabled })}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs border ${
              mailMerge.enabled ? 'bg-blue-50 text-blue-700 border-blue-400 font-semibold' : 'bg-white border-gray-300'
            }`}
            title="Toggle Live Merge Preview"
          >
            <Eye size={13} />
            <span>Preview Results</span>
          </button>

          {/* Stepper */}
          <div className="flex items-center gap-1 text-xs">
            <button
              disabled={currentIndex <= 0}
              onClick={() => onUpdateMailMerge({ currentRecordIndex: Math.max(0, currentIndex - 1) })}
              className={`p-1 rounded border border-gray-200 ${
                currentIndex <= 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100'
              }`}
              title="Previous Record"
            >
              <ChevronLeft size={13} />
            </button>
            <span className="font-mono text-[11px] px-1 text-gray-700">
              {totalRecords > 0 ? `${currentIndex + 1} of ${totalRecords}` : '0 of 0'}
            </span>
            <button
              disabled={currentIndex >= totalRecords - 1}
              onClick={() => onUpdateMailMerge({ currentRecordIndex: Math.min(totalRecords - 1, currentIndex + 1) })}
              className={`p-1 rounded border border-gray-200 ${
                currentIndex >= totalRecords - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100'
              }`}
              title="Next Record"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
        <div className="word-group-label">Preview</div>
      </div>

      <div className="word-group-separator" />

      {/* 4. Finish & Merge */}
      <div className="word-ribbon-group">
        <div className="word-group-content">
          <button
            onClick={onFinishAndMerge}
            disabled={totalRecords === 0}
            className={`ribbon-btn-large ${totalRecords === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
            title="Generate and export merged documents"
          >
            <FileCheck size={22} className="text-[#107C41]" />
            <span>Finish & Merge</span>
          </button>
        </div>
        <div className="word-group-label">Finish</div>
      </div>
    </div>
  );
};
