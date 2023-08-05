import React from "react";

import Spinner from "../component/Spinner";

export default function Loading() {
  return (
    <div className="flex h-full items-center justify-center p-3">
      <Spinner />
    </div>
  );
}
