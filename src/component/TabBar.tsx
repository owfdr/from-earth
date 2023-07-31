import React from "react";
import { NavLink } from "react-router-dom";
import {
  GlobeAsiaAustraliaIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

const routes = [
  {
    name: "Explore",
    path: "/",
    icon: GlobeAsiaAustraliaIcon,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Cog6ToothIcon,
  },
  {
    name: "Info",
    path: "/info",
    icon: InformationCircleIcon,
  },
];

export default function TabBar() {
  return (
    <div className="flex border-t bg-gray-100 text-sm font-medium text-center text-gray-500 dark:text-gray-400">
      {routes.map((route) => (
        <NavLink
          key={route.name}
          to={route.path}
          className={({ isActive }) =>
            isActive
              ? "inline-block w-full p-4 bg-white text-gray-700 hover:bg-gray-50 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
              : "inline-block w-full p-4 bg-white hover:text-gray-700 hover:bg-gray-50 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
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
