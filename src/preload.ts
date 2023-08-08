import { contextBridge, ipcRenderer } from "electron";

const electronHandler = {
  openUrl: (url: string) => ipcRenderer.invoke("openUrl", url),
  newView: () =>
    ipcRenderer.invoke("newView") as Promise<{
      earthView: EarthView;
      wiki: string;
      isFavorite: boolean;
    }>,
  setWallpaper: (path: string) => ipcRenderer.invoke("setWallpaper", path),
  showMessageBox: (options: Electron.MessageBoxOptions) =>
    ipcRenderer.invoke("showMessageBox", options),
  getUserSettings: () => ipcRenderer.invoke("getUserSettings"),
  setLaunchAtLogin: (launchAtLogin: boolean) =>
    ipcRenderer.invoke("setLaunchAtLogin", launchAtLogin),
  setTheme: (theme: "light" | "dark") => ipcRenderer.invoke("setTheme", theme),
  getFavorites: () => ipcRenderer.invoke("getFavorites"),
  addFavorite: (earthView: EarthView) =>
    ipcRenderer.invoke("addFavorite", earthView),
  removeFavorite: (id: string) => ipcRenderer.invoke("removeFavorite", id),
  getCurrent: () => ipcRenderer.invoke("getCurrent"),
  setCurrent: (earthView: EarthView) =>
    ipcRenderer.invoke("setCurrent", earthView),
  quitApp: () => ipcRenderer.invoke("quitApp"),
};

contextBridge.exposeInMainWorld("electron", electronHandler);

export type ElectronHandler = typeof electronHandler;

ipcRenderer.on("themeChanged", (_, theme: "light" | "dark") => {
  document.documentElement.classList.toggle("dark", theme === "dark");
  window.dispatchEvent(new Event("themeChanged"));
});
