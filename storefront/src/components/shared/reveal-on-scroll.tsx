"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Clip-path reveal animation that uncovers content as user scrolls.
 * Content is revealed from bottom to top using inset clip.
 */
export function RevealOnScroll({ children, className }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end center"],
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"]
  );

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div style={{ clipPath }}>
        {children}
      </motion.div>
    </div>
  );
}
