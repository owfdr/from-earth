import { app, ipcMain, shell } from "electron";
import { menubar } from "menubar";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

// open the app at login
if (process.env.NODE_ENV === "production") {
  app.setLoginItemSettings({
    openAtLogin: true,
    openAsHidden: true,
  });
}

const mb = menubar({
  browserWindow: {
    y: process.platform === "darwin" ? 30 : undefined,
    width: process.env.NODE_ENV === "development" ? 1000 : 300,
    height: process.env.NODE_ENV === "development" ? 1000 : 500,
    resizable: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  },
  preloadWindow: true,
  showDockIcon: false,
  icon: "assets/iconTemplate.png",
  index: MAIN_WINDOW_WEBPACK_ENTRY,
});

mb.on("ready", () => {
  if (process.env.NODE_ENV === "development") {
    mb.window.webContents.openDevTools();
  }
});

ipcMain.handle("openUrl", async (_, url) => {
  await shell.openExternal(url);
});
