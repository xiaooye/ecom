"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OrbitProps {
  children: React.ReactNode;
  radius?: number;
  duration?: number;
  delay?: number;
  reverse?: boolean;
  className?: string;
}

/**
 * Orbiting element animation.
 * Child elements rotate around a center point.
 * Use for decorative feature showcase sections.
 */
export function Orbit({
  children,
  radius = 120,
  duration = 20,
  delay = 0,
  reverse = false,
  className,
}: OrbitProps) {
  return (
    <motion.div
      className={cn("absolute", className)}
      style={{
        width: radius * 2,
        height: radius * 2,
        marginLeft: -radius,
        marginTop: -radius,
      }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
        delay,
      }}
    >
      <div
        className="absolute"
        style={{
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <motion.div
          animate={{ rotate: reverse ? 360 : -360 }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "linear",
            delay,
          }}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
}
