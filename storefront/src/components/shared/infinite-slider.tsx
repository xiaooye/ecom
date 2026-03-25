"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InfiniteSliderProps {
  children: React.ReactNode;
  speed?: number;
  direction?: "left" | "right";
  gap?: number;
  className?: string;
}

/**
 * Seamless infinite slider with configurable speed and direction.
 * Duplicates content 4x for gap-free looping.
 */
export function InfiniteSlider({
  children,
  speed = 30,
  direction = "left",
  gap = 24,
  className,
}: InfiniteSliderProps) {
  const isLeft = direction === "left";

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        className="flex"
        style={{ gap }}
        animate={{ x: isLeft ? "-25%" : "0%" }}
        initial={{ x: isLeft ? "0%" : "-25%" }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
      >
        {/* 4x duplication for seamless loop */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex shrink-0" style={{ gap }}>
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
