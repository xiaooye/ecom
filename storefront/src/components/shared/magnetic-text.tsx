"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticTextProps {
  /** The text to render with magnetic character effect */
  text: string;
  /** HTML tag for the container (default: "h2") */
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  /** Magnetic attraction radius in px (default: 100) */
  radius?: number;
  /** Maximum displacement in px (default: 20) */
  strength?: number;
  /** Spring stiffness for the pull animation (default: 150) */
  stiffness?: number;
  /** Spring damping for the pull animation (default: 15) */
  damping?: number;
  className?: string;
  charClassName?: string;
}

interface CharState {
  x: number;
  y: number;
}

function MagneticChar({
  char,
  index,
  mousePos,
  radius,
  strength,
  stiffness,
  damping,
  charClassName,
}: {
  char: string;
  index: number;
  mousePos: React.RefObject<{ x: number; y: number } | null>;
  radius: number;
  strength: number;
  stiffness: number;
  damping: number;
  charClassName?: string;
}) {
  const charRef = useRef<HTMLSpanElement>(null);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const springX = useSpring(0, { stiffness, damping });
  const springY = useSpring(0, { stiffness, damping });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      const el = charRef.current;
      const mouse = mousePos.current;

      if (el && mouse) {
        const rect = el.getBoundingClientRect();
        const charCenterX = rect.left + rect.width / 2;
        const charCenterY = rect.top + rect.height / 2;

        const dx = mouse.x - charCenterX;
        const dy = mouse.y - charCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < radius) {
          // Attraction strength falls off with distance
          const factor = (1 - distance / radius) * strength;
          const angle = Math.atan2(dy, dx);
          targetX.current = Math.cos(angle) * factor;
          targetY.current = Math.sin(angle) * factor;
        } else {
          targetX.current = 0;
          targetY.current = 0;
        }
      } else {
        targetX.current = 0;
        targetY.current = 0;
      }

      springX.set(targetX.current);
      springY.set(targetY.current);

      rafRef.current = requestAnimationFrame(update);
    };

    // Only run on desktop
    if (typeof window !== "undefined" && !window.matchMedia("(pointer: coarse)").matches) {
      rafRef.current = requestAnimationFrame(update);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [radius, strength, springX, springY, mousePos]);

  if (char === " ") {
    return <span className="inline-block">&nbsp;</span>;
  }

  return (
    <motion.span
      ref={charRef}
      style={{ x: springX, y: springY }}
      className={cn(
        "inline-block cursor-default transition-colors will-change-transform",
        charClassName
      )}
    >
      {char}
    </motion.span>
  );
}

/**
 * Individual characters that are magnetically attracted to the cursor
 * when it is nearby. Characters shift toward the cursor and spring back
 * when it leaves. Creates a playful interactive heading.
 */
export function MagneticText({
  text,
  as: Tag = "h2",
  radius = 100,
  strength = 20,
  stiffness = 150,
  damping = 15,
  className,
  charClassName,
}: MagneticTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mousePos.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const chars = text.split("");

  return (
    <div ref={containerRef} className={cn("inline-block", className)}>
      <Tag className="flex flex-wrap">
        {chars.map((char, i) => (
          <MagneticChar
            key={`${i}-${char}`}
            char={char}
            index={i}
            mousePos={mousePos}
            radius={radius}
            strength={strength}
            stiffness={stiffness}
            damping={damping}
            charClassName={charClassName}
          />
        ))}
      </Tag>
    </div>
  );
}
