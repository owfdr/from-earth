import React, { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { SiGoogleearth, SiGooglemaps } from "react-icons/si";
import Spinner from "../component/Spinner";

export default function Explore() {
  const [earthView, setEarthView] = useState<EarthView | null>(null);
  const [wiki, setWiki] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  const fetchData = () => {
    window.electron.newView().then(({ earthView, wiki }) => {
      setEarthView(earthView);
      setWiki(wiki);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="p-5 max-w-screen-sm min-h-full flex flex-col gap-1 text-gray-700 bg-gray-100">
        <h1 className="text-3xl line-clamp-2">{earthView?.name}</h1>

        <div
          className={`text-sm line-clamp-4 ${
            wiki
              ? "cursor-pointer rounded-md hover:bg-gray-200 hover:text-gray-900 duration-150 ease-in-out"
              : ""
          }`}
          title="Open in Wikipedia"
          hidden={!earthView}
          onClick={() => {
            if (wiki) {
              window.electron.openUrl(
                `https://en.wikipedia.org/wiki/${encodeURI(
                  earthView?.region || earthView?.country
                )}`
              );
            }
          }}
        >
          {(earthView && wiki) || "Wikipedia not found."}
        </div>

        <img
          hidden={!earthView}
          className="rounded-md overflow-hidden hover:brightness-95 transition duration-150 ease-in-out cursor-pointer text-left"
          src={earthView?.thumbUrl}
          onClick={() => {
            window.electron.openUrl(earthView?.photoUrl);
          }}
        />

        <button
          className="tracking-tight text-xs text-left truncate text-gray-500 hover:text-gray-600 duration-150 ease-in-out"
          title={earthView?.attribution}
          onClick={() => {
            window.electron.showMessageBox({
              type: "info",
              title: "Attribution",
              message: "Images " + earthView?.attribution,
            });
          }}
        >
          {earthView?.attribution}
        </button>

        <div className="text-xs my-1 text-gray-500 tracking-tight grid grid-cols-3 gap-3">
          <div>
            <div>LAT</div>
            <div>{earthView?.lat}</div>
          </div>
          <div>
            <div>LONG</div>
            <div>{earthView?.lng}</div>
          </div>
          <div className="flex justify-end gap-2 items-center">
            <button
              title="Open in Google Earth"
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 p-1 rounded-md duration-150 ease-in-out"
              onClick={() => {
                window.electron.openUrl(earthView.earthLink);
              }}
            >
              <SiGoogleearth className="w-5 h-5" />
            </button>
            <button
              title="Open in Google Maps"
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 p-1 rounded-md duration-150 ease-in-out"
              onClick={() => {
                window.electron.openUrl(earthView.mapsLink);
              }}
            >
              <SiGooglemaps className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grow" />
        <div className="flex text-sm mb-1 gap-3">
          <button
            className="p-3 w-full border rounded-md bg-white hover:shadow-sm hover:text-gray-900 duration-150 ease-in-out"
            disabled={processing}
            onClick={() => {
              setProcessing(true);
              window.electron.setWallpaper(earthView?.id).then(() => {
                setProcessing(false);
              });
            }}
          >
            {processing ? <Spinner /> : "Set as Wallpaper"}
          </button>
          <button
            className="p-3 w-full border rounded-md flex-1 bg-white hover:shadow-sm hover:text-gray-900 duration-150 ease-in-out"
            onClick={() => {
              fetchData();
            }}
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Layout>
  );
}
