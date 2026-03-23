"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
}

/**
 * Infinite horizontal scrolling marquee.
 * Duplicates children for seamless loop.
 */
export function Marquee({
  children,
  speed = 25,
  direction = "left",
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  const directionMultiplier = direction === "left" ? -1 : 1;

  return (
    <div
      className={cn(
        "group flex overflow-hidden",
        pauseOnHover && "[&:hover>div]:animation-play-state-paused",
        className
      )}
    >
      <motion.div
        className="flex shrink-0 gap-4"
        animate={{ x: `${directionMultiplier * -50}%` }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
