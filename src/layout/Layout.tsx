import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";

import TabBar from "../component/TabBar";
import Loading from "../page/Loading";
import NetworkIssue from "../page/NetworkIssue";
import Transition from "../component/Transition";

type Props = {
  children: React.ReactNode;
  requiresNetwork?: boolean;
  loadingAnimation?: boolean;
};

export default function Layout(props: Props) {
  const { children, requiresNetwork, loadingAnimation } = props;
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    window.addEventListener("online", () => {
      setIsOffline(false);
    });

    window.addEventListener("offline", () => {
      setIsOffline(true);
    });
  }, []);

  const contentSwitch = () => {
    if (isOffline && requiresNetwork) {
      return (
        <Transition key="network-issue">
          <NetworkIssue />
        </Transition>
      );
    } else if (loadingAnimation) {
      return (
        <Transition key="loading">
          <Loading />
        </Transition>
      );
    } else {
      return <Transition key="children">{children}</Transition>;
    }
  };

  return (
    <div className="flex h-screen max-h-screen flex-col">
      <div className="grow overflow-scroll bg-gray-100 transition duration-300">
        <AnimatePresence>{contentSwitch()}</AnimatePresence>
      </div>
      <TabBar />
    </div>
  );
}
