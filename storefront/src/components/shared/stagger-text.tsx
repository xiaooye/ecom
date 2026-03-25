"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface StaggerTextProps {
  /** Array of text lines, or a single string that will be split by newlines */
  lines: string[] | string;
  /** Element tag to use for each line (default: "div") */
  as?: "div" | "p" | "span" | "h1" | "h2" | "h3" | "h4";
  /** Horizontal slide distance in px (default: 60) */
  slideDistance?: number;
  /** Delay between each line in seconds (default: 0.12) */
  staggerDelay?: number;
  /** Animation duration per line in seconds (default: 0.6) */
  duration?: number;
  /** Only animate once when scrolled into view (default: true) */
  once?: boolean;
  /** Class for the container */
  className?: string;
  /** Class for each line */
  lineClassName?: string;
}

/**
 * Text where each line staggers in from different directions on scroll.
 * Odd lines (1st, 3rd, ...) slide in from the left.
 * Even lines (2nd, 4th, ...) slide in from the right.
 * Creates a dynamic editorial layout effect.
 */
export function StaggerText({
  lines: linesProp,
  as: Tag = "div",
  slideDistance = 60,
  staggerDelay = 0.12,
  duration = 0.6,
  once = true,
  className,
  lineClassName,
}: StaggerTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-10% 0px" });

  const lines = typeof linesProp === "string" ? linesProp.split("\n") : linesProp;

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      {lines.map((line, i) => {
        // Odd index (0-based): 0, 2, 4... come from left; 1, 3, 5... from right
        const fromLeft = i % 2 === 0;
        const xStart = fromLeft ? -slideDistance : slideDistance;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: xStart }}
            animate={
              isInView
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: xStart }
            }
            transition={{
              duration,
              delay: i * staggerDelay,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <Tag className={lineClassName}>{line}</Tag>
          </motion.div>
        );
      })}
    </div>
  );
}
