import React from "react";
import TabBar from "./TabBar";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="h-screen flex flex-col">
      <div className="grow">{children}</div>
      <TabBar />
    </div>
  );
}
