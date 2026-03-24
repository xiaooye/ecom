"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedBeamProps {
  className?: string;
  delay?: number;
  duration?: number;
  width?: number;
}

/**
 * Animated light beam that sweeps across a container.
 * Creates a "scanning" or "loading" highlight effect.
 */
export function AnimatedBeam({
  className,
  delay = 0,
  duration = 3,
  width = 100,
}: AnimatedBeamProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <motion.div
        className="absolute inset-y-0"
        style={{
          width,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
        }}
        initial={{ x: "-100%" }}
        animate={{ x: "calc(100vw + 100%)" }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
