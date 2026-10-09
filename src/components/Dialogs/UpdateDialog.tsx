import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Download, CheckCircle2, AlertCircle, ExternalLink, Sparkles } from 'lucide-react';
import { UpdateService, CURRENT_VERSION, ReleaseInfo } from '../../core/updater/updateService';

interface UpdateDialogProps {
  onClose: () => void;
}

export const UpdateDialog: React.FC<UpdateDialogProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const [release, setRelease] = useState<ReleaseInfo | null>(null);
  const [downloading, setDownloading] = useState(false);

  const fetchUpdate = async () => {
    setLoading(true);
    const info = await UpdateService.checkForUpdates();
    setRelease(info);
    setLoading(false);
  };

  useEffect(() => {
    fetchUpdate();
  }, []);

  const handleDownload = () => {
    if (!release) return;
    const downloadUrl =
      release.dmgDownloadUrl ||
      release.zipDownloadUrl ||
      release.htmlUrl;

    setDownloading(true);
    UpdateService.downloadUpdate(downloadUrl, `WordForge-${release.version}-arm64.dmg`);
    setTimeout(() => {
      setDownloading(false);
    }, 2000);
  };

  return (
    <div className="word-dialog-overlay" onClick={onClose}>
      <div className="word-dialog-box w-[500px]" onClick={(e) => e.stopPropagation()}>
        <div className="word-dialog-header">
          <div className="flex items-center gap-2">
            <RefreshCw size={16} className="text-[#185ABD]" />
            <span>WordForge Software Update</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <X size={14} />
          </button>
        </div>

        <div className="word-dialog-content flex flex-col gap-4 text-xs">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-gray-500">
              <RefreshCw size={32} className="animate-spin text-[#185ABD]" />
              <span className="font-medium text-sm">Checking for updates on GitHub…</span>
            </div>
          ) : release ? (
            <>
              {/* Header Banner */}
              <div
                className={`p-4 rounded-lg border flex items-start gap-3 ${
                  release.isNewer
                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}
              >
                {release.isNewer ? (
                  <Sparkles size={24} className="text-blue-600 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 size={24} className="text-emerald-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-sm">
                    {release.isNewer
                      ? `New Version Available: ${release.tagName}`
                      : 'WordForge is up to date!'}
                  </div>
                  <div className="text-[11px] opacity-80 mt-0.5">
                    Current Version: <strong>v{CURRENT_VERSION}</strong> | Latest Release:{' '}
                    <strong>{release.tagName}</strong> ({release.releaseDate})
                  </div>
                </div>
              </div>

              {/* Release Notes */}
              <div>
                <div className="font-semibold text-gray-700 mb-1.5 flex justify-between items-center">
                  <span>Release Notes:</span>
                  <a
                    href={release.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>View on GitHub</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
                <div className="border border-gray-200 rounded p-3 bg-gray-50 max-h-40 overflow-y-auto font-mono text-[11px] whitespace-pre-line text-gray-800">
                  {release.releaseNotes}
                </div>
              </div>

              {/* Download notification */}
              {downloading && (
                <div className="p-2.5 bg-blue-100 border border-blue-300 rounded text-blue-800 text-xs font-medium flex items-center gap-2">
                  <Download size={14} className="animate-bounce" />
                  <span>Downloading latest installer package… check your downloads folder.</span>
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <AlertCircle size={28} className="text-amber-500 mx-auto mb-2" />
              <div>Unable to fetch release information. Please check your internet connection.</div>
            </div>
          )}
        </div>

        <div className="word-dialog-footer">
          <button onClick={fetchUpdate} disabled={loading} className="btn-secondary flex items-center gap-1.5">
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            <span>Check Again</span>
          </button>
          {release?.isNewer || release?.dmgDownloadUrl ? (
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="btn-primary flex items-center gap-1.5"
            >
              <Download size={14} />
              <span>Download & Install Update</span>
            </button>
          ) : (
            <button onClick={onClose} className="btn-primary">
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
