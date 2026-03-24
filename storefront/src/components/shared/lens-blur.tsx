"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LensBlurProps {
  children: React.ReactNode;
  className?: string;
  lensSize?: number;
}

/**
 * Content that is blurred except where the cursor is.
 * Creates a "discover" lens effect revealing content under cursor.
 */
export function LensBlur({
  children,
  className,
  lensSize = 200,
}: LensBlurProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -500, y: -500 });
  const [active, setActive] = useState(false);

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      onMouseMove={handleMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      {/* Blurred layer */}
      <div className={cn("transition-[filter] duration-300", active ? "blur-sm" : "")}>
        {children}
      </div>

      {/* Clear lens hole */}
      {active && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            clipPath: `circle(${lensSize / 2}px at ${pos.x}px ${pos.y}px)`,
          }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
