import i18next, { changeLanguage } from "i18next";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiChevronLeft, HiOutlineCheck } from "react-icons/hi";
import { NavLink } from "react-router-dom";

import Layout from "../layout/Layout";

export default function Language() {
  const language = i18next.language;
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="flex min-h-full max-w-screen-sm flex-col p-5 text-gray-700 dark:text-gray-300">
        <div className="-mx-4 mb-7 flex items-center justify-between">
          <NavLink
            to="/settings"
            className="flex basis-1/3 items-center opacity-80"
          >
            <HiChevronLeft className="text-xl" />
            {t("settings")}
          </NavLink>
          <h1 className="basis-1/3 text-center text-lg font-medium">
            {t("language")}
          </h1>
          <div className="basis-1/3"></div>
        </div>

        <div className="overflow-hidden rounded-md border bg-white dark:border-gray-600 dark:bg-gray-700">
          <ul role="list" className="divide-y dark:divide-gray-600">
            <li
              className="flex cursor-pointer items-center justify-between p-3"
              onClick={() => changeLanguage("en")}
            >
              <h2 className="tracking-tight">English</h2>
              {language === "en" && <HiOutlineCheck className="text-xl" />}
            </li>
            <li
              className="flex cursor-pointer items-center justify-between p-3"
              onClick={() => changeLanguage("ja")}
            >
              <h2 className="tracking-tight">日本語</h2>
              {language === "ja" && <HiOutlineCheck className="text-xl" />}
            </li>
            <li
              className="flex cursor-pointer items-center justify-between p-3"
              onClick={() => changeLanguage("ko")}
            >
              <h2 className="tracking-tight">한국어</h2>
              {language === "ko" && <HiOutlineCheck className="text-xl" />}
            </li>
            <li
              className="flex cursor-pointer items-center justify-between p-3"
              onClick={() => changeLanguage("zh-CN")}
            >
              <h2 className="tracking-tight">简体中文</h2>
              {language === "zh-CN" && <HiOutlineCheck className="text-xl" />}
            </li>
            <li
              className="flex cursor-pointer items-center justify-between p-3"
              onClick={() => changeLanguage("zh-TW")}
            >
              <h2 className="tracking-tight">繁體中文</h2>
              {language === "zh-TW" && <HiOutlineCheck className="text-xl" />}
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
