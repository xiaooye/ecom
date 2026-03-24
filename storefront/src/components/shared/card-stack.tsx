"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardStackProps {
  items: Array<{ id: string; content: React.ReactNode }>;
  className?: string;
}

/**
 * Tinder-style card stack with swipe to dismiss.
 * Top card can be swiped left/right, next card scales up to replace.
 */
export function CardStack({ items, className }: CardStackProps) {
  const [stack, setStack] = useState(items);

  const removeTop = (direction: number) => {
    setStack((prev) => prev.slice(1));
  };

  return (
    <div className={cn("relative h-72 w-full", className)}>
      {stack.slice(0, 3).map((item, i) => (
        <motion.div
          key={item.id}
          className="absolute inset-0 rounded-2xl border bg-card p-6 shadow-lg"
          style={{ zIndex: stack.length - i }}
          initial={false}
          animate={{
            scale: 1 - i * 0.04,
            y: i * 10,
            opacity: 1 - i * 0.15,
          }}
          drag={i === 0 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={(_, info) => {
            if (Math.abs(info.offset.x) > 120) {
              removeTop(info.offset.x > 0 ? 1 : -1);
            }
          }}
          whileDrag={{ cursor: "grabbing", rotate: i === 0 ? 5 : 0 }}
        >
          {item.content}
        </motion.div>
      ))}
      {stack.length === 0 && (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          No more items
        </div>
      )}
    </div>
  );
}
