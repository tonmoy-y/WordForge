import { contextBridge, ipcRenderer } from 'electron';

export interface ElectronUpdaterAPI {
  checkForUpdates: () => Promise<any>;
  startDownload: () => Promise<boolean>;
  quitAndInstall: () => Promise<void>;
  onChecking: (callback: () => void) => () => void;
  onAvailable: (callback: (info: any) => void) => () => void;
  onNotAvailable: (callback: (info: any) => void) => () => void;
  onProgress: (callback: (progress: any) => void) => () => void;
  onDownloaded: (callback: (info: any) => void) => () => void;
  onError: (callback: (err: any) => void) => () => void;
}

export interface ElectronAPI {
  saveFile: (options: { defaultPath?: string; data: Uint8Array | string }) => Promise<{ success: boolean; filePath?: string }>;
  openFile: (options?: { filters?: { name: string; extensions: string[] }[] }) => Promise<{ success: boolean; data?: Uint8Array; fileName?: string }>;
  printToPdf: (options: any) => Promise<{ success: boolean; data?: Uint8Array }>;
  getPlatform: () => string;
  onMenuAction: (callback: (action: string) => void) => void;
  openExternal: (url: string) => Promise<boolean>;
  updater: ElectronUpdaterAPI;
}

const api: ElectronAPI = {
  saveFile: (options) => ipcRenderer.invoke('dialog:saveFile', options),
  openFile: (options) => ipcRenderer.invoke('dialog:openFile', options),
  printToPdf: (options) => ipcRenderer.invoke('action:printToPdf', options),
  getPlatform: () => process.platform,
  openExternal: (url: string) => ipcRenderer.invoke('shell:openExternal', url),
  updater: {
    checkForUpdates: () => ipcRenderer.invoke('updater:check'),
    startDownload: () => ipcRenderer.invoke('updater:startDownload'),
    quitAndInstall: () => ipcRenderer.invoke('updater:quitAndInstall'),
    onChecking: (cb: () => void) => {
      const handler = () => cb();
      ipcRenderer.on('updater:checking', handler);
      return () => {
        ipcRenderer.removeListener('updater:checking', handler);
      };
    },
    onAvailable: (cb: (info: any) => void) => {
      const handler = (_: any, info: any) => cb(info);
      ipcRenderer.on('updater:available', handler);
      return () => {
        ipcRenderer.removeListener('updater:available', handler);
      };
    },
    onNotAvailable: (cb: (info: any) => void) => {
      const handler = (_: any, info: any) => cb(info);
      ipcRenderer.on('updater:not-available', handler);
      return () => {
        ipcRenderer.removeListener('updater:not-available', handler);
      };
    },
    onProgress: (cb: (progress: any) => void) => {
      const handler = (_: any, progress: any) => cb(progress);
      ipcRenderer.on('updater:progress', handler);
      return () => {
        ipcRenderer.removeListener('updater:progress', handler);
      };
    },
    onDownloaded: (cb: (info: any) => void) => {
      const handler = (_: any, info: any) => cb(info);
      ipcRenderer.on('updater:downloaded', handler);
      return () => {
        ipcRenderer.removeListener('updater:downloaded', handler);
      };
    },
    onError: (cb: (err: any) => void) => {
      const handler = (_: any, err: any) => cb(err);
      ipcRenderer.on('updater:error', handler);
      return () => {
        ipcRenderer.removeListener('updater:error', handler);
      };
    },
  },
  onMenuAction: (callback: (action: string) => void) => {
    const channels = [
      'menu:new',
      'menu:open',
      'menu:save',
      'menu:saveAs',
      'menu:pageSetup',
      'menu:print',
      'menu:find',
      'menu:replace',
      'menu:viewPrint',
      'menu:viewWeb',
      'menu:viewRead',
      'menu:viewFocus',
      'menu:toggleRuler',
      'menu:toggleNavPane',
      'menu:insertPageBreak',
      'menu:insertTable',
      'menu:insertImage',
      'menu:insertLink',
      'menu:insertSymbol',
      'menu:insertEquation',
      'menu:fontDialog',
      'menu:paragraphDialog',
      'menu:spellCheck',
      'menu:wordCount',
      'menu:trackChanges',
      'menu:shortcuts',
      'menu:checkUpdates',
      'menu:about',
      'menu:preferences',
    ];
    channels.forEach((channel) => {
      ipcRenderer.on(channel, () => callback(channel));
    });
  },
};

contextBridge.exposeInMainWorld('electronAPI', api);
