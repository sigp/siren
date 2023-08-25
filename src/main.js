const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev')

const createWindow = () => {
  function UpsertKeyValue(obj, keyToChange, value) {
    const keyToChangeLower = keyToChange.toLowerCase()
    for (const key of Object.keys(obj)) {
      if (key.toLowerCase() === keyToChangeLower) {
        // Reassign old key
        obj[key] = value
        // Done
        return
      }
    }
    // Insert at end instead
    obj[keyToChange] = value
  }

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    icon: './assets/images/sigma.png',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // webSecurity: false
    },
  })

  mainWindow.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
    const { requestHeaders } = details
    UpsertKeyValue(requestHeaders, 'Access-Control-Allow-Origin', ['*'])
    callback({ requestHeaders })
  })

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const { responseHeaders } = details
    UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Origin', ['*'])
    UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Headers', ['*'])
    callback({
      responseHeaders,
    })
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
