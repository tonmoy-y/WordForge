import { contextBridge, ipcRenderer } from 'electron';

export interface ElectronAPI {
  saveFile: (options: { defaultPath?: string; data: Uint8Array | string }) => Promise<{ success: boolean; filePath?: string }>;
  openFile: (options?: { filters?: { name: string; extensions: string[] }[] }) => Promise<{ success: boolean; data?: Uint8Array; fileName?: string }>;
  printToPdf: (options: any) => Promise<{ success: boolean; data?: Uint8Array }>;
  getPlatform: () => string;
}

const api: ElectronAPI = {
  saveFile: (options) => ipcRenderer.invoke('dialog:saveFile', options),
  openFile: (options) => ipcRenderer.invoke('dialog:openFile', options),
  printToPdf: (options) => ipcRenderer.invoke('action:printToPdf', options),
  getPlatform: () => process.platform,
};

contextBridge.exposeInMainWorld('electronAPI', api);
