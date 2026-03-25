"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  maxShift?: number;
  glowColor?: string;
  glowSize?: number;
}

/**
 * Card that tilts and shifts toward the cursor position with a colored
 * gradient light following the mouse. Combines TiltCard and HoverCardEffect
 * concepts into one polished component with spring physics.
 */
export function MagneticCard({
  children,
  className,
  maxTilt = 10,
  maxShift = 6,
  glowColor = "rgba(120, 119, 198, 0.3)",
  glowSize = 350,
}: MagneticCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Raw mouse position as a ratio [-0.5, 0.5]
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Raw pixel position for the gradient spotlight
  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);

  // Spring-based tilt
  const springConfig = { stiffness: 260, damping: 20, mass: 0.8 };

  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [maxTilt, -maxTilt]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-maxTilt, maxTilt]),
    springConfig
  );

  // Spring-based shift (card moves toward cursor)
  const translateX = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-maxShift, maxShift]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [-maxShift, maxShift]),
    springConfig
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(xRatio);
    mouseY.set(yRatio);
    spotX.set(e.clientX - rect.left);
    spotY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        x: translateX,
        y: translateY,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card will-change-transform",
        className
      )}
    >
      {/* Gradient spotlight overlay */}
      <motion.div
        className="pointer-events-none absolute -inset-px z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [spotX, spotY],
            ([x, y]) =>
              `radial-gradient(${glowSize}px circle at ${x}px ${y}px, ${glowColor}, transparent 60%)`
          ),
        }}
      />

      {/* Content above the glow */}
      <div className="relative z-10" style={{ transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
}
