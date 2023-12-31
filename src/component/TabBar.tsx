import {
  Cog6ToothIcon,
  GlobeAsiaAustraliaIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { NavLink } from "react-router-dom";

const routes = [
  {
    name: "Explore",
    path: "/",
    icon: GlobeAsiaAustraliaIcon,
  },
  {
    name: "Favorites",
    path: "/favorites",
    icon: HeartIcon,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Cog6ToothIcon,
  },
];

export default function TabBar() {
  return (
    <div className="flex border-t bg-gray-100 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
      {routes.map((route) => (
        <NavLink
          key={route.name}
          to={route.path}
          className={({ isActive }) =>
            isActive
              ? "inline-block w-full bg-white p-4 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-100"
              : "inline-block w-full bg-white p-4 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-100"
          }
        >
          {React.createElement(route.icon, {
            className: "w-5 h-5 mb-1 mx-auto",
          })}
        </NavLink>
      ))}
    </div>
  );
}
