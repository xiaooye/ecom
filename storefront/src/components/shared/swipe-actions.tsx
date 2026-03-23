"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwipeActionsProps {
  children: React.ReactNode;
  onDelete?: () => void;
  className?: string;
}

/**
 * Swipe-to-reveal-delete gesture for list items.
 * Swipe left to reveal red delete area, release past threshold to delete.
 */
export function SwipeActions({
  children,
  onDelete,
  className,
}: SwipeActionsProps) {
  const x = useMotionValue(0);
  const controls = useAnimation();
  const deleteOpacity = useTransform(x, [-120, -60], [1, 0]);

  const handleDragEnd = async () => {
    const currentX = x.get();
    if (currentX < -100 && onDelete) {
      await controls.start({ x: -300, opacity: 0, height: 0 });
      onDelete();
    } else {
      controls.start({ x: 0 });
    }
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Delete background */}
      <motion.div
        className="absolute inset-y-0 right-0 flex w-24 items-center justify-center bg-destructive text-white"
        style={{ opacity: deleteOpacity }}
      >
        <Trash2 className="h-5 w-5" />
      </motion.div>

      {/* Swipeable content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -120, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        className="relative z-10 bg-background"
      >
        {children}
      </motion.div>
    </div>
  );
}
