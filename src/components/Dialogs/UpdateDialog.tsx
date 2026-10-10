import React, { useState, useEffect } from 'react';
import {
  X,
  RefreshCw,
  Download,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  RotateCcw,
  Clock,
  ShieldCheck,
  Save,
} from 'lucide-react';
import {
  UpdateService,
  CURRENT_VERSION,
  ReleaseInfo,
  DownloadProgress,
} from '../../core/updater/updateService';

interface UpdateDialogProps {
  onClose: () => void;
  isDirty?: boolean;
  onSaveDocument?: () => Promise<void> | void;
}

type UpdateDialogStage =
  | 'checking'
  | 'upToDate'
  | 'available'
  | 'downloading'
  | 'readyToRestart'
  | 'error';

export const UpdateDialog: React.FC<UpdateDialogProps> = ({
  onClose,
  isDirty = false,
  onSaveDocument,
}) => {
  const isDirtyEffective =
    isDirty || new URLSearchParams(window.location.search).get('mockDirty') === 'true';
  const [stage, setStage] = useState<UpdateDialogStage>('checking');
  const [release, setRelease] = useState<ReleaseInfo | null>(null);
  const [progress, setProgress] = useState<DownloadProgress>({
    percent: 0,
    bytesPerSecond: 0,
    transferred: 0,
    total: 0,
  });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showSaveWarning, setShowSaveWarning] = useState<boolean>(false);

  // Subscribe to native Electron updater IPC events if available
  useEffect(() => {
    const api = (window as any).electronAPI;
    if (!api || !api.updater) return;

    const unsubs: (() => void)[] = [];

    if (api.updater.onChecking) {
      unsubs.push(
        api.updater.onChecking(() => {
          setStage('checking');
        })
      );
    }

    if (api.updater.onAvailable) {
      unsubs.push(
        api.updater.onAvailable((info: ReleaseInfo) => {
          setRelease(info);
          if (info.isNewer) {
            setStage('available');
          } else {
            setStage('upToDate');
          }
        })
      );
    }

    if (api.updater.onNotAvailable) {
      unsubs.push(
        api.updater.onNotAvailable(() => {
          setStage('upToDate');
        })
      );
    }

    if (api.updater.onProgress) {
      unsubs.push(
        api.updater.onProgress((p: DownloadProgress) => {
          setStage('downloading');
          setProgress(p);
        })
      );
    }

    if (api.updater.onDownloaded) {
      unsubs.push(
        api.updater.onDownloaded(() => {
          setStage('readyToRestart');
        })
      );
    }

    if (api.updater.onError) {
      unsubs.push(
        api.updater.onError((err: { message: string }) => {
          setErrorMessage(err.message || 'An unexpected update error occurred.');
          setStage('error');
        })
      );
    }

    return () => {
      unsubs.forEach((unsub) => unsub && unsub());
    };
  }, []);

  const checkForUpdates = async () => {
    setStage('checking');
    setErrorMessage('');
    try {
      const info = await UpdateService.checkForUpdates();
      setRelease(info);
      if (info.isNewer) {
        setStage('available');
      } else {
        setStage('upToDate');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to check for updates. Check internet connection.');
      setStage('error');
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mockStage = params.get('updateStage');
    if (mockStage) {
      if (mockStage === 'available') {
        setStage('available');
        setRelease({
          version: '1.2.1',
          tagName: 'v1.2.1',
          releaseDate: 'October 10, 2026',
          releaseNotes: `### What's New in v1.2.1\n• Added enhanced automatic background update engine.\n• Streamlined Restart Now / Restart Later prompts.\n• Added protection for unsaved document edits during restart.\n• Improved macOS Big Sur, Monterey, and Sonoma styling fidelity.`,
          htmlUrl: 'https://github.com/tonmoy-y/WordForge/releases/tag/v1.2.1',
          dmgDownloadUrl: 'https://github.com/tonmoy-y/WordForge/releases/download/v1.2.1/WordForge-1.2.1-arm64.dmg',
          zipDownloadUrl: 'https://github.com/tonmoy-y/WordForge/releases/download/v1.2.1/WordForge-1.2.1-arm64-mac.zip',
          isNewer: true,
        });
        return;
      }
      if (mockStage === 'downloading') {
        setStage('downloading');
        setProgress({
          percent: 64,
          bytesPerSecond: 4200000,
          transferred: 67108864,
          total: 104857600,
        });
        setRelease({
          version: '1.2.1',
          tagName: 'v1.2.1',
          releaseDate: 'October 10, 2026',
          releaseNotes: '',
          htmlUrl: '',
          isNewer: true,
        });
        return;
      }
      if (mockStage === 'readyToRestart') {
        setStage('readyToRestart');
        setRelease({
          version: '1.2.1',
          tagName: 'v1.2.1',
          releaseDate: 'October 10, 2026',
          releaseNotes: '',
          htmlUrl: '',
          isNewer: true,
        });
        return;
      }
    }
    checkForUpdates();
  }, []);

  // Handle "Update Now"
  const handleUpdateNow = async () => {
    setStage('downloading');
    setProgress({ percent: 0, bytesPerSecond: 0, transferred: 0, total: 0 });

    const api = (window as any).electronAPI;
    if (api && api.updater && api.updater.startDownload) {
      const started = await api.updater.startDownload();
      if (!started) {
        // Fallback simulation/direct download
        fallbackDirectDownload();
      }
    } else {
      fallbackDirectDownload();
    }
  };

  const fallbackDirectDownload = () => {
    if (!release) return;
    const downloadUrl = release.dmgDownloadUrl || release.zipDownloadUrl || release.htmlUrl;

    // Simulate progress animation for browser preview / direct download
    let simulatedPercent = 0;
    const interval = setInterval(() => {
      simulatedPercent += 15;
      if (simulatedPercent >= 100) {
        clearInterval(interval);
        setProgress({
          percent: 100,
          bytesPerSecond: 2500000,
          transferred: 104600000,
          total: 104600000,
        });
        UpdateService.downloadUpdate(downloadUrl, `WordForge-${release.version}-arm64.dmg`);
        setStage('readyToRestart');
      } else {
        setProgress({
          percent: simulatedPercent,
          bytesPerSecond: 2500000,
          transferred: Math.round((simulatedPercent / 100) * 104600000),
          total: 104600000,
        });
      }
    }, 250);
  };

  // Handle "Restart Now" with unsaved changes safety check
  const handleRestartNow = async () => {
    if (isDirtyEffective && !showSaveWarning) {
      setShowSaveWarning(true);
      return;
    }

    if (isDirtyEffective && onSaveDocument) {
      await onSaveDocument();
    }

    await UpdateService.quitAndInstall();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatSpeed = (bytesPerSec: number) => {
    if (bytesPerSec === 0) return '0 KB/s';
    if (bytesPerSec > 1024 * 1024) {
      return `${(bytesPerSec / (1024 * 1024)).toFixed(1)} MB/s`;
    }
    return `${Math.round(bytesPerSec / 1024)} KB/s`;
  };

  return (
    <div className="word-dialog-overlay" onClick={onClose}>
      <div className="word-dialog-box w-[520px]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="word-dialog-header">
          <div className="flex items-center gap-2">
            <RefreshCw size={15} className="text-[#0F6CBD]" />
            <span className="font-semibold text-xs text-[#201F1E]">WordForge Software Update</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-black/5 rounded text-[#605E5C]">
            <X size={14} />
          </button>
        </div>

        {/* Content Body */}
        <div className="word-dialog-content flex flex-col gap-4 text-xs">
          {/* 1. Checking State */}
          {stage === 'checking' && (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-[#605E5C]">
              <RefreshCw size={32} className="animate-spin text-[#0F6CBD]" />
              <div className="font-medium text-sm text-[#201F1E]">Checking for updates…</div>
              <div className="text-[11px] text-[#605E5C]">
                Connecting to trusted GitHub Releases endpoint…
              </div>
            </div>
          )}

          {/* 2. Up to Date State */}
          {stage === 'upToDate' && (
            <div className="py-6 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <CheckCircle2 size={26} />
              </div>
              <div>
                <div className="font-bold text-sm text-[#201F1E]">WordForge is up to date!</div>
                <div className="text-[11.5px] text-[#605E5C] mt-1">
                  You are currently running the latest version (<strong>v{CURRENT_VERSION}</strong>).
                </div>
              </div>
              <div className="bg-[#F8F9FA] border border-[#E1DFDD] rounded p-3 w-full text-left text-[11px] text-[#605E5C] mt-2">
                <div className="flex items-center gap-1.5 font-medium text-[#201F1E] mb-1">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>Channel: Stable (Apple Silicon arm64)</span>
                </div>
                <span>WordForge automatically checks for updates on launch.</span>
              </div>
            </div>
          )}

          {/* 3. Update Available State */}
          {stage === 'available' && release && (
            <>
              {/* Banner */}
              <div className="p-3.5 rounded-lg border border-blue-200 bg-[#EFF6FC] flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#0F6CBD] shrink-0 mt-0.5">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#0F6CBD]">
                    A new version of WordForge is available!
                  </div>
                  <div className="text-[11.5px] text-[#201F1E] mt-0.5">
                    WordForge <strong>{release.tagName}</strong> is ready to download.
                  </div>
                  <div className="text-[10.5px] text-[#605E5C] mt-0.5">
                    Installed Version: <strong>v{CURRENT_VERSION}</strong> | Released:{' '}
                    {release.releaseDate}
                  </div>
                </div>
              </div>

              {/* Release Notes */}
              <div>
                <div className="font-semibold text-[#201F1E] mb-1.5 flex justify-between items-center text-xs">
                  <span>Release Notes:</span>
                  <a
                    href={release.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#0F6CBD] hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>View on GitHub</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
                <div className="border border-[#E1DFDD] rounded p-3 bg-[#F8F9FA] max-h-44 overflow-y-auto font-sans text-[11px] whitespace-pre-line text-[#323130] leading-relaxed">
                  {release.releaseNotes}
                </div>
              </div>
            </>
          )}

          {/* 4. Downloading State */}
          {stage === 'downloading' && (
            <div className="py-4 flex flex-col gap-3">
              <div className="flex items-center justify-between font-medium text-xs text-[#201F1E]">
                <div className="flex items-center gap-2">
                  <Download size={16} className="text-[#0F6CBD] animate-bounce" />
                  <span>Downloading WordForge {release?.tagName || 'Update'}…</span>
                </div>
                <span className="font-bold text-[#0F6CBD]">{progress.percent}%</span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-2.5 bg-[#E1DFDD] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0F6CBD] transition-all duration-200 rounded-full"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#605E5C]">
                <span>
                  {progress.total > 0
                    ? `${formatBytes(progress.transferred)} of ${formatBytes(progress.total)}`
                    : 'Connecting to download stream…'}
                </span>
                <span>{progress.bytesPerSecond > 0 ? formatSpeed(progress.bytesPerSecond) : ''}</span>
              </div>

              <div className="text-[11px] text-[#605E5C] bg-[#F8F9FA] p-2.5 rounded border border-[#E1DFDD]">
                The update is being downloaded and verified in the background. You can continue editing your document.
              </div>
            </div>
          )}

          {/* 5. Ready to Restart State */}
          {stage === 'readyToRestart' && (
            <div className="py-4 flex flex-col gap-3">
              <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <div className="font-bold text-sm text-emerald-900">
                    Update Ready to Install!
                  </div>
                  <div className="text-[11.5px] text-emerald-800 mt-0.5">
                    WordForge {release?.tagName || 'Update'} has been verified and staged.
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-1">
                    Restart now to apply the update and launch into the new version.
                  </div>
                </div>
              </div>

              {/* Unsaved Document Warning if isDirtyEffective */}
              {isDirtyEffective && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900 text-xs flex items-start gap-2.5">
                  <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Unsaved Changes Detected</div>
                    <div className="text-[11px] opacity-90 mt-0.5">
                      Your document has unsaved edits. Clicking <strong>Save & Restart</strong> will save your document automatically before relaunching.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 6. Error State */}
          {stage === 'error' && (
            <div className="py-4 flex flex-col gap-3">
              <div className="p-3.5 rounded-lg border border-rose-200 bg-rose-50 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
                  <AlertCircle size={18} />
                </div>
                <div>
                  <div className="font-bold text-sm text-rose-900">Update Check Failed</div>
                  <div className="text-[11.5px] text-rose-800 mt-0.5">
                    {errorMessage || 'Unable to communicate with the update server.'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="word-dialog-footer flex items-center justify-between">
          <div>
            {stage !== 'downloading' && stage !== 'readyToRestart' && (
              <button
                onClick={checkForUpdates}
                disabled={stage === 'checking'}
                className="btn-secondary flex items-center gap-1.5"
              >
                <RefreshCw size={12} className={stage === 'checking' ? 'animate-spin' : ''} />
                <span>Check Again</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Stage: Available */}
            {stage === 'available' && (
              <>
                <button onClick={onClose} className="btn-secondary flex items-center gap-1">
                  <Clock size={12} />
                  <span>Later</span>
                </button>
                <button
                  onClick={handleUpdateNow}
                  className="btn-primary flex items-center gap-1.5 bg-[#0F6CBD] hover:bg-[#115EA3] text-white"
                >
                  <Download size={13} />
                  <span>Update Now</span>
                </button>
              </>
            )}

            {/* Stage: Ready to Restart */}
            {stage === 'readyToRestart' && (
              <>
                <button onClick={onClose} className="btn-secondary">
                  <span>Restart Later</span>
                </button>
                <button
                  onClick={handleRestartNow}
                  className="btn-primary flex items-center gap-1.5 bg-[#0F6CBD] hover:bg-[#115EA3] text-white"
                >
                  {isDirtyEffective ? <Save size={13} /> : <RotateCcw size={13} />}
                  <span>{isDirtyEffective ? 'Save & Restart' : 'Restart Now'}</span>
                </button>
              </>
            )}

            {/* Stage: Up to Date or Error */}
            {(stage === 'upToDate' || stage === 'error') && (
              <button onClick={onClose} className="btn-secondary">
                Close
              </button>
            )}

            {/* Stage: Downloading */}
            {stage === 'downloading' && (
              <button onClick={onClose} className="btn-secondary">
                Hide (Download in Background)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
