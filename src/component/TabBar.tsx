import React from "react";
import { NavLink } from "react-router-dom";

const routes = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Settings",
    path: "/settings",
  },
  {
    name: "Info",
    path: "/info",
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
          {route.name}
        </NavLink>
      ))}
    </div>
  );
}
