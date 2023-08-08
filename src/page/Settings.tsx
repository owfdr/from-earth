import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Toggle from "../component/Toggle";
import Layout from "../layout/Layout";

export default function Settings() {
  const [launchAtLogin, setLaunchAtLogin] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [ready, setReady] = useState(false);

  const { t } = useTranslation();

  const refreshData = () => {
    window.electron.getUserSettings().then((settings) => {
      setLaunchAtLogin(settings.launchAtLogin);
      setIsDarkTheme(settings.theme === "dark");
      setReady(true);
    });
  };

  useEffect(() => {
    refreshData();
    window.addEventListener("themeChanged", refreshData);
    return () => {
      window.removeEventListener("themeChanged", refreshData);
    };
  }, []);

  if (!ready) {
    return <Layout />;
  }

  return (
    <Layout>
      <div className="flex min-h-full max-w-screen-sm flex-col p-5 text-gray-700 dark:text-gray-300">
        <h1 className="mb-5 line-clamp-1 text-3xl">{t("settings")}</h1>
        <div className="flex justify-between rounded-lg rounded-b-none border border-b-0 bg-white p-3 dark:border-gray-600 dark:bg-gray-700">
          <h2 className="tracking-tight">{t("launch-at-login")}</h2>
          <Toggle
            value={launchAtLogin}
            onChange={(enabled) => {
              window.electron.setLaunchAtLogin(enabled);
            }}
          />
        </div>
        <div className="flex justify-between rounded-lg rounded-t-none border bg-white p-3 dark:border-gray-600 dark:bg-gray-700">
          <h2 className="tracking-tight">{t("dark-mode")}</h2>
          <Toggle
            value={isDarkTheme}
            onChange={(enabled) => {
              window.electron.setTheme(enabled ? "dark" : "light");
            }}
          />
        </div>
        <div className="dark:hover-text-red-600 mt-5 flex justify-between rounded-lg border border-red-300 bg-white text-red-400 transition duration-200 ease-in-out hover:border-red-400 hover:text-red-400 dark:border-gray-600 dark:bg-gray-700 dark:text-red-500 dark:hover:border-red-400 dark:hover:bg-red-500 dark:hover:text-gray-200">
          <button
            className="w-full p-3 tracking-tight"
            onClick={() => {
              window.electron.quitApp();
            }}
          >
            {t("quit-app")}
          </button>
        </div>
      </div>
    </Layout>
  );
}
