import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';

const REPO_OWNER = 'tonmoy-y';
const REPO_NAME = 'WordForge';

export interface UpdateInfoPayload {
  version: string;
  tagName: string;
  releaseDate: string;
  releaseNotes: string;
  htmlUrl: string;
  dmgDownloadUrl?: string;
  zipDownloadUrl?: string;
  isNewer: boolean;
}

export interface DownloadProgressPayload {
  percent: number;
  bytesPerSecond: number;
  transferred: number;
  total: number;
}

export class AppUpdater {
  private mainWindow: BrowserWindow | null = null;
  private pendingUpdateInfo: UpdateInfoPayload | null = null;
  private downloadedFilePath: string | null = null;
  private isDownloading: boolean = false;
  private useNativeAutoUpdater: boolean = false;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.setupAutoUpdater();
    this.registerIpcHandlers();
  }

  private setupAutoUpdater(): void {
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = false;

    // Set GitHub repository metadata
    autoUpdater.setFeedURL({
      provider: 'github',
      owner: REPO_OWNER,
      repo: REPO_NAME,
    });

    autoUpdater.on('checking-for-update', () => {
      this.sendToRenderer('updater:checking');
    });

    autoUpdater.on('update-available', (info) => {
      this.useNativeAutoUpdater = true;
      const currentVersion = app.getVersion();
      const payload: UpdateInfoPayload = {
        version: info.version,
        tagName: `v${info.version}`,
        releaseDate: info.releaseDate ? new Date(info.releaseDate).toLocaleDateString() : new Date().toLocaleDateString(),
        releaseNotes: (typeof info.releaseNotes === 'string' ? info.releaseNotes : '') || 'Performance and stability improvements.',
        htmlUrl: `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/tag/v${info.version}`,
        isNewer: this.compareVersions(info.version, currentVersion) > 0,
      };
      this.pendingUpdateInfo = payload;
      this.sendToRenderer('updater:available', payload);
    });

    autoUpdater.on('update-not-available', (info) => {
      this.sendToRenderer('updater:not-available', { version: info.version || app.getVersion() });
    });

    autoUpdater.on('download-progress', (progressObj) => {
      const payload: DownloadProgressPayload = {
        percent: Math.round(progressObj.percent || 0),
        bytesPerSecond: progressObj.bytesPerSecond || 0,
        transferred: progressObj.transferred || 0,
        total: progressObj.total || 0,
      };
      this.sendToRenderer('updater:progress', payload);
    });

    autoUpdater.on('update-downloaded', (info) => {
      this.isDownloading = false;
      this.sendToRenderer('updater:downloaded', { version: info.version });
    });

    autoUpdater.on('error', (err) => {
      console.warn('[AutoUpdater] Native updater error, using fallback pipeline:', err.message);
      // If native autoUpdater fails, fallback to GitHub Releases API
      if (!this.useNativeAutoUpdater) {
        this.checkForUpdatesViaGitHub();
      } else {
        this.isDownloading = false;
        this.sendToRenderer('updater:error', { message: err.message || 'Update failed' });
      }
    });
  }

  private registerIpcHandlers(): void {
    ipcMain.handle('updater:check', async () => {
      return this.checkForUpdates();
    });

    ipcMain.handle('updater:startDownload', async () => {
      return this.startDownload();
    });

    ipcMain.handle('updater:quitAndInstall', async () => {
      return this.quitAndInstall();
    });
  }

  public async checkForUpdates(): Promise<UpdateInfoPayload> {
    this.sendToRenderer('updater:checking');

    // If app is packaged, attempt electron-updater first
    if (app.isPackaged) {
      try {
        const result = await autoUpdater.checkForUpdates();
        if (result && result.updateInfo) {
          const info = result.updateInfo;
          const currentVersion = app.getVersion();
          const isNewer = this.compareVersions(info.version, currentVersion) > 0;
          const payload: UpdateInfoPayload = {
            version: info.version,
            tagName: `v${info.version}`,
            releaseDate: info.releaseDate ? new Date(info.releaseDate).toLocaleDateString() : new Date().toLocaleDateString(),
            releaseNotes: (typeof info.releaseNotes === 'string' ? info.releaseNotes : '') || 'Performance and stability improvements.',
            htmlUrl: `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/tag/v${info.version}`,
            isNewer,
          };
          this.pendingUpdateInfo = payload;
          if (isNewer) {
            this.sendToRenderer('updater:available', payload);
          } else {
            this.sendToRenderer('updater:not-available', { version: currentVersion });
          }
          return payload;
        }
      } catch (err: any) {
        console.warn('[AutoUpdater] Native check failed, falling back to GitHub API:', err.message);
      }
    }

    // Direct GitHub Releases API fallback
    return this.checkForUpdatesViaGitHub();
  }

  private async checkForUpdatesViaGitHub(): Promise<UpdateInfoPayload> {
    try {
      const currentVersion = app.getVersion();
      const releaseData = await this.fetchJson(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`);

      const tagName = releaseData.tag_name || `v${currentVersion}`;
      const cleanVersion = tagName.replace(/^v/, '');
      const isNewer = this.compareVersions(cleanVersion, currentVersion) > 0;

      const dmgAsset = releaseData.assets?.find((a: any) => a.name.endsWith('.dmg'));
      const zipAsset = releaseData.assets?.find((a: any) => a.name.endsWith('.zip'));

      const payload: UpdateInfoPayload = {
        version: cleanVersion,
        tagName,
        releaseDate: new Date(releaseData.published_at || releaseData.created_at).toLocaleDateString(),
        releaseNotes: releaseData.body || 'Quality enhancements, Microsoft Word for Mac high-fidelity visual alignment, and performance updates.',
        htmlUrl: releaseData.html_url,
        dmgDownloadUrl: dmgAsset?.browser_download_url,
        zipDownloadUrl: zipAsset?.browser_download_url,
        isNewer,
      };

      this.pendingUpdateInfo = payload;

      if (isNewer) {
        this.sendToRenderer('updater:available', payload);
      } else {
        this.sendToRenderer('updater:not-available', { version: currentVersion });
      }

      return payload;
    } catch (err: any) {
      console.error('[AutoUpdater] GitHub fallback check failed:', err.message);
      const currentVersion = app.getVersion();
      const fallbackPayload: UpdateInfoPayload = {
        version: currentVersion,
        tagName: `v${currentVersion}`,
        releaseDate: new Date().toLocaleDateString(),
        releaseNotes: `Currently running WordForge v${currentVersion}.`,
        htmlUrl: `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases`,
        isNewer: false,
      };
      this.sendToRenderer('updater:error', { message: err.message || 'Unable to connect to update server' });
      return fallbackPayload;
    }
  }

  public async startDownload(): Promise<boolean> {
    if (this.isDownloading) return true;
    this.isDownloading = true;

    // If electron-updater has a staged native update, use it
    if (this.useNativeAutoUpdater) {
      try {
        await autoUpdater.downloadUpdate();
        return true;
      } catch (err: any) {
        console.warn('[AutoUpdater] Native download failed, falling back to direct stream:', err.message);
        this.useNativeAutoUpdater = false;
      }
    }

    // Direct streaming download fallback
    const targetUrl = this.pendingUpdateInfo?.dmgDownloadUrl || this.pendingUpdateInfo?.zipDownloadUrl;
    if (!targetUrl) {
      this.isDownloading = false;
      this.sendToRenderer('updater:error', { message: 'No valid download asset found for current architecture.' });
      return false;
    }

    try {
      const updatesDir = path.join(app.getPath('userData'), 'updates');
      if (!fs.existsSync(updatesDir)) {
        fs.mkdirSync(updatesDir, { recursive: true });
      }

      const fileName = targetUrl.endsWith('.dmg')
        ? `WordForge-${this.pendingUpdateInfo?.version || 'update'}-arm64.dmg`
        : `WordForge-${this.pendingUpdateInfo?.version || 'update'}-arm64.zip`;
      const destinationPath = path.join(updatesDir, fileName);

      this.downloadedFilePath = destinationPath;

      await this.downloadFileWithProgress(targetUrl, destinationPath);
      this.isDownloading = false;
      this.sendToRenderer('updater:downloaded', { version: this.pendingUpdateInfo?.version || app.getVersion() });
      return true;
    } catch (err: any) {
      this.isDownloading = false;
      console.error('[AutoUpdater] Download failed:', err);
      this.sendToRenderer('updater:error', { message: err.message || 'Download failed. Please check network connection.' });
      return false;
    }
  }

  public async quitAndInstall(): Promise<void> {
    if (this.useNativeAutoUpdater) {
      autoUpdater.quitAndInstall(false, true);
      return;
    }

    // Fallback apply & relaunch mechanism for macOS
    if (this.downloadedFilePath && fs.existsSync(this.downloadedFilePath)) {
      const filePath = this.downloadedFilePath;

      if (filePath.endsWith('.dmg')) {
        // Detach and open the DMG installer for the user to drag to Applications
        spawn('open', [filePath], { detached: true, stdio: 'ignore' });
        setTimeout(() => {
          app.quit();
        }, 1000);
      } else {
        // If zip, unzip and relaunch
        spawn('open', [filePath], { detached: true, stdio: 'ignore' });
        setTimeout(() => {
          app.quit();
        }, 1000);
      }
    } else {
      app.relaunch();
      app.quit();
    }
  }

  private downloadFileWithProgress(url: string, destination: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream(destination);
      let startTime = Date.now();
      let lastTime = startTime;
      let lastBytes = 0;

      const request = (targetUrl: string) => {
        const client = targetUrl.startsWith('https') ? https : http;
        client.get(targetUrl, { headers: { 'User-Agent': 'WordForge-Updater' } }, (response) => {
          // Handle redirects (e.g. GitHub Releases 302 -> AWS S3)
          if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            return request(response.headers.location);
          }

          if (response.statusCode !== 200) {
            reject(new Error(`Download failed with HTTP status ${response.statusCode}`));
            return;
          }

          const totalBytes = parseInt(response.headers['content-length'] || '0', 10);
          let transferredBytes = 0;

          response.on('data', (chunk) => {
            transferredBytes += chunk.length;
            fileStream.write(chunk);

            const now = Date.now();
            const timeDiff = (now - lastTime) / 1000;
            if (timeDiff >= 0.25 || transferredBytes === totalBytes) {
              const bytesDiff = transferredBytes - lastBytes;
              const bytesPerSecond = timeDiff > 0 ? Math.round(bytesDiff / timeDiff) : 0;
              const percent = totalBytes > 0 ? Math.min(100, Math.round((transferredBytes / totalBytes) * 100)) : 0;

              this.sendToRenderer('updater:progress', {
                percent,
                bytesPerSecond,
                transferred: transferredBytes,
                total: totalBytes,
              });

              lastTime = now;
              lastBytes = transferredBytes;
            }
          });

          response.on('end', () => {
            fileStream.end();
            resolve();
          });

          response.on('error', (err) => {
            fileStream.close();
            fs.unlink(destination, () => {});
            reject(err);
          });
        }).on('error', (err) => {
          fileStream.close();
          fs.unlink(destination, () => {});
          reject(err);
        });
      };

      request(url);
    });
  }

  private fetchJson(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;
      client.get(url, { headers: { 'User-Agent': 'WordForge-App', Accept: 'application/vnd.github.v3+json' } }, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return this.fetchJson(res.headers.location).then(resolve).catch(reject);
        }

        if (res.statusCode !== 200) {
          reject(new Error(`GitHub API HTTP ${res.statusCode}: ${res.statusMessage}`));
          return;
        }

        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Invalid JSON response'));
          }
        });
        res.on('error', reject);
      }).on('error', reject);
    });
  }

  private compareVersions(v1: string, v2: string): number {
    const p1 = v1.replace(/^v/, '').split('.').map((n) => parseInt(n, 10) || 0);
    const p2 = v2.replace(/^v/, '').split('.').map((n) => parseInt(n, 10) || 0);
    for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
      const num1 = p1[i] || 0;
      const num2 = p2[i] || 0;
      if (num1 > num2) return 1;
      if (num1 < num2) return -1;
    }
    return 0;
  }

  private sendToRenderer(channel: string, payload?: any): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send(channel, payload);
    }
  }
}
