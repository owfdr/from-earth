import { app, dialog, ipcMain, shell } from "electron";
import { menubar } from "menubar";
import fs from "fs";
import path from "path";
import earthViews from "./data/earth-views.json";
import { setWallpaper } from "wallpaper";

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
    width: 320,
    height: 570,
    // width: process.env.NODE_ENV === "development" ? 1000 : 300,
    // height: process.env.NODE_ENV === "development" ? 1000 : 500,
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

mb.on("ready", async () => {
  // if (process.env.NODE_ENV === "development") {
  //   mb.window.webContents.openDevTools();
  // }
  // TODO: automatic file cleanup
});

// Open url in user's default browser
ipcMain.handle("openUrl", async (_, url) => {
  await shell.openExternal(url);
});

// Get random earth view
ipcMain.handle("newView", async () => {
  // TODO: check internet connection
  // TODO: logic isolation
  const earthView = earthViews[Math.floor(Math.random() * earthViews.length)];

  const keyword = earthView.region ? earthView.region : earthView.country;
  const query = `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${encodeURI(
    keyword
  )}`;
  const wikiResponse = await fetch(query);
  const wikiJson = await wikiResponse.json();
  const wiki =
    wikiJson.query.pages[Object.keys(wikiJson.query.pages)[0]].extract || null;

  return { earthView, wiki };
});

ipcMain.handle("setWallpaper", async (_, id) => {
  // TODO: check internet connection
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
