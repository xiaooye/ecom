"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface CursorTrailProps {
  /** Maximum number of trail points (default: 20) */
  trailLength?: number;
  /** Maximum circle radius in px (default: 8) */
  size?: number;
  /** Trail color as CSS color string (default: "rgba(99,102,241,0.6)") */
  color?: string;
  /** How quickly trail fades: 0-1 where higher = faster decay (default: 0.05) */
  decaySpeed?: number;
  className?: string;
}

interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
}

/**
 * Canvas-based cursor trail that draws fading circles behind the mouse.
 * Creates a comet-tail effect. Configurable trail length, size, color,
 * and decay speed. Automatically hidden on touch/mobile devices.
 */
export function CursorTrail({
  trailLength = 20,
  size = 8,
  color = "rgba(99,102,241,0.6)",
  decaySpeed = 0.05,
  className,
}: CursorTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const trail: TrailPoint[] = [];
    let animId: number;
    let mouseX = -100;
    let mouseY = -100;
    let isActive = false;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    const parseColor = (
      cssColor: string
    ): { r: number; g: number; b: number; a: number } => {
      // Parse rgba(r,g,b,a) format
      const rgbaMatch = cssColor.match(
        /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\s*\)/
      );
      if (rgbaMatch) {
        return {
          r: parseFloat(rgbaMatch[1]),
          g: parseFloat(rgbaMatch[2]),
          b: parseFloat(rgbaMatch[3]),
          a: rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1,
        };
      }
      // Fallback: indigo-ish
      return { r: 99, g: 102, b: 241, a: 0.6 };
    };

    const parsed = parseColor(color);

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Reset transform for clearing (in case dpr scaling is still applied)
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const dpr = window.devicePixelRatio || 1;
      ctx.scale(dpr, dpr);

      if (isActive) {
        // Add new point at current mouse position
        trail.push({ x: mouseX, y: mouseY, alpha: 1 });
      }

      // Limit trail length
      while (trail.length > trailLength) {
        trail.shift();
      }

      // Decay and draw
      for (let i = trail.length - 1; i >= 0; i--) {
        const point = trail[i];
        point.alpha -= decaySpeed;

        if (point.alpha <= 0) {
          trail.splice(i, 1);
          continue;
        }

        // Size based on position in trail (newest = largest)
        const progress = i / trail.length;
        const radius = size * progress;
        const alpha = point.alpha * parsed.a;

        ctx.beginPath();
        ctx.arc(point.x, point.y, Math.max(radius, 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${parsed.r},${parsed.g},${parsed.b},${alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isActive = true;
    };

    const handleMouseLeave = () => {
      isActive = false;
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [trailLength, size, color, decaySpeed]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "pointer-events-none fixed inset-0 z-[9999] hidden md:block",
        className
      )}
      aria-hidden="true"
    />
  );
}
