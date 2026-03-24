"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Sparkle {
  id: number;
  x: string;
  y: string;
  size: number;
  delay: number;
}

interface SparklesProps {
  children: React.ReactNode;
  className?: string;
  count?: number;
  color?: string;
}

/**
 * Wraps content with randomly placed animated sparkle effects.
 * Creates a magical/premium feel for featured elements.
 */
export function Sparkles({
  children,
  className,
  count = 8,
  color = "#FFC700",
}: SparklesProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const generateSparkles = useCallback(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      size: Math.random() * 8 + 6,
      delay: Math.random() * 2,
    }));
  }, [count]);

  useEffect(() => {
    setSparkles(generateSparkles());
    const interval = setInterval(() => {
      setSparkles(generateSparkles());
    }, 3000);
    return () => clearInterval(interval);
  }, [generateSparkles]);

  return (
    <span className={cn("relative inline-block", className)}>
      {children}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.svg
            key={sparkle.id}
            className="pointer-events-none absolute"
            style={{
              left: sparkle.x,
              top: sparkle.y,
              width: sparkle.size,
              height: sparkle.size,
            }}
            initial={{ opacity: 0, scale: 0, rotate: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: [0, 180],
            }}
            transition={{
              duration: 1.5,
              delay: sparkle.delay,
              ease: "easeInOut",
            }}
            viewBox="0 0 24 24"
            fill={color}
          >
            <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41Z" />
          </motion.svg>
        ))}
      </AnimatePresence>
    </span>
  );
}
