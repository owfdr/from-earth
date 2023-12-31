import {
  ArrowPathIcon,
  HeartIcon as HeartIconOutline,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiSearchAlt } from "react-icons/bi";
import { SiGoogleearth, SiGooglemaps } from "react-icons/si";

import Spinner from "../component/Spinner";
import Layout from "../layout/Layout";

export default function Explore() {
  const [earthView, setEarthView] = useState<EarthView | null>(null);
  const [wiki, setWiki] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [contentReady, setContentReady] = useState(false);

  const { t, i18n } = useTranslation();

  const fetchCurrent = () => {
    window.electron
      .getCurrent(i18n.language)
      .then(({ earthView, wiki, isFavorite }) => {
        setEarthView(earthView);
        setWiki(wiki);
        setIsFavorite(isFavorite);
        setContentReady(true);
      });
  };

  const fetchNew = () => {
    window.electron
      .newView(i18n.language)
      .then(({ earthView, wiki, isFavorite }) => {
        setEarthView(earthView);
        setWiki(wiki);
        setIsFavorite(isFavorite);
        setContentReady(true);
      });
  };

  useEffect(() => {
    fetchCurrent();
  }, []);

  return (
    <Layout requiresNetwork loadingAnimation={!contentReady}>
      <div className="flex min-h-full max-w-screen-sm flex-col gap-1 p-5 text-gray-700 dark:text-gray-300">
        <h1 className="line-clamp-1 text-3xl">
          {earthView?.region ? earthView?.region : earthView?.country}
        </h1>
        <div className="font-bold">
          {earthView?.region ? earthView?.country : ""}
        </div>
        <button
          hidden={!earthView}
          title={t("search-in-google")}
          className="absolute right-4 top-4 text-gray-500 duration-150 ease-in-out hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          onClick={() => {
            window.electron.openUrl(
              `https://www.google.com/search?q=${encodeURI(
                earthView?.name,
              )}&hl=${i18n.language}`,
            );
          }}
        >
          <BiSearchAlt />
        </button>

        <div
          className={`mb-0.5 line-clamp-4 font-inter text-sm text-gray-600 dark:text-gray-400 ${
            wiki
              ? "hover:text-gray-80 cursor-pointer rounded-md duration-150 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              : ""
          }`}
          title={t("open-in-wikipedia")}
          hidden={!earthView}
          onClick={() => {
            if (wiki) {
              const locale = i18n.language.split("-")[0];
              window.electron.openUrl(
                `https://${locale}.wikipedia.org/wiki/${encodeURI(
                  earthView?.region || earthView?.country,
                )}`,
              );
            }
          }}
        >
          {(earthView && wiki) || t("wikipedia-not-found")}
        </div>

        <img
          hidden={!earthView}
          className="cursor-pointer overflow-hidden rounded-md text-left transition duration-150 ease-in-out hover:brightness-95 dark:hover:brightness-105"
          src={earthView?.thumbUrl}
          onClick={() => {
            window.electron.openUrl(earthView?.photoUrl);
          }}
        />

        <button
          className="truncate text-left text-xs tracking-tight text-gray-500 duration-150 ease-in-out hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
          title={earthView?.attribution}
          onClick={() => {
            window.electron.showMessageBox({
              type: "info",
              title: t("image-attribution"),
              message: "Images " + earthView?.attribution,
            });
          }}
        >
          {earthView?.attribution}
        </button>

        <div className="my-1 grid grid-cols-3 gap-3 text-xs tracking-tight text-gray-500 dark:text-gray-400">
          <div>
            <div>{t("lat")}</div>
            <div>{earthView?.lat}</div>
          </div>
          <div>
            <div>{t("long")}</div>
            <div>{earthView?.lng}</div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              title={t("open-in-google-earth")}
              className="rounded-md p-1 text-gray-500 duration-150 ease-in-out hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-300"
              onClick={() => {
                window.electron.openUrl(earthView.earthLink);
              }}
            >
              <SiGoogleearth className="h-5 w-5" />
            </button>
            <button
              title={t("open-in-google-maps")}
              className="rounded-md p-1 text-gray-500 duration-150 ease-in-out hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-300"
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
            title={t("set-as-wallpaper")}
            className="w-full rounded-md border bg-white p-3 duration-150 ease-in-out hover:text-gray-900 hover:shadow-sm dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-gray-200"
            disabled={processing}
            onClick={() => {
              setProcessing(true);
              window.electron.setWallpaper(earthView?.id).then(() => {
                setProcessing(false);
              });
            }}
          >
            {processing ? <Spinner /> : t("set-as-wallpaper")}
          </button>

          <button
            title={t("toggle-favorite")}
            className="w-full flex-1 rounded-md border bg-white p-3 duration-150 ease-in-out hover:text-gray-900 hover:shadow-sm dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-gray-200"
            onClick={() => {
              if (isFavorite) {
                window.electron.removeFavorite(earthView?.id);
              } else {
                window.electron.addFavorite(earthView);
              }

              setIsFavorite((prev) => !prev);
            }}
          >
            {isFavorite ? (
              <HeartIconSolid className="h-5 w-5" />
            ) : (
              <HeartIconOutline className="h-5 w-5" />
            )}
          </button>

          <button
            title={t("get-new-image")}
            className="w-full flex-1 rounded-md border bg-white p-3 duration-150 ease-in-out hover:text-gray-900 hover:shadow-sm dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-gray-200"
            onClick={() => {
              fetchNew();
            }}
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </Layout>
  );
}
