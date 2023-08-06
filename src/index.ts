import { app, dialog, ipcMain, shell } from "electron";
import ElectronStore from "electron-store";
import fs from "fs";
import { menubar } from "menubar";
import path from "path";
import { setWallpaper } from "wallpaper";

import earthViews from "./data/earth-views.json";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export type UserSettings = {
  launchAtLogin: boolean;
  theme: "light" | "dark" | "system";
};

export const store = new ElectronStore({
  defaults: {
    userSettings: {
      launchAtLogin: false,
      theme: "system",
    },
  },
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

// open the app at login
const mb = menubar({
  browserWindow: {
    y: process.platform === "darwin" ? 30 : 0,
    // width: 320,
    // height: 570,
    width: process.env.NODE_ENV === "development" ? 1000 : 320,
    height: process.env.NODE_ENV === "development" ? 1000 : 570,
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

if (process.env.NODE_ENV === "production") {
  mb.app.setLoginItemSettings({
    openAtLogin: store.get("userSettings").launchAtLogin,
    openAsHidden: true,
  });
}

mb.on("ready", async () => {
  if (process.env.NODE_ENV === "development") {
    mb.window.webContents.openDevTools();
  }
  // TODO: automatic file cleanup
});

// Open url in user's default browser
ipcMain.handle("openUrl", async (_, url) => {
  await shell.openExternal(url);
});

// Get random earth view
ipcMain.handle("newView", async () => {
  // TODO: logic isolation
  const earthView = earthViews[Math.floor(Math.random() * earthViews.length)];

  const keyword = earthView.region ? earthView.region : earthView.country;
  const query = `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${encodeURI(
    keyword,
  )}`;
  const wikiResponse = await fetch(query);
  const wikiJson = await wikiResponse.json();
  const wiki =
    wikiJson.query.pages[Object.keys(wikiJson.query.pages)[0]].extract || null;

  return { earthView, wiki };
});

ipcMain.handle("setWallpaper", async (_, id) => {
  // TODO: logic isolation
  const earthView = earthViews.find((earthView) => earthView.id === id);

  const response = await fetch(earthView.photoUrl);
  const buffer = await response.arrayBuffer();

  const folder = path.join(app.getPath("userData"), "images");
  const file = `${earthView.id}.jpg`;
  const imagePath = path.join(folder, file);

  fs.mkdirSync(folder, { recursive: true });
  await fs.promises.writeFile(imagePath, Buffer.from(buffer));

  await setWallpaper(imagePath);
});

ipcMain.handle("showMessageBox", (_, options: Electron.MessageBoxOptions) => {
  return dialog.showMessageBox(options);
});

ipcMain.handle("getInfo", async (_, id) => {
  // TODO
});

ipcMain.handle("getUserSettings", async () => {
  return store.get("userSettings") as UserSettings;
});

ipcMain.handle("setLaunchAtLogin", async (_, launchAtLogin: boolean) => {
  store.set("userSettings.launchAtLogin", launchAtLogin);
  app.setLoginItemSettings({
    openAtLogin: launchAtLogin,
    openAsHidden: true,
  });
});

ipcMain.handle("quitApp", () => {
  setTimeout(() => {
    mb.app.quit();
  }, 200);
});
