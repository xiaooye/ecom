"use client";

import { motion } from "framer-motion";

interface MorphContainerProps {
  children: React.ReactNode;
  layoutId: string;
  className?: string;
}

/**
 * Wraps content in a Framer Motion layout animation container.
 * When used with matching layoutIds between skeleton and content,
 * creates smooth morphing transitions.
 */
export function MorphContainer({
  children,
  layoutId,
  className,
}: MorphContainerProps) {
  return (
    <motion.div
      layoutId={layoutId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        layout: { duration: 0.4, ease: "easeInOut" },
        opacity: { duration: 0.25 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
