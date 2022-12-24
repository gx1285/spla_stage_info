import { app, BrowserWindow, dialog, Menu } from "electron";
import isOnline from "is-online";
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

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 640,
    maximizable: false,
    title: "Loading - Spla Stage Info",
  });

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
