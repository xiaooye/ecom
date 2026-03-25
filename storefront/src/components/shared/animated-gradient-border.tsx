"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedGradientBorderProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  speed?: number;
}

/**
 * Card with a continuously rotating gradient border.
 * Uses conic-gradient rotation via CSS transform.
 */
export function AnimatedGradientBorder({
  children,
  className,
  colors = ["#6366f1", "#8b5cf6", "#d946ef", "#f43f5e", "#6366f1"],
  speed = 4,
}: AnimatedGradientBorderProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl p-px", className)}>
      <motion.div
        className="absolute inset-0"
        style={{
          background: `conic-gradient(${colors.join(", ")})`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative rounded-[calc(1rem-1px)] bg-background p-6">
        {children}
      </div>
    </div>
  );
}
