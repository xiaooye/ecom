"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InteractiveGridProps {
  rows?: number;
  cols?: number;
  className?: string;
}

/**
 * Interactive grid where cells light up on hover.
 * Creates a subtle wave/ripple lighting effect following the cursor.
 */
export function InteractiveGrid({
  rows = 8,
  cols = 12,
  className,
}: InteractiveGridProps) {
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);

  const getDistance = useCallback(
    (index: number) => {
      if (hoveredCell === null) return 999;
      const hRow = Math.floor(hoveredCell / cols);
      const hCol = hoveredCell % cols;
      const cRow = Math.floor(index / cols);
      const cCol = index % cols;
      return Math.sqrt(Math.pow(hRow - cRow, 2) + Math.pow(hCol - cCol, 2));
    },
    [hoveredCell, cols]
  );

  return (
    <div
      className={cn("grid gap-1", className)}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => {
        const distance = getDistance(i);
        const opacity = Math.max(0, 1 - distance * 0.25);

        return (
          <motion.div
            key={i}
            onMouseEnter={() => setHoveredCell(i)}
            animate={{
              backgroundColor:
                opacity > 0.1
                  ? `rgba(var(--primary-rgb, 99 102 241) / ${opacity * 0.3})`
                  : "transparent",
            }}
            transition={{ duration: 0.15 }}
            className="aspect-square rounded-sm border border-border/20"
          />
        );
      })}
    </div>
  );
}
