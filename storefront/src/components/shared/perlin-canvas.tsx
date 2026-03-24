"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface PerlinCanvasProps {
  className?: string;
  scale?: number;
  speed?: number;
  opacity?: number;
  color?: [number, number, number];
}

// Simple Perlin noise implementation (no WASM deps — pure JS for portability)
function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(a: number, b: number, t: number) { return a + t * (b - a); }

function makeGrad() {
  const p = new Uint8Array(512);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 256; i++) p[i + 256] = p[i];
  return p;
}

function grad(hash: number, x: number, y: number) {
  const h = hash & 3;
  const u = h < 2 ? x : y;
  const v = h < 2 ? y : x;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

function noise2d(perm: Uint8Array, x: number, y: number): number {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u = fade(xf);
  const v = fade(yf);

  const aa = perm[perm[X] + Y];
  const ab = perm[perm[X] + Y + 1];
  const ba = perm[perm[X + 1] + Y];
  const bb = perm[perm[X + 1] + Y + 1];

  return lerp(
    lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
    lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
    v
  );
}

/**
 * Animated Perlin noise background rendered on Canvas.
 * Creates organic, flowing cloud-like texture at 60fps.
 * Pure JavaScript noise — no WASM binary needed.
 */
export function PerlinCanvas({
  className,
  scale = 0.005,
  speed = 0.5,
  opacity = 0.15,
  color = [100, 100, 255],
}: PerlinCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const perm = makeGrad();
    let animId: number;
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      time += speed * 0.01;

      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;

      // Sample every 4th pixel for performance, then fill
      for (let y = 0; y < h; y += 2) {
        for (let x = 0; x < w; x += 2) {
          const n = (noise2d(perm, x * scale + time, y * scale + time * 0.5) + 1) / 2;
          const val = Math.floor(n * 255);

          // Fill 2x2 block
          for (let dy = 0; dy < 2 && y + dy < h; dy++) {
            for (let dx = 0; dx < 2 && x + dx < w; dx++) {
              const idx = ((y + dy) * w + (x + dx)) * 4;
              data[idx] = color[0];
              data[idx + 1] = color[1];
              data[idx + 2] = color[2];
              data[idx + 3] = Math.floor(val * opacity);
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [scale, speed, opacity, color]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
