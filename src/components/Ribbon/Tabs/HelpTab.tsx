import React from 'react';
import {
  HelpCircle,
  Keyboard,
  Info,
  Sparkles,
} from 'lucide-react';

interface HelpTabProps {
  onOpenShortcuts: () => void;
  onOpenAbout: () => void;
  onCheckUpdates?: () => void;
}

export const HelpTab: React.FC<HelpTabProps> = ({
  onOpenShortcuts,
  onOpenAbout,
  onCheckUpdates,
}) => {
  return (
    <div className="word-ribbon-panel">
      <div className="word-ribbon-group">
        <button
          onClick={() => {
            alert('WordForge Pro: Microsoft Word for macOS high-fidelity desktop word processor.');
          }}
          className="ribbon-btn-large"
          title="Help Documentation"
        >
          <HelpCircle size={24} className="text-[#0F6CBD]" />
          <span>Word Help</span>
        </button>
        <button
          onClick={onOpenShortcuts}
          className="ribbon-btn-large"
          title="macOS Keyboard Shortcuts"
        >
          <Keyboard size={24} className="text-[#107C41]" />
          <span>Shortcuts</span>
        </button>
        <button
          onClick={onCheckUpdates || (() => (window as any).__openUpdateDialog?.())}
          className="ribbon-btn-large"
          title="Check for Software Updates"
        >
          <Sparkles size={24} className="text-amber-500" />
          <span>Check Updates</span>
        </button>
        <button
          onClick={onOpenAbout}
          className="ribbon-btn-large"
          title="About WordForge Pro for macOS"
        >
          <Info size={24} className="text-[#742774]" />
          <span>About</span>
        </button>
      </div>
    </div>
  );
};
