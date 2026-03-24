"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WavyTextProps {
  text: string;
  className?: string;
  delay?: number;
}

/**
 * Text with wave animation — each character bobs up and down
 * with a staggered sine wave delay.
 */
export function WavyText({ text, className, delay = 0 }: WavyTextProps) {
  return (
    <motion.span
      className={cn("inline-flex", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={{
            hidden: { y: 0 },
            visible: {
              y: [0, -12, 0],
              transition: {
                delay: delay + i * 0.04,
                duration: 0.6,
                ease: "easeInOut",
              },
            },
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
