import { motion } from "framer-motion";
import React from "react";

type Props = {
  children: React.ReactNode;
  name: string;
};

export default function Transition({ children, name }: Props) {
  return (
    <motion.div
      className="h-full"
      key={name}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
