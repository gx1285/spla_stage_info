import { app, BrowserWindow, dialog, Menu, ipcMain } from "electron";
import isOnline from "is-online";
import path from "node:path";

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 640,
    minHeight: 500,
    maxWidth: 400,
    minWidth: 400,
    maximizable: false,
    title: "Loading - Spla Stage Info",
    webPreferences: {
      preload: path.join(__dirname, "js/preload.js"),
    },
  });
  ipcMain.on("json", (event) => {
    exec("cscript ie.vbs", (err, stdout, stderr) => {
      if (err) {
        //stderr
        return;
      } else {
        const options = {
          type: "info",
          title: "Browser Info",
          message: "Run Info",
          detail: "Internet Explorerを起動しました。",
        };
        dialog.showMessageBox(options);
      }
    });
  });
  const options = {
    type: "info",
    title: "Spla Stage Infoについて",
    message: "Spla Stage Infoについて",
    detail: "Spla Stage Info v0.0.1",
  };
  const template = Menu.buildFromTemplate([
    {
      label: "ファイル",
      submenu: [
        { role: "toggleDevTools", label: "F12" },
        { role: "reload", label: "再読み込み" },
        { role: "close", label: "ウィンドウを閉じる" },
      ],
    },
    {
      label: "ヘルプ",
      submenu: [
        {
          label: "Spla Stage Infoについて",
          click() {
            dialog.showMessageBox(options);
          },
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(template);
  const online = await isOnline({
    timeout: 1000,
  });
  if (!online) {
    dialog.showErrorBox(
      "エラーが発生しました。",
      "データサーバーに接続できませんでした。"
    );
    mainWindow.loadFile("html/network_err.html");
  } else {
    mainWindow.loadFile("html/index.html");
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
