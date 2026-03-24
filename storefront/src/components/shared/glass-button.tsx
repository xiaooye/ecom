"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
};

/**
 * Frosted glass button with hover glow effect.
 */
export function GlassButton({
  children,
  size = "md",
  className,
  ...props
}: GlassButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative overflow-hidden rounded-full border border-white/20 font-medium text-white backdrop-blur-md transition-colors",
        "bg-white/10 hover:bg-white/20",
        "shadow-[0_0_15px_rgba(255,255,255,0.1)]",
        "hover:shadow-[0_0_25px_rgba(255,255,255,0.15)]",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {/* Shine sweep on hover */}
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 hover:translate-x-full" />
      <span className="relative">{children}</span>
    </motion.button>
  );
}
