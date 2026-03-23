"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HoverScaleProps {
  children: React.ReactNode;
  scale?: number;
  className?: string;
}

/**
 * Simple hover-to-scale wrapper with spring animation.
 */
export function HoverScale({
  children,
  scale = 1.05,
  className,
}: HoverScaleProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: scale * 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
