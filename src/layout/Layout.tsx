import React, { useEffect, useState } from "react";

import TabBar from "../component/TabBar";
import NetworkIssue from "../page/NetworkIssue";

type Props = {
  children: React.ReactNode;
  requiresNetwork?: boolean;
};

export default function Layout({ children, requiresNetwork }: Props) {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    window.addEventListener("online", () => {
      setIsOffline(false);
    });

    window.addEventListener("offline", () => {
      setIsOffline(true);
    });
  }, []);

  return (
    <div className="flex h-screen max-h-screen flex-col">
      {isOffline && requiresNetwork ? (
        <div className="grow overflow-scroll bg-gray-100">
          <NetworkIssue />
        </div>
      ) : (
        <div className="grow overflow-scroll bg-gray-100">{children}</div>
      )}
      <TabBar />
    </div>
  );
}
