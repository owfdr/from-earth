import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";

import TabBar from "../component/TabBar";
import Transition from "../component/Transition";
import Loading from "../page/Loading";
import NetworkIssue from "../page/NetworkIssue";

type Props = {
  children?: React.ReactNode;
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
        <Transition name="network-issue">
          <NetworkIssue />
        </Transition>
      );
    } else if (loadingAnimation) {
      return (
        <Transition name="loading">
          <Loading />
        </Transition>
      );
    } else {
      return <Transition name="children">{children}</Transition>;
    }
  };

  return (
    <div className="flex h-screen max-h-screen flex-col">
      <div className="grow overflow-scroll bg-gray-100 transition duration-300 dark:bg-gray-900">
        <AnimatePresence>{contentSwitch()}</AnimatePresence>
      </div>
      <TabBar />
    </div>
  );
}
