"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  text: string;
  className?: string;
  charDelay?: number;
  animation?: "fade-up" | "rotate-in" | "scale";
}

const animations = {
  "fade-up": {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  "rotate-in": {
    initial: { opacity: 0, rotateY: 90 },
    animate: { opacity: 1, rotateY: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1 },
  },
};

/**
 * Per-character animated text with multiple animation presets.
 * Each character animates independently with staggered timing.
 */
export function SplitText({
  text,
  className,
  charDelay = 0.03,
  animation = "fade-up",
}: SplitTextProps) {
  const variant = animations[animation];

  return (
    <motion.span
      className={cn("inline-flex flex-wrap", className)}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={{
            initial: variant.initial,
            animate: {
              ...variant.animate,
              transition: { duration: 0.4, delay: i * charDelay },
            },
          }}
          className="inline-block"
          style={{ display: char === " " ? "inline" : "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
