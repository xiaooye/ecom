"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface HoverCardEffectProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card with spotlight hover effect.
 * Creates a radial gradient light that follows the cursor.
 */
export function HoverCardEffect({
  children,
  className,
}: HoverCardEffectProps) {
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
      className={cn("group relative overflow-hidden rounded-xl border", className)}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(var(--primary-rgb, 0 0 0) / 0.06), transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
