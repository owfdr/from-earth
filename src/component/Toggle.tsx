import { Switch } from "@headlessui/react";
import React, { useEffect, useState } from "react";

type Props = {
  value: boolean;
  onChange: (enabled: boolean) => void;
};

export default function Toggle({ value, onChange }: Props) {
  const [enabled, setEnabled] = useState(value);

  useEffect(() => {
    setEnabled(value);
  }, [value]);

  const classNames = (...classes: (string | boolean)[]) =>
    classes.filter(Boolean).join(" ");

  return (
    <Switch
      checked={enabled}
      onChange={(value) => {
        setEnabled(value);
        onChange(value);
      }}
      className={classNames(
        enabled ? "bg-blue-400" : "bg-gray-200",
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={classNames(
          enabled ? "translate-x-5" : "translate-x-0",
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
        )}
      />
    </Switch>
  );
}
