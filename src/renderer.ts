import { createRoot } from "react-dom/client";
import { ElectronHandler } from "./preload";
import { RouterProvider, createHashRouter, redirect } from "react-router-dom";
import React from "react";
import Home from "./page/Home";
import Settings from "./page/Settings";
import Info from "./page/Info";
import "./index.css";

declare global {
  interface Window {
    electron: ElectronHandler;
  }
}

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
const router = createHashRouter([
  {
    path: "/",
    element: React.createElement(Home),
  },
  {
    path: "/main_window",
    loader: () => redirect("/"),
  },
  {
    path: "/settings",
    element: React.createElement(Settings),
  },
  {
    path: "/Info",
    element: React.createElement(Info),
  },
]);

root.render(React.createElement(RouterProvider, { router }));
