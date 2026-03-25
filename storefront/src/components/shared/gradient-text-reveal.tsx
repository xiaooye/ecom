"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientTextRevealProps {
  text: string;
  className?: string;
}

/**
 * Text that reveals its gradient color as user scrolls.
 * Starts as muted gray and fills with gradient from left to right
 * synchronized with scroll position.
 */
export function GradientTextReveal({ text, className }: GradientTextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const backgroundSize = useTransform(scrollYProgress, [0, 1], ["0% 100%", "100% 100%"]);

  return (
    <div ref={ref}>
      <motion.span
        className={cn(
          "bg-gradient-to-r from-foreground to-foreground bg-no-repeat bg-clip-text text-transparent",
          className
        )}
        style={{
          backgroundSize,
          WebkitBackgroundClip: "text",
          color: "var(--color-muted-foreground)",
        }}
      >
        {text}
      </motion.span>
    </div>
  );
}
