
const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const shell = require('electron').shell

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');


let mainWindow;



function createWindow() {
  mainWindow = new BrowserWindow({width: 1500, height: 1500});
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);
  mainWindow.webContents.openDevTools()

  var menu = Menu.buildFromTemplate([
    {
        label: 'Menu',
        submenu: [
            {
              label: 'home',
              click() {
                  console.log('home')
                  mainWindow.send("menuClick", "/Home")
              }
            },
            {
              label: 'test',
              click() {
                  console.log('test')
                  mainWindow.send("menuClick", "/Test")
              }
            },
            {
              label: 'Settings',
              click() {
                  console.log('Settings')
                  mainWindow.send("menuClick", "/Settings")
              }
            },
            {
              label: 'exit',
              click() {
                  app.quit()
              }
            },
        ],
    },
    {
        label: 'View',
        submenu: [
            {role: 'reload'},
            {role: 'forcereload'},
            {role: 'toggledevtools'},
            {type: 'separator'},
            {role: 'resetzoom'},
            {role: 'zoomin'},
            {role: 'zoomout'},
            {type: 'separator'},
            {role: 'togglefullscreen'}
          ]
    }
  ])
  Menu.setApplicationMenu(menu);
 }

ipcMain.on('CATCH_ON_MAIN', (event, arg) => {
  console.log('here')
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
