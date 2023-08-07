import React, { useEffect, useState } from "react";

import Toggle from "../component/Toggle";
import Layout from "../layout/Layout";

export default function Settings() {
  const [launchAtLogin, setLaunchAtLogin] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    window.electron.getUserSettings().then((settings) => {
      setLaunchAtLogin(settings.launchAtLogin);
      setReady(true);
    });
  }, []);

  if (!ready) {
    return <Layout />;
  }

  return (
    <Layout>
      <div className="flex min-h-full max-w-screen-sm flex-col  p-5 text-gray-700">
        <h1 className="mb-5 line-clamp-1 text-3xl">Settings</h1>
        <div className="flex justify-between rounded-lg rounded-b-none border border-b-0 bg-white p-3">
          <h2 className="tracking-tight">Launch at login</h2>
          <Toggle
            value={launchAtLogin}
            onChange={(enabled) => {
              window.electron.setLaunchAtLogin(enabled);
            }}
          />
        </div>
        <div className="flex justify-between rounded-lg rounded-t-none border bg-white p-3">
          <h2 className="tracking-tight">Theme</h2>
        </div>
        <div className="mt-5 flex justify-between rounded-lg border border-red-300 bg-white text-red-400 transition duration-200 ease-in-out hover:border-red-400 hover:text-red-500">
          <button
            className="w-full p-3 tracking-tight"
            onClick={() => {
              window.electron.quitApp();
            }}
          >
            Quit App
          </button>
        </div>
      </div>
    </Layout>
  );
}
