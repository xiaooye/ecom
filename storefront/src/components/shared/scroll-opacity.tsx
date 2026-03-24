"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollOpacityProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Content that fades based on scroll position.
 * Fully visible in center of viewport, transparent at edges.
 */
export function ScrollOpacity({ children, className }: ScrollOpacityProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div style={{ opacity }}>{children}</motion.div>
    </div>
  );
}
