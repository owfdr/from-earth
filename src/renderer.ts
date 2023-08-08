import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createHashRouter, redirect } from "react-router-dom";

import "./index.css";
import Explore from "./page/Explore";
import Favorites from "./page/Favorites";
import Settings from "./page/Settings";
import { ElectronHandler } from "./preload";

declare global {
  interface Window {
    electron: ElectronHandler;
  }
}

window.electron.getUserSettings().then(({ theme }) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
});

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(
  React.createElement(RouterProvider, {
    router: createHashRouter([
      {
        path: "/",
        element: React.createElement(Explore),
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
        path: "/favorites",
        element: React.createElement(Favorites),
      },
    ]),
  }),
);
