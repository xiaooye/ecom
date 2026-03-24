"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface IntersectionFadeProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}

/**
 * Fade-in on intersection with configurable threshold.
 * Lighter than full ScrollReveal — just opacity + translate.
 */
export function IntersectionFade({
  children,
  className,
  delay = 0,
  threshold = 0.1,
}: IntersectionFadeProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: threshold,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
