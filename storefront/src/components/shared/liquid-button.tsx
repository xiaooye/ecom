"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface LiquidButtonProps extends Omit<HTMLMotionProps<"button">, "variant"> {
  children: React.ReactNode;
  variant?: "primary" | "outline";
}

/**
 * Button with liquid/morphing blob animation on hover.
 * Creates an organic, fluid feel for premium CTAs.
 */
export function LiquidButton({
  children,
  variant = "primary",
  className,
  ...props
}: LiquidButtonProps) {
  return (
    <motion.button
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      className={cn(
        "group relative overflow-hidden rounded-full px-8 py-3 font-medium transition-colors",
        variant === "primary"
          ? "bg-primary text-primary-foreground"
          : "border border-primary text-primary",
        className
      )}
      {...props}
    >
      {/* Liquid blob */}
      <motion.span
        className={cn(
          "absolute inset-0 origin-center rounded-full",
          variant === "primary"
            ? "bg-white/20"
            : "bg-primary/10"
        )}
        initial={{ scale: 0, borderRadius: "100%" }}
        variants={{
          hover: {
            scale: 2,
            borderRadius: "40%",
            transition: { duration: 0.6, ease: "easeOut" },
          },
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
