"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedBadgeProps {
  children: React.ReactNode;
  variant?: "default" | "shimmer" | "pulse" | "glow";
  className?: string;
}

/**
 * Badge with animation effects.
 * shimmer: metallic sweep, pulse: breathing scale, glow: colored halo.
 */
export function AnimatedBadge({
  children,
  variant = "default",
  className,
}: AnimatedBadgeProps) {
  return (
    <motion.span
      className={cn(
        "relative inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variant === "default" && "bg-primary text-primary-foreground",
        variant === "shimmer" && "overflow-hidden bg-primary text-primary-foreground",
        variant === "pulse" && "bg-primary text-primary-foreground",
        variant === "glow" && "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(99,102,241,0.5)]",
        className
      )}
      animate={
        variant === "pulse"
          ? { scale: [1, 1.05, 1] }
          : variant === "glow"
            ? { boxShadow: ["0 0 10px rgba(99,102,241,0.3)", "0 0 25px rgba(99,102,241,0.6)", "0 0 10px rgba(99,102,241,0.3)"] }
            : {}
      }
      transition={
        variant === "pulse" || variant === "glow"
          ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
          : {}
      }
    >
      {variant === "shimmer" && (
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      )}
      <span className="relative">{children}</span>
    </motion.span>
  );
}
