"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
  contentWidth?: number; // total scrollable width in vw units
}

/**
 * Scroll-driven horizontal gallery.
 * Vertical scroll translates to horizontal movement.
 * Creates an immersive editorial-style product showcase.
 */
export function HorizontalScroll({
  children,
  className,
  contentWidth = 300,
}: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${contentWidth - 100}%`]);

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{ height: `${contentWidth}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div
          className="flex gap-6"
          style={{ x }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export function HorizontalScrollItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-[80vw] flex-shrink-0 sm:w-[60vw] lg:w-[40vw]", className)}>
      {children}
    </div>
  );
}
