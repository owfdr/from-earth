import React, { useEffect, useState } from "react";

import Layout from "../layout/Layout";

export default function Favorites() {
  const [favorites, setFavorites] = useState<EarthView[] | null>(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    window.electron.getFavorites().then((favorites) => {
      setFavorites(favorites);
      setProcessing(false);
    });
  });

  if (processing) {
    return <Layout requiresNetwork loadingAnimation />;
  }

  return (
    <Layout>
      <div className="flex min-h-full max-w-screen-sm flex-col p-5 text-gray-700 dark:text-gray-300">
        <h1 className="line-clamp-1 text-3xl">Favorites</h1>
        {favorites.length === 0 && (
          <p className="my-2 text-gray-600 dark:text-gray-400">
            No Favorites yet.
          </p>
        )}
        {favorites?.map((favorite) => (
          <div
            key={favorite.id}
            className="mt-5 flex items-center gap-3 rounded"
          >
            <img src={favorite.thumbUrl} className="w-24 rounded"></img>
            <div className="flex flex-col overflow-hidden">
              <div className="truncate font-medium">
                {favorite.region ? favorite.region : favorite.country}
              </div>
              <div className="truncate text-sm tracking-tight text-gray-600 dark:text-gray-400">
                {favorite.region ? favorite.country : ""}
              </div>
            </div>
            <button
              title="Remove from Favorites"
              className="z-10 ml-auto text-gray-500 duration-150 ease-in-out hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={() => {
                window.electron.removeFavorite(favorite.id);
                setFavorites(
                  favorites.filter((each) => each.id !== favorite.id),
                );
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 stroke-current"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}
