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
  quitApp: () => ipcRenderer.invoke("quitApp"),
};

contextBridge.exposeInMainWorld("electron", electronHandler);

export type ElectronHandler = typeof electronHandler;
