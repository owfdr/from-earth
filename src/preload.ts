import { contextBridge, ipcRenderer } from "electron";

const electronHandler = {
  openUrl: (url: string) => ipcRenderer.invoke("openUrl", url),
};

contextBridge.exposeInMainWorld("electron", electronHandler);

export type ElectronHandler = typeof electronHandler;
