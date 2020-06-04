const { app, BrowserWindow } = require('electron')
async function getMemUsage(){
    try{
        let result = await process.getProcessMemoryInfo()
        console.log(result)
    } catch(e){
        throw new Error(e)
    }
}
function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html')
  getMemUsage()
  // Open the DevTools.
  win.webContents.openDevTools()
}

app.whenReady().then(createWindow)