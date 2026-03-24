"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedListProps {
  children: React.ReactNode[];
  className?: string;
  delay?: number;
}

/**
 * List where items slide in one after another with stagger.
 * More polished than auto-animate for controlled reveal sequences.
 */
export function AnimatedList({
  children,
  className,
  delay = 0.08,
}: AnimatedListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {children.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.35,
            delay: i * delay,
            ease: "easeOut",
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
