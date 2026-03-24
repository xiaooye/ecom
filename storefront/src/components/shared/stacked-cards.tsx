"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface StackedCardsProps {
  items: React.ReactNode[];
  className?: string;
}

/**
 * Stacked card deck that fans out and lets user swipe through.
 * Click to cycle, or drag to dismiss top card.
 */
export function StackedCards({ items, className }: StackedCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = 3;

  const next = () => setCurrentIndex((prev) => (prev + 1) % items.length);

  return (
    <div
      className={cn("relative h-64 w-full", className)}
      onClick={next}
    >
      <AnimatePresence mode="popLayout">
        {items.slice(currentIndex, currentIndex + visibleCount).map((item, i) => (
          <motion.div
            key={currentIndex + i}
            layout
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{
              scale: 1 - i * 0.05,
              y: i * -8,
              opacity: 1 - i * 0.2,
              zIndex: visibleCount - i,
            }}
            exit={{ scale: 0.9, y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="absolute inset-0 cursor-pointer rounded-xl border bg-card p-6 shadow-lg"
          >
            {item}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
