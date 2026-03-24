"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom";
  className?: string;
}

/**
 * Tooltip with spring-animated entrance and exit.
 * Shows on hover with scale-bounce effect.
 */
export function AnimatedTooltip({
  content,
  children,
  side = "top",
  className,
}: AnimatedTooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: side === "top" ? 8 : -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: side === "top" ? 8 : -8 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={cn(
              "absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg bg-popover px-3 py-1.5 text-xs font-medium text-popover-foreground shadow-md border",
              side === "top" ? "bottom-full mb-2" : "top-full mt-2"
            )}
          >
            {content}
            {/* Arrow */}
            <span
              className={cn(
                "absolute left-1/2 -translate-x-1/2 border-4 border-transparent",
                side === "top"
                  ? "top-full border-t-popover"
                  : "bottom-full border-b-popover"
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
