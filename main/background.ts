import path from 'path'
import { app } from 'electron'
import serve from 'electron-serve'
import './appLogic/main';
import { createWindow } from './helpers/create-window';
import { isProd } from './env';

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

; (async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (isProd) {
    await mainWindow.loadURL('app://./main')
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/main`);
    // mainWindow.webContents.openDevTools();
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})
