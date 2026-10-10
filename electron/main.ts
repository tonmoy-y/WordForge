import { app, BrowserWindow, Menu, MenuItemConstructorOptions, ipcMain, dialog, shell } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { AppUpdater } from './updater';

let mainWindow: BrowserWindow | null = null;
let appUpdater: AppUpdater | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 900,
    minHeight: 600,
    title: 'WordForge Pro',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 14, y: 14 },
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    show: false,
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    if (mainWindow) {
      appUpdater = new AppUpdater(mainWindow);
      // Auto check on launch after brief delay
      setTimeout(() => {
        appUpdater?.checkForUpdates().catch(() => {});
      }, 3000);
    }
  });

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    // In production or built environment
    const indexPath = path.join(__dirname, '../dist/index.html');
    if (fs.existsSync(indexPath)) {
      mainWindow.loadFile(indexPath);
    } else {
      mainWindow.loadURL('http://localhost:5173');
    }
  }

  setupMenu();
}

function setupMenu(): void {
  const isMac = process.platform === 'darwin';

  const template: MenuItemConstructorOptions[] = [
    ...(isMac
      ? [
          {
            label: 'WordForge',
            submenu: [
              { label: 'About WordForge', click: () => mainWindow?.webContents.send('menu:about') },
              {
                label: 'Check for Updates…',
                click: () => {
                  if (appUpdater) appUpdater.checkForUpdates();
                  mainWindow?.webContents.send('menu:checkUpdates');
                },
              },
              { type: 'separator' as const },
              { label: 'Preferences…', accelerator: 'CmdOrCtrl+,', click: () => mainWindow?.webContents.send('menu:preferences') },
              { type: 'separator' as const },
              { role: 'services' as const },
              { type: 'separator' as const },
              { role: 'hide' as const },
              { role: 'hideOthers' as const },
              { role: 'unhide' as const },
              { type: 'separator' as const },
              { role: 'quit' as const, label: 'Quit WordForge' },
            ],
          },
        ]
      : []),
    {
      label: 'File',
      submenu: [
        { label: 'New Document', accelerator: 'CmdOrCtrl+N', click: () => mainWindow?.webContents.send('menu:new') },
        { label: 'Open…', accelerator: 'CmdOrCtrl+O', click: () => mainWindow?.webContents.send('menu:open') },
        { type: 'separator' as const },
        { label: 'Save', accelerator: 'CmdOrCtrl+S', click: () => mainWindow?.webContents.send('menu:save') },
        { label: 'Save As…', accelerator: 'Shift+CmdOrCtrl+S', click: () => mainWindow?.webContents.send('menu:saveAs') },
        { type: 'separator' as const },
        { label: 'Page Setup…', click: () => mainWindow?.webContents.send('menu:pageSetup') },
        { label: 'Print…', accelerator: 'CmdOrCtrl+P', click: () => mainWindow?.webContents.send('menu:print') },
        { type: 'separator' as const },
        { role: 'close' as const },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' as const },
        { role: 'redo' as const },
        { type: 'separator' as const },
        { role: 'cut' as const },
        { role: 'copy' as const },
        { role: 'paste' as const },
        { role: 'selectAll' as const },
        { type: 'separator' as const },
        { label: 'Find…', accelerator: 'CmdOrCtrl+F', click: () => mainWindow?.webContents.send('menu:find') },
        { label: 'Replace…', accelerator: 'Alt+CmdOrCtrl+F', click: () => mainWindow?.webContents.send('menu:replace') },
      ],
    },
    {
      label: 'View',
      submenu: [
        { label: 'Print Layout', click: () => mainWindow?.webContents.send('menu:viewPrint') },
        { label: 'Web Layout', click: () => mainWindow?.webContents.send('menu:viewWeb') },
        { label: 'Read Mode', click: () => mainWindow?.webContents.send('menu:viewRead') },
        { label: 'Focus Mode', click: () => mainWindow?.webContents.send('menu:viewFocus') },
        { type: 'separator' as const },
        { label: 'Ruler', click: () => mainWindow?.webContents.send('menu:toggleRuler') },
        { label: 'Navigation Pane', click: () => mainWindow?.webContents.send('menu:toggleNavPane') },
        { type: 'separator' as const },
        { role: 'resetZoom' as const },
        { role: 'zoomIn' as const },
        { role: 'zoomOut' as const },
        { type: 'separator' as const },
        { role: 'togglefullscreen' as const },
      ],
    },
    {
      label: 'Insert',
      submenu: [
        { label: 'Page Break', accelerator: 'CmdOrCtrl+Enter', click: () => mainWindow?.webContents.send('menu:insertPageBreak') },
        { label: 'Table…', click: () => mainWindow?.webContents.send('menu:insertTable') },
        { label: 'Picture…', click: () => mainWindow?.webContents.send('menu:insertImage') },
        { label: 'Hyperlink…', accelerator: 'CmdOrCtrl+K', click: () => mainWindow?.webContents.send('menu:insertLink') },
        { label: 'Symbol…', click: () => mainWindow?.webContents.send('menu:insertSymbol') },
        { label: 'Equation…', accelerator: 'Alt+CmdOrCtrl+=', click: () => mainWindow?.webContents.send('menu:insertEquation') },
      ],
    },
    {
      label: 'Format',
      submenu: [
        { label: 'Font…', accelerator: 'CmdOrCtrl+D', click: () => mainWindow?.webContents.send('menu:fontDialog') },
        { label: 'Paragraph…', click: () => mainWindow?.webContents.send('menu:paragraphDialog') },
      ],
    },
    {
      label: 'Tools',
      submenu: [
        { label: 'Spelling & Grammar', accelerator: 'F7', click: () => mainWindow?.webContents.send('menu:spellCheck') },
        { label: 'Word Count…', click: () => mainWindow?.webContents.send('menu:wordCount') },
        { type: 'separator' as const },
        { label: 'Track Changes', accelerator: 'Shift+CmdOrCtrl+E', click: () => mainWindow?.webContents.send('menu:trackChanges') },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' as const },
        { role: 'zoom' as const },
        ...(isMac ? [{ type: 'separator' as const }, { role: 'front' as const }] : []),
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'WordForge Help',
          click: () => mainWindow?.webContents.send('menu:shortcuts'),
        },
        {
          label: 'Keyboard Shortcuts',
          accelerator: 'CmdOrCtrl+/',
          click: () => mainWindow?.webContents.send('menu:shortcuts'),
        },
        { type: 'separator' as const },
        {
          label: 'Check for Updates…',
          click: () => {
            if (appUpdater) appUpdater.checkForUpdates();
            mainWindow?.webContents.send('menu:checkUpdates');
          },
        },
        {
          label: 'About WordForge Pro',
          click: () => mainWindow?.webContents.send('menu:about'),
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC Handlers
ipcMain.handle('dialog:saveFile', async (_, { defaultPath, data }) => {
  if (!mainWindow) return { success: false };
  const res = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultPath || 'Untitled.docx',
    filters: [{ name: 'Word Document (.docx)', extensions: ['docx'] }],
  });
  if (res.canceled || !res.filePath) return { success: false };

  fs.writeFileSync(res.filePath, Buffer.from(data));
  return { success: true, filePath: res.filePath };
});

ipcMain.handle('dialog:openFile', async (_, options) => {
  if (!mainWindow) return { success: false };
  const res = await dialog.showOpenDialog(mainWindow, {
    filters: options?.filters || [
      { name: 'Word Documents', extensions: ['docx', 'wordforge', 'txt', 'html'] },
    ],
    properties: ['openFile'],
  });
  if (res.canceled || res.filePaths.length === 0) return { success: false };

  const filePath = res.filePaths[0];
  const data = fs.readFileSync(filePath);
  return { success: true, data, fileName: path.basename(filePath) };
});

ipcMain.handle('action:printToPdf', async (_, options) => {
  if (!mainWindow) return { success: false };
  try {
    const data = await mainWindow.webContents.printToPDF({
      margins: {
        top: options.margins?.top || 1,
        bottom: options.margins?.bottom || 1,
        left: options.margins?.left || 1,
        right: options.margins?.right || 1,
      },
      pageSize: options.pageSize === 'a4' ? 'A4' : 'Letter',
      landscape: options.orientation === 'landscape',
    });
    return { success: true, data };
  } catch (e) {
    return { success: false };
  }
});

ipcMain.handle('shell:openExternal', async (_, url: string) => {
  if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
    await shell.openExternal(url);
    return true;
  }
  return false;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
