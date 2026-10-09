import { app, BrowserWindow, Menu, MenuItemConstructorOptions, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let mainWindow: BrowserWindow | null = null;

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
              { role: 'about' as const, label: 'About WordForge Pro' },
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
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' as const },
        { role: 'forceReload' as const },
        { role: 'toggleDevTools' as const },
        { type: 'separator' as const },
        { role: 'resetZoom' as const },
        { role: 'zoomIn' as const },
        { role: 'zoomOut' as const },
        { type: 'separator' as const },
        { role: 'togglefullscreen' as const },
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
          label: 'DocCraft Documentation',
          click: () => {
            dialog.showMessageBox({
              type: 'info',
              title: 'DocCraft Help',
              message: 'DocCraft Pro Desktop Word Processor\nOffline documentation is bundled with the application.',
            });
          },
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
      { name: 'Word Documents', extensions: ['docx', 'doccraft', 'txt', 'html'] },
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
