"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BeforeAfterTextProps {
  before: string;
  after: string;
  className?: string;
}

/**
 * Text that transitions from "before" to "after" on hover.
 * Characters slide out and new ones slide in from below.
 */
export function BeforeAfterText({ before, after, className }: BeforeAfterTextProps) {
  return (
    <motion.span
      className={cn("relative inline-block overflow-hidden", className)}
      initial="initial"
      whileHover="hovered"
    >
      <motion.span
        className="block"
        variants={{
          initial: { y: 0 },
          hovered: { y: "-100%" },
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {before}
      </motion.span>
      <motion.span
        className="absolute inset-0 block"
        variants={{
          initial: { y: "100%" },
          hovered: { y: 0 },
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {after}
      </motion.span>
    </motion.span>
  );
}
