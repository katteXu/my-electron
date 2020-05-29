const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const isPro = process.env.NODE_ENV === "development" ? false : true;


// 更新处理
const updateHandle = () => {
  const log = require('electron-log');
  const uploadUrl = 'http://katte-saas.oss-cn-beijing.aliyuncs.com/download';
  const message = {
    error: '检查更新出错',
    checking: '正在检查是否存在更新……',
    updateAva: '检测到新版本',
    updateNotAva: '当前为最新版本，不需更新',
  };

  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = 'info';

  autoUpdater.autoDownload = false;

  autoUpdater.setFeedURL(uploadUrl);
  autoUpdater.on('error', function (error) {
    console.log('更新出错！', error);
  });
  autoUpdater.on('checking-for-update', function () {
    sendEvent('message', message.checking);
  });

  // 有最新版本
  autoUpdater.on('update-available', function (info) {
    const { version, releaseDate } = info;
    sendEvent('version-has-changed', version);
  });

  // 没有最新版本
  autoUpdater.on('update-not-available', function (info) {
    const { version, releaseDate } = info;
    sendEvent('version-never-change');
  });

  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    mainWindow.webContents.send('downloadProgress', progressObj);
  });

  autoUpdater.on('update-downloaded', function (
    event,
    releaseNotes,
    releaseName,
    releaseDate,
    updateUrl,
    quitAndUpdate
  ) {
    ipcMain.on('installForUpdate', (e, arg) => {
      autoUpdater.quitAndInstall();
    });

    mainWindow.webContents.send('downloaded');
  });

  // 检查更新
  ipcMain.on('checkForUpdate', () => {
    //执行自动更新检查
    autoUpdater.checkForUpdates();
  });

  // 下载更新
  ipcMain.on('downloadForUpdate', () => {
    // 执行更新下载
    autoUpdater.downloadUpdate();
  });
};

// 发送事件
const sendEvent = (event, content) => {
  mainWindow.webContents.send(event, content);
};

// window对象的全局引用
let mainWindow
// 处理更新操作
updateHandle();

function createWindow() {

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: `${__dirname}/preload.js`,
    },
  });

  if (isPro) {
    mainWindow.loadFile(`${__dirname}/index.html`);
  } else {
    mainWindow.loadURL('http://localhost:3000/');
    // 打开开发者工具，默认不打开
    mainWindow.webContents.openDevTools()
  }

  // 关闭window时触发下列事件.
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow);

// 所有窗口关闭时退出应用.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {

  if (mainWindow === null) {
    createWindow()
  }
})