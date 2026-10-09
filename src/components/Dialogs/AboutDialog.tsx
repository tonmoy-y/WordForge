import React from 'react';
import { X, ShieldCheck, Cpu, Layers } from 'lucide-react';

interface AboutDialogProps {
  onClose: () => void;
}

export const AboutDialog: React.FC<AboutDialogProps> = ({ onClose }) => {
  return (
    <div className="word-dialog-overlay" onClick={onClose}>
      <div className="word-dialog-box w-[440px]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-[#185ABD] text-white p-6 flex flex-col items-center justify-center relative text-center">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded text-white"
          >
            <X size={16} />
          </button>
          <div className="w-14 h-14 bg-white text-[#185ABD] rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg mb-2">
            W
          </div>
          <div className="text-xl font-bold">WordForge Pro</div>
          <div className="text-xs text-white/80 font-medium">Desktop Word Processor for macOS</div>
          <div className="text-[11px] text-white/60 mt-1">Version 1.0.0 (Production Release)</div>
        </div>

        <div className="word-dialog-content flex flex-col gap-3 text-xs text-gray-700 p-5">
          <div className="flex items-start gap-2.5 p-2.5 rounded bg-gray-50 border border-gray-100">
            <Layers size={18} className="text-[#185ABD] shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-gray-900">Document Engine & Pagination</div>
              <div className="text-[11px] text-gray-500">
                Continuous multi-page rendering engine with automatic pagination, headers, footers,
                page numbering, and section controls.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded bg-gray-50 border border-gray-100">
            <ShieldCheck size={18} className="text-[#107C41] shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-gray-900">OpenXML & Offline Privacy</div>
              <div className="text-[11px] text-gray-500">
                Complies with ISO/IEC 29500 (DOCX) specifications. 100% offline-first architecture
                with zero external telemetry or cloud dependencies.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded bg-gray-50 border border-gray-100">
            <Cpu size={18} className="text-[#742774] shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-gray-900">macOS Architecture</div>
              <div className="text-[11px] text-gray-500">
                Optimized for Apple Silicon (arm64) and Intel (x86_64) platforms with native menu
                integration and keyboard ergonomics.
              </div>
            </div>
          </div>
        </div>

        <div className="word-dialog-footer bg-gray-50 flex justify-between items-center text-[11px] text-gray-400">
          <span>&copy; {new Date().getFullYear()} WordForge Contributors</span>
          <button onClick={onClose} className="btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
