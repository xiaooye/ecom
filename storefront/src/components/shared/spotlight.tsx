"use client";

import { useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightProps {
  children: React.ReactNode;
  className?: string;
  size?: number;
}

/**
 * Container that renders a spotlight circle following the cursor.
 * Creates a dramatic reveal effect for hero sections and cards.
 */
export function Spotlight({
  children,
  className,
  size = 300,
}: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn("group relative overflow-hidden", className)}
    >
      <motion.div
        className="pointer-events-none absolute z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          width: size,
          height: size,
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          background: `radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)`,
          borderRadius: "50%",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
