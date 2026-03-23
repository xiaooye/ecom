"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedGradientBgProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Slowly animated gradient background.
 * Uses CSS background-size + position animation for smooth shifting colors.
 */
export function AnimatedGradientBg({
  children,
  className,
}: AnimatedGradientBgProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden",
        className
      )}
      style={{
        background:
          "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
        backgroundSize: "400% 400%",
      }}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 15,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      {children}
    </motion.div>
  );
}
