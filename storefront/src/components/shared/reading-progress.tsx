"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ReadingProgressProps {
  className?: string;
  containerRef?: React.RefObject<HTMLElement | null>;
}

/**
 * Reading progress indicator scoped to a specific container.
 * Shows how far through the content the user has scrolled.
 * Useful for product descriptions, blog posts, policies.
 */
export function ReadingProgress({ className, containerRef }: ReadingProgressProps) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className={cn("h-0.5 w-full overflow-hidden bg-muted", className)}>
      <motion.div
        className="h-full bg-primary"
        style={{ width }}
      />
    </div>
  );
}
