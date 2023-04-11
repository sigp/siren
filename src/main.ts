// eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { app, BrowserWindow } = require('electron')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const url = require('url')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const isDev = require('electron-is-dev')

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    icon: './assets/images/sigma.png',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  mainWindow.maximize()

  // and load the index.html of the app.
  const startUrl = isDev
    ? 'http://localhost:3000'
    : url.format({
        pathname: path.join(__dirname, '../build/index.html'),
        protocol: 'file',
        slashes: true,
      })
  mainWindow.loadURL(startUrl)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
