import React from "react";

import Spinner from "../component/Spinner";

export default function Loading() {
  return (
    <div className="h-full flex justify-center items-center">
      <Spinner />
    </div>
  );
}
