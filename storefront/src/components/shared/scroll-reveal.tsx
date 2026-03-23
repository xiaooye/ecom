"use client";

import { motion } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  className?: string;
}

const directionMap = {
  up: { initial: { y: 40 }, animate: { y: 0 } },
  down: { initial: { y: -40 }, animate: { y: 0 } },
  left: { initial: { x: 40 }, animate: { x: 0 } },
  right: { initial: { x: -40 }, animate: { x: 0 } },
};

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className,
}: ScrollRevealProps) {
  const variants = directionMap[direction];

  return (
    <motion.div
      initial={{ opacity: 0, ...variants.initial }}
      whileInView={{ opacity: 1, ...variants.animate }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
