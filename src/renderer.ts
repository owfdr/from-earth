import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import React from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { RouterProvider, createHashRouter, redirect } from "react-router-dom";

import "./index.css";
import Explore from "./page/Explore";
import Favorites from "./page/Favorites";
import Language from "./page/Language";
import Settings from "./page/Settings";
import { ElectronHandler } from "./preload";
import en from "./translations/en.json";
import ja from "./translations/ja.json";
import ko from "./translations/ko.json";
import zhCN from "./translations/zh-CN.json";
import zhTW from "./translations/zh-TW.json";

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

// eslint-disable-next-line import/no-named-as-default-member
i18next
  .use(initReactI18next)
  .use(I18nextBrowserLanguageDetector)
  .init({
    fallbackLng: "en",
    debug: process.env.NODE_ENV === "development",
    resources: {
      en: {
        translation: en,
      },
      ja: {
        translation: ja,
      },
      ko: {
        translation: ko,
      },
      "zh-CN": {
        translation: zhCN,
      },
      "zh-TW": {
        translation: zhTW,
      },
    },
  });

root.render(
  React.createElement(
    I18nextProvider,
    { i18n: i18next },
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
          path: "/settings/language",
          element: React.createElement(Language),
        },
        {
          path: "/favorites",
          element: React.createElement(Favorites),
        },
      ]),
    }),
  ),
);
