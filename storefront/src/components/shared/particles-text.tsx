"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ParticlesTextProps {
  text: string;
  className?: string;
  particleSize?: number;
  particleColor?: string;
}

/**
 * Text rendered as individual particles on Canvas.
 * Particles scatter on hover and reform into text.
 * Uses Canvas2D text measurement for particle positioning.
 */
export function ParticlesText({
  text,
  className,
  particleSize = 2,
  particleColor = "#171717",
}: ParticlesTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    // Render text offscreen to get pixel positions
    ctx.font = "bold 48px sans-serif";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, w / 2, h / 2);

    const imageData = ctx.getImageData(0, 0, w * dpr, h * dpr);
    const particles: { x: number; y: number; ox: number; oy: number; vx: number; vy: number }[] = [];

    // Sample pixels to create particles
    for (let y = 0; y < h * dpr; y += particleSize * 2 * dpr) {
      for (let x = 0; x < w * dpr; x += particleSize * 2 * dpr) {
        const i = (y * w * dpr + x) * 4;
        if (imageData.data[i + 3] > 128) {
          const px = x / dpr;
          const py = y / dpr;
          particles.push({
            x: px, y: py,
            ox: px, oy: py,
            vx: 0, vy: 0,
          });
        }
      }
    }

    let mouseX = -1000;
    let mouseY = -1000;
    const mouseRadius = 60;

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const onLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = particleColor;

      for (const p of particles) {
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseRadius) {
          const force = (mouseRadius - dist) / mouseRadius;
          p.vx += (dx / dist) * force * 2;
          p.vy += (dy / dist) * force * 2;
        }

        // Spring back to origin
        p.vx += (p.ox - p.x) * 0.05;
        p.vy += (p.oy - p.y) * 0.05;
        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x += p.vx;
        p.y += p.vy;

        ctx.fillRect(p.x, p.y, particleSize, particleSize);
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [text, particleSize, particleColor]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("h-24 w-full", className)}
    />
  );
}
