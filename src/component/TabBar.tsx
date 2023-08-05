import {
  Cog6ToothIcon,
  GlobeAsiaAustraliaIcon,
  InformationCircleIcon,
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
    <div className="flex border-t bg-gray-100 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
      {routes.map((route) => (
        <NavLink
          key={route.name}
          to={route.path}
          className={({ isActive }) =>
            isActive
              ? "inline-block w-full bg-white p-4 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
              : "inline-block w-full bg-white p-4 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
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
