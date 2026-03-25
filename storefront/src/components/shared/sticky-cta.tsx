"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface StickyCTAProps {
  children: React.ReactNode;
  showAfter?: number;
  className?: string;
  position?: "top" | "bottom";
}

/**
 * Sticky CTA bar that appears after scrolling past a threshold.
 * Useful for persistent "Add to Cart" or "Shop Now" banners.
 */
export function StickyCTA({
  children,
  showAfter = 400,
  className,
  position = "bottom",
}: StickyCTAProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > showAfter);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showAfter]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: position === "bottom" ? 100 : -100 }}
          animate={{ y: 0 }}
          exit={{ y: position === "bottom" ? 100 : -100 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={cn(
            "fixed left-0 right-0 z-40 border bg-background/95 shadow-lg backdrop-blur-lg",
            position === "bottom" ? "bottom-0" : "top-0",
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
