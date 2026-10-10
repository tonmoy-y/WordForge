import React, { useState } from 'react';
import {
  Mail,
  Users,
  Code,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileCheck,
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
        <button onClick={handleImportCsv} className="ribbon-btn-large" title="Select Recipients (Import CSV file)">
          <Users size={24} className="text-[#0F6CBD]" />
          <span>Select Recipients</span>
        </button>
        <button onClick={onOpenMailMergeDialog} className="ribbon-btn-large" title="Open Mail Merge Wizard">
          <Mail size={24} className="text-[#107C41]" />
          <span>Merge Wizard</span>
        </button>
      </div>

      <div className="word-group-divider" />

      {/* 2. Write & Insert Fields */}
      <div className="word-ribbon-group">
        <div className="relative">
          <button
            onClick={() => setShowFields(!showFields)}
            disabled={mailMerge.fields.length === 0}
            className={`ribbon-btn-large ${mailMerge.fields.length === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
            title="Insert Mail Merge Field into document"
          >
            <Code size={24} className="text-[#742774]" />
            <span>Insert Field</span>
          </button>
          {showFields && (
            <div className="absolute top-16 left-0 bg-white border border-[#D1D1D6] rounded-md shadow-xl p-1.5 z-50 w-44 text-xs">
              {mailMerge.fields.map((f) => (
                <button
                  key={f}
                  onClick={() => handleInsertField(f)}
                  className="w-full text-left px-2 py-1.5 hover:bg-[#EFF6FC] hover:text-[#0F6CBD] rounded font-mono"
                >
                  &laquo;{f}&raquo;
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="word-group-divider" />

      {/* 3. Preview Results */}
      <div className="word-ribbon-group">
        <div className="flex flex-col gap-1.5 justify-center">
          <button
            onClick={() => onUpdateMailMerge({ enabled: !mailMerge.enabled })}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-[3px] text-xs border ${
              mailMerge.enabled ? 'bg-[#EFF6FC] text-[#0F6CBD] border-[#0F6CBD] font-semibold' : 'bg-white border-[#D1D1D6]'
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
              className={`p-1 rounded border border-[#D1D1D6] ${
                currentIndex <= 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-black/5'
              }`}
              title="Previous Record"
            >
              <ChevronLeft size={13} />
            </button>
            <span className="font-mono text-[11px] px-1 text-[#616161]">
              {totalRecords > 0 ? `${currentIndex + 1} of ${totalRecords}` : '0 of 0'}
            </span>
            <button
              disabled={currentIndex >= totalRecords - 1}
              onClick={() => onUpdateMailMerge({ currentRecordIndex: Math.min(totalRecords - 1, currentIndex + 1) })}
              className={`p-1 rounded border border-[#D1D1D6] ${
                currentIndex >= totalRecords - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-black/5'
              }`}
              title="Next Record"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      <div className="word-group-divider" />

      {/* 4. Finish & Merge */}
      <div className="word-ribbon-group">
        <button
          onClick={onFinishAndMerge}
          disabled={totalRecords === 0}
          className={`ribbon-btn-large ${totalRecords === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
          title="Generate and export merged documents"
        >
          <FileCheck size={24} className="text-[#107C41]" />
          <span>Finish & Merge</span>
        </button>
      </div>
    </div>
  );
};
