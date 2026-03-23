"use client";

import { motion } from "framer-motion";

interface FlipTextProps {
  text: string;
  className?: string;
}

/**
 * Text that flips in letter-by-letter with staggered animation.
 * Eye-catching for headings and special callouts.
 */
export function FlipText({ text, className }: FlipTextProps) {
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, rotateX: -90, y: 20 },
            visible: {
              opacity: 1,
              rotateX: 0,
              y: 0,
              transition: {
                duration: 0.4,
                delay: i * 0.03,
                ease: "easeOut",
              },
            },
          }}
          className="inline-block"
          style={{ transformOrigin: "bottom" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
