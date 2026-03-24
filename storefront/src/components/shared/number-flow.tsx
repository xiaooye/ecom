"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface NumberFlowProps {
  value: number;
  className?: string;
  format?: (n: number) => string;
}

/**
 * Animated number transition — individual digits roll up/down
 * when the value changes. Like airport departure board numbers.
 */
export function NumberFlow({
  value,
  className,
  format = (n) => n.toString(),
}: NumberFlowProps) {
  const formatted = useMemo(() => format(value), [value, format]);

  return (
    <span className={cn("inline-flex overflow-hidden", className)}>
      {formatted.split("").map((char, i) => (
        <AnimatePresence key={i} mode="popLayout">
          <motion.span
            key={`${i}-${char}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="inline-block"
          >
            {char}
          </motion.span>
        </AnimatePresence>
      ))}
    </span>
  );
}
