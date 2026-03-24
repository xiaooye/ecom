"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedBorderTrailProps {
  children: React.ReactNode;
  className?: string;
  trailColor?: string;
  trailSize?: number;
  duration?: number;
}

/**
 * Card with an animated glowing dot that travels along the border.
 * Creates a subtle, premium highlight trail effect.
 */
export function AnimatedBorderTrail({
  children,
  className,
  trailColor = "rgb(99, 102, 241)",
  trailSize = 60,
  duration = 6,
}: AnimatedBorderTrailProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl border", className)}>
      {/* Trail dot that orbits the border */}
      <motion.div
        className="pointer-events-none absolute z-10"
        style={{
          width: trailSize,
          height: trailSize,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${trailColor}, transparent 70%)`,
          filter: "blur(6px)",
        }}
        animate={{
          offsetDistance: ["0%", "100%"],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
        // CSS offset-path follows the border rectangle
        // Fallback: simple position animation
        initial={{
          left: 0,
          top: 0,
        }}
      />
      <div className="relative z-20 bg-background rounded-[inherit]">
        {children}
      </div>
    </div>
  );
}
