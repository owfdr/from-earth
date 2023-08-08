import { contextBridge, ipcRenderer } from "electron";

type EarthPack = {
  earthView: EarthView;
  wiki: string;
};

const electronHandler = {
  openUrl: (url: string) => ipcRenderer.invoke("openUrl", url),
  newView: () => ipcRenderer.invoke("newView") as Promise<EarthPack>,
  setWallpaper: (path: string) => ipcRenderer.invoke("setWallpaper", path),
  showMessageBox: (options: Electron.MessageBoxOptions) =>
    ipcRenderer.invoke("showMessageBox", options),
  getInfo: (id: string) => ipcRenderer.invoke("getInfo", id),
  getUserSettings: () => ipcRenderer.invoke("getUserSettings"),
  setLaunchAtLogin: (launchAtLogin: boolean) =>
    ipcRenderer.invoke("setLaunchAtLogin", launchAtLogin),
  setTheme: (theme: "light" | "dark") => ipcRenderer.invoke("setTheme", theme),
  quitApp: () => ipcRenderer.invoke("quitApp"),
};

contextBridge.exposeInMainWorld("electron", electronHandler);

export type ElectronHandler = typeof electronHandler;

ipcRenderer.on("themeChanged", (_, theme: "light" | "dark") => {
  document.documentElement.classList.toggle("dark", theme === "dark");
  window.dispatchEvent(new Event("themeChanged"));
});
