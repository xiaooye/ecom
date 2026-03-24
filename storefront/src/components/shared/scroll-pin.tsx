"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollPinProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Scroll-pinned section with fade/scale animation.
 * Content scales up and fades in as user scrolls through.
 * Creates a cinematic reveal effect.
 */
export function ScrollPin({ children, className }: ScrollPinProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.85, 1, 1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [60, 0, 0, -60]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div style={{ scale, opacity, y }}>
        {children}
      </motion.div>
    </div>
  );
}
