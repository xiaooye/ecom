"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface MeshGradientProps {
  className?: string;
  colors?: string[];
  speed?: number;
}

/**
 * Animated mesh gradient background rendered on Canvas.
 * Creates a slowly morphing multi-color gradient effect
 * similar to Apple's mesh gradient backgrounds.
 */
export function MeshGradient({
  className,
  colors = ["#a78bfa", "#818cf8", "#6366f1", "#4f46e5", "#4338ca"],
  speed = 0.002,
}: MeshGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    interface Blob {
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
    }

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const blobs: Blob[] = colors.map((color, i) => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      radius: Math.max(canvas.offsetWidth, canvas.offsetHeight) * (0.3 + Math.random() * 0.3),
      color,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));

    const draw = () => {
      time += speed;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.clearRect(0, 0, w, h);

      for (const blob of blobs) {
        blob.x += blob.vx + Math.sin(time + blob.vx * 10) * 0.3;
        blob.y += blob.vy + Math.cos(time + blob.vy * 10) * 0.3;

        // Bounce off edges
        if (blob.x < -blob.radius * 0.5) blob.vx = Math.abs(blob.vx);
        if (blob.x > w + blob.radius * 0.5) blob.vx = -Math.abs(blob.vx);
        if (blob.y < -blob.radius * 0.5) blob.vy = Math.abs(blob.vy);
        if (blob.y > h + blob.radius * 0.5) blob.vy = -Math.abs(blob.vy);

        const gradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.radius
        );
        gradient.addColorStop(0, blob.color + "99");
        gradient.addColorStop(1, blob.color + "00");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [colors, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className
      )}
    />
  );
}
