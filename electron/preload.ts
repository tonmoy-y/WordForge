import { contextBridge, ipcRenderer } from 'electron';

export interface ElectronAPI {
  saveFile: (options: { defaultPath?: string; data: Uint8Array | string }) => Promise<{ success: boolean; filePath?: string }>;
  openFile: (options?: { filters?: { name: string; extensions: string[] }[] }) => Promise<{ success: boolean; data?: Uint8Array; fileName?: string }>;
  printToPdf: (options: any) => Promise<{ success: boolean; data?: Uint8Array }>;
  getPlatform: () => string;
  onMenuAction: (callback: (action: string) => void) => void;
  openExternal: (url: string) => Promise<boolean>;
}

const api: ElectronAPI = {
  saveFile: (options) => ipcRenderer.invoke('dialog:saveFile', options),
  openFile: (options) => ipcRenderer.invoke('dialog:openFile', options),
  printToPdf: (options) => ipcRenderer.invoke('action:printToPdf', options),
  getPlatform: () => process.platform,
  openExternal: (url: string) => ipcRenderer.invoke('shell:openExternal', url),
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
