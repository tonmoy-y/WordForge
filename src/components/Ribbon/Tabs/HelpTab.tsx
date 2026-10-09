import React from 'react';
import {
  HelpCircle,
  Keyboard,
  Info,
  RefreshCw,
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
        <div className="word-group-content">
          <button
            onClick={() => {
              alert('WordForge Pro Help: Offline documentation and guides available in the help menu.');
            }}
            className="ribbon-btn-large"
            title="Help Documentation"
          >
            <HelpCircle size={22} className="text-[#185ABD]" />
            <span>WordForge Help</span>
          </button>
          <button
            onClick={onOpenShortcuts}
            className="ribbon-btn-large"
            title="macOS Keyboard Shortcuts"
          >
            <Keyboard size={22} className="text-[#107C41]" />
            <span>Shortcuts</span>
          </button>
          <button
            onClick={onCheckUpdates || (() => (window as any).__openUpdateDialog?.())}
            className="ribbon-btn-large"
            title="Check for Software Updates"
          >
            <RefreshCw size={22} className="text-[#0284C7]" />
            <span>Updates</span>
          </button>
          <button
            onClick={onOpenAbout}
            className="ribbon-btn-large"
            title="About WordForge Pro for macOS"
          >
            <Info size={22} className="text-[#742774]" />
            <span>About</span>
          </button>
        </div>
        <div className="word-group-label">Help & Updates</div>
      </div>
    </div>
  );
};
