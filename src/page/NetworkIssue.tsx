import React from "react";
import { MdOutlineWifiOff } from "react-icons/md";

export default function NetworkIssue() {
  return (
    <div className="flex h-full flex-col justify-center p-3 text-gray-700">
      <MdOutlineWifiOff className="mx-auto text-5xl" />
      <h1 className="text-center text-2xl">No Internet Connection</h1>
      <p className="text-center text-sm">
        This app requires an internet connection to function properly. Please
        check your connection and try again.
      </p>
    </div>
  );
}
