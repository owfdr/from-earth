import React, { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { SiGoogleearth, SiGooglemaps } from "react-icons/si";
import { BiSearchAlt } from "react-icons/bi";
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
    <Layout requiresNetwork>
      <div className="flex min-h-full max-w-screen-sm flex-col gap-1 p-5 text-gray-700">
        <h1 className="line-clamp-2 text-3xl">{earthView?.name}</h1>
        <button
          hidden={!earthView}
          title="Search in Google"
          className="absolute right-4 top-4 text-gray-500 duration-150 ease-in-out hover:text-gray-700"
          onClick={() => {
            window.electron.openUrl(
              `https://www.google.com/search?q=${encodeURI(earthView?.name)}`,
            );
          }}
        >
          <BiSearchAlt />
        </button>

        <div
          className={`mb-0.5 line-clamp-4 font-inter text-sm ${
            wiki
              ? "cursor-pointer rounded-md duration-150 ease-in-out hover:bg-gray-200 hover:text-gray-900"
              : ""
          }`}
          title="Open in Wikipedia"
          hidden={!earthView}
          onClick={() => {
            if (wiki) {
              window.electron.openUrl(
                `https://en.wikipedia.org/wiki/${encodeURI(
                  earthView?.region || earthView?.country,
                )}`,
              );
            }
          }}
        >
          {(earthView && wiki) || "Wikipedia not found."}
        </div>

        <img
          hidden={!earthView}
          className="cursor-pointer overflow-hidden rounded-md text-left transition duration-150 ease-in-out hover:brightness-95"
          src={earthView?.thumbUrl}
          onClick={() => {
            window.electron.openUrl(earthView?.photoUrl);
          }}
        />

        <button
          className="truncate text-left text-xs tracking-tight text-gray-500 duration-150 ease-in-out hover:text-gray-600"
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

        <div className="my-1 grid grid-cols-3 gap-3 text-xs tracking-tight text-gray-500">
          <div>
            <div>LAT</div>
            <div>{earthView?.lat}</div>
          </div>
          <div>
            <div>LONG</div>
            <div>{earthView?.lng}</div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              title="Open in Google Earth"
              className="rounded-md p-1 text-gray-500 duration-150 ease-in-out hover:bg-gray-200 hover:text-gray-700"
              onClick={() => {
                window.electron.openUrl(earthView.earthLink);
              }}
            >
              <SiGoogleearth className="h-5 w-5" />
            </button>
            <button
              title="Open in Google Maps"
              className="rounded-md p-1 text-gray-500 duration-150 ease-in-out hover:bg-gray-200 hover:text-gray-700"
              onClick={() => {
                window.electron.openUrl(earthView.mapsLink);
              }}
            >
              <SiGooglemaps className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grow" />
        <div className="mb-1 flex gap-3 text-sm">
          <button
            className="w-full rounded-md border bg-white p-3 duration-150 ease-in-out hover:text-gray-900 hover:shadow-sm"
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
            className="w-full flex-1 rounded-md border bg-white p-3 duration-150 ease-in-out hover:text-gray-900 hover:shadow-sm"
            onClick={() => {
              fetchData();
            }}
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </Layout>
  );
}
