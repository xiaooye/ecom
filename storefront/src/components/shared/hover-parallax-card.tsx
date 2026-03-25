"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface HoverParallaxCardProps {
  backgroundSrc: string;
  backgroundAlt?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  /** Maximum pixel shift for the parallax effect. Default 20. */
  intensity?: number;
}

/**
 * Card where the background image and foreground text move at different speeds
 * on mouse hover, creating a parallax depth effect within the card boundaries.
 */
export function HoverParallaxCard({
  backgroundSrc,
  backgroundAlt = "",
  title,
  subtitle,
  children,
  className,
  intensity = 20,
}: HoverParallaxCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Raw mouse position relative to card center (normalized -1 to 1)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Smooth springs
  const springConfig = { stiffness: 200, damping: 25 };
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);

  // Background moves in opposite direction (further = slower feeling)
  const bgX = useTransform(x, [-1, 1], [intensity, -intensity]);
  const bgY = useTransform(y, [-1, 1], [intensity, -intensity]);

  // Foreground moves in the same direction but less (closer = faster feeling)
  const fgX = useTransform(x, [-1, 1], [-intensity * 0.5, intensity * 0.5]);
  const fgY = useTransform(y, [-1, 1], [-intensity * 0.5, intensity * 0.5]);

  // Subtle 3D tilt
  const rotateX = useTransform(y, [-1, 1], [4, -4]);
  const rotateY = useTransform(x, [-1, 1], [-4, 4]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    rawX.set(nx);
    rawY.set(ny);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card shadow-lg",
        className,
      )}
      style={{
        perspective: "800px",
        rotateX,
        rotateY,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background image layer */}
      <motion.div
        className="absolute inset-0 -m-4"
        style={{ x: bgX, y: bgY }}
      >
        <Image
          src={backgroundSrc}
          alt={backgroundAlt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      {/* Foreground text layer */}
      <motion.div
        className="relative z-10 flex min-h-[280px] flex-col justify-end p-6"
        style={{ x: fgX, y: fgY }}
      >
        <h3 className="text-xl font-bold text-white">{title}</h3>
        {subtitle && (
          <p className="mt-1 text-sm text-white/80">{subtitle}</p>
        )}
        {children && <div className="mt-4">{children}</div>}
      </motion.div>
    </motion.div>
  );
}
