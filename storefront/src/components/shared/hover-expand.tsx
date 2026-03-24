"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HoverExpandProps {
  children: React.ReactNode;
  expandedContent: React.ReactNode;
  className?: string;
}

/**
 * Card that expands additional content on hover.
 * Smoothly reveals extra information below the main content.
 */
export function HoverExpand({
  children,
  expandedContent,
  className,
}: HoverExpandProps) {
  return (
    <motion.div
      className={cn("group overflow-hidden rounded-xl border", className)}
      whileHover="expanded"
      initial="collapsed"
    >
      {children}
      <motion.div
        variants={{
          collapsed: { height: 0, opacity: 0 },
          expanded: { height: "auto", opacity: 1 },
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        {expandedContent}
      </motion.div>
    </motion.div>
  );
}
