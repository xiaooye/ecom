"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

/**
 * Animated "scroll down" indicator for hero sections.
 * Bouncing arrow that fades out as user scrolls.
 */
export function ScrollIndicator() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center gap-1"
      >
        <span className="text-xs font-medium text-white/60">Scroll</span>
        <ChevronDown className="h-5 w-5 text-white/60" />
      </motion.div>
    </motion.div>
  );
}
