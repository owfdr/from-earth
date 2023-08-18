import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  Menu,
  Tray,
  app,
  dialog,
  ipcMain,
  nativeTheme,
  shell,
} from "electron";
import ElectronStore from "electron-store";
import fs from "fs";
import { menubar } from "menubar";
import path from "path";
import { setWallpaper } from "wallpaper";

import "./assets/icon.png";
import "./assets/icon@2x.png";
import "./assets/iconDark.ico";
import "./assets/iconDark.png";
import "./assets/iconLight.ico";
import "./assets/iconLight.png";
import "./assets/iconTemplate.png";
import "./assets/iconTemplate@2x.png";
import "./assets/iconTemplate@3x.png";
import earthViews from "./data/earth-views.json";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export type Preferences = {
  launchAtLogin: boolean;
  theme: "light" | "dark";
};

export type StoreType = {
  userSettings: Preferences;
  favorites: (EarthView & { createdAt: string })[];
  current: EarthView;
};

export const store = new ElectronStore<StoreType>({
  defaults: {
    userSettings: {
      launchAtLogin: false,
      theme: "light",
    },
    favorites: [],
    current: earthViews[
      Math.floor(Math.random() * earthViews.length)
    ] as EarthView,
  },
});

store.set(
  "userSettings.theme",
  nativeTheme.shouldUseDarkColors ? "dark" : "light",
);

const defaultConfig: BrowserWindowConstructorOptions = {
  y: process.platform === "darwin" ? 30 : undefined,
  width: process.env.NODE_ENV === "development" ? 1000 : 350,
  height: 600,
  show: false,
  frame: false,
  resizable: false,
  icon: path.join(__dirname, "assets", "icon.png"),
  alwaysOnTop: process.env.NODE_ENV === "development" ? true : false,
  backgroundColor: store.get("userSettings").theme === "dark" ? "#000" : "#fff",
  webPreferences: {
    preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
  },
};

const findBestIcon = () => {
  let filename = "iconDark.png";

  if (process.platform === "darwin") {
    filename = "iconTemplate.png";
  }

  if (process.platform === "win32") {
    filename = "iconDark.ico";
  }

  if (process.platform === "linux") {
    filename = "iconDark.png";
  }

  return path.join(__dirname, "assets", filename);
};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

// Resolve issues found on linux
if (process.platform === "linux") {
  app.disableHardwareAcceleration();

  app.whenReady().then(() => {
    const mainWindow = new BrowserWindow(defaultConfig);
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    const tray = new Tray(findBestIcon());
    tray.setContextMenu(
      Menu.buildFromTemplate([
        {
          label: "Show App",
          click: () => {
            mainWindow.show();
          },
        },
        {
          label: "Hide App",
          click: () => {
            mainWindow.hide();
          },
        },
        {
          label: "Quit",
          click: () => {
            app.quit();
          },
        },
      ]),
    );

    if (process.env.NODE_ENV === "development") {
      mainWindow.webContents.openDevTools();
    }

    mainWindow.webContents.on("did-finish-load", () => {
      mainWindow.webContents.insertCSS(`
        ::-webkit-scrollbar {
          display: none;
        }
      `);
    });

    nativeTheme.on("updated", () => {
      const theme = nativeTheme.shouldUseDarkColors ? "dark" : "light";

      store.set("userSettings.theme", theme);
      mainWindow.webContents.send("themeChanged", theme);
    });

    ipcMain.handle("setTheme", async (_, theme: "light" | "dark") => {
      store.set("userSettings.theme", theme);
      mainWindow.webContents.send("themeChanged", theme);
    });
  });
} else {
  // TODO: refactor to remove menubar
  const mb = menubar({
    browserWindow: defaultConfig,
    tooltip: "Earth View",
    preloadWindow: process.env.NODE_ENV === "development" ? true : false,
    showDockIcon: false,
    icon: findBestIcon(),
    index: MAIN_WINDOW_WEBPACK_ENTRY,
  });

  mb.on("ready", async () => {
    if (process.env.NODE_ENV === "development") {
      mb.window.webContents.openDevTools();
    }

    if (process.platform !== "darwin") {
      mb.window.webContents.on("did-finish-load", () => {
        mb.window.webContents.insertCSS(`
        ::-webkit-scrollbar {
          display: none;
        }
      `);
      });
    }

    mb.app.setLoginItemSettings({
      openAtLogin: store.get("userSettings").launchAtLogin,
      openAsHidden: true,
    });
  });

  // fix for mac not hiding dock icon properly
  mb.on("after-hide", async () => {
    mb.app.dock.hide();
  });

  nativeTheme.on("updated", () => {
    const theme = nativeTheme.shouldUseDarkColors ? "dark" : "light";

    store.set("userSettings.theme", theme);
    mb.window?.webContents?.send("themeChanged", theme);
  });

  ipcMain.handle("setTheme", async (_, theme: "light" | "dark") => {
    store.set("userSettings.theme", theme);
    mb.window?.webContents?.send("themeChanged", theme);
  });
}

// Open url in user's default browser
ipcMain.handle("openUrl", async (_, url) => {
  await shell.openExternal(url);
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

ipcMain.handle("getUserSettings", async () => {
  return store.get("userSettings");
});

ipcMain.handle("setLaunchAtLogin", async (_, launchAtLogin: boolean) => {
  store.set("userSettings.launchAtLogin", launchAtLogin);
  app.setLoginItemSettings({
    openAtLogin: launchAtLogin,
    openAsHidden: true,
  });
});

ipcMain.handle("getFavorites", async () => {
  return store.get("favorites");
});

ipcMain.handle("addFavorite", async (_, earthView: EarthView) => {
  const favorites = store.get("favorites");

  if (!favorites.some((favorite) => favorite.id === earthView.id)) {
    favorites.push({ ...earthView, createdAt: new Date().toISOString() });
    store.set("favorites", favorites);
  }
});

ipcMain.handle("removeFavorite", async (_, id: string) => {
  const favorites = store.get("favorites");

  const newFavorites = favorites.filter((favorite) => favorite.id !== id);
  store.set("favorites", newFavorites);
});

ipcMain.handle("newView", async (_, locale: string) => {
  const random = Math.floor(Math.random() * earthViews.length);
  const earthView = earthViews[random] as EarthView;

  const wiki = await fetchWiki(earthView, locale);

  const isFavorite = store
    .get("favorites")
    .some((favorite) => favorite.id === earthView.id);

  store.set("current", earthView);

  return { earthView, wiki, isFavorite };
});

ipcMain.handle("getCurrent", async (_, locale: string) => {
  const earthView = store.get("current");

  const wiki = await fetchWiki(earthView, locale);

  const isFavorite = store
    .get("favorites")
    .some((favorite) => favorite.id === earthView.id);

  return { earthView, wiki, isFavorite };
});

async function fetchWiki(earthView: EarthView, locale: string) {
  const language = locale.split("-")[0];
  const keyword = earthView.region ? earthView.region : earthView.country;
  const query = `https://${language}.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${encodeURI(
    keyword,
  )}`;

  try {
    const wikiResponse = await fetch(query);
    const wikiJson = await wikiResponse.json();
    const wiki =
      wikiJson.query.pages[Object.keys(wikiJson.query.pages)[0]].extract ||
      null;

    return wiki;
  } catch {
    return null;
  }
}

ipcMain.handle("setCurrent", async (_, earthView: EarthView) => {
  store.set("current", earthView);
});

ipcMain.handle("quitApp", () => {
  setTimeout(() => {
    app.quit();
  }, 200);
});
