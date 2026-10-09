import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsDialogProps {
  onClose: () => void;
}

const SHORTCUTS = [
  { action: 'Save Document', keys: '⌘S' },
  { action: 'Save As', keys: '⇧⌘S' },
  { action: 'Open Document', keys: '⌘O' },
  { action: 'New Document', keys: '⌘N' },
  { action: 'Print / Save PDF', keys: '⌘P' },
  { action: 'Undo', keys: '⌘Z' },
  { action: 'Redo', keys: '⌘Y' },
  { action: 'Bold', keys: '⌘B' },
  { action: 'Italic', keys: '⌘I' },
  { action: 'Underline', keys: '⌘U' },
  { action: 'Find', keys: '⌘F' },
  { action: 'Replace', keys: '⌥⌘F' },
  { action: 'Page Break', keys: '⌘↵' },
  { action: 'Select All', keys: '⌘A' },
  { action: 'Spelling & Grammar', keys: 'F7' },
  { action: 'Track Changes Toggle', keys: '⇧⌘E' },
  { action: 'Font Options', keys: '⌘D' },
  { action: 'Align Left', keys: '⌘L' },
  { action: 'Align Center', keys: '⌘E' },
  { action: 'Align Right', keys: '⌘R' },
  { action: 'Align Justify', keys: '⌘J' },
];

export const ShortcutsDialog: React.FC<ShortcutsDialogProps> = ({ onClose }) => {
  return (
    <div className="word-dialog-overlay" onClick={onClose}>
      <div className="word-dialog-box w-[480px]" onClick={(e) => e.stopPropagation()}>
        <div className="word-dialog-header">
          <div className="flex items-center gap-2">
            <Keyboard size={16} className="text-[#185ABD]" />
            <span>macOS Keyboard Shortcuts</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <X size={14} />
          </button>
        </div>

        <div className="word-dialog-content max-h-96 overflow-y-auto text-xs p-3">
          <div className="grid grid-cols-2 gap-2">
            {SHORTCUTS.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded bg-gray-50 border border-gray-100"
              >
                <span className="text-gray-700 font-medium">{s.action}</span>
                <kbd className="px-2 py-0.5 bg-white border border-gray-300 rounded shadow-xs font-mono font-semibold text-gray-800 text-[11px]">
                  {s.keys}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        <div className="word-dialog-footer">
          <button onClick={onClose} className="btn-primary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
