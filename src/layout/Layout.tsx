import React from "react";
import TabBar from "../component/TabBar";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="flex h-screen max-h-screen flex-col">
      <div className="grow overflow-scroll">{children}</div>
      <TabBar />
    </div>
  );
}
