import React from "react";
import { useTranslation } from "react-i18next";
import { MdOutlineWifiOff } from "react-icons/md";

export default function NetworkIssue() {
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col justify-center p-3 text-gray-700">
      <MdOutlineWifiOff className="mx-auto text-5xl" />
      <h1 className="text-center text-2xl">{t("no-internet-connection")}</h1>
      <p className="text-center text-sm">
        {t("this-app-requires-an-internet...")}
      </p>
    </div>
  );
}
