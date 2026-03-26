"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface PixelTransitionProps {
  /** Current image URL to display */
  src: string;
  /** Width of the canvas in CSS pixels */
  width: number;
  /** Height of the canvas in CSS pixels */
  height: number;
  className?: string;
  /** Pixel grid size (default 8) */
  pixelSize?: number;
  /** Transition duration in ms (default 800) */
  duration?: number;
  /** How far pixels scatter (default 60) */
  scatterDistance?: number;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

/**
 * Page/image transition where content dissolves into pixels that scatter,
 * then reform into the new content. Uses canvas for the pixel grid.
 *
 * When `src` changes, the old image dissolves into scattered pixels
 * and the new image re-forms from scattered pixels.
 */
export function PixelTransition({
  src,
  width,
  height,
  className,
  pixelSize = 8,
  duration = 800,
  scatterDistance = 60,
}: PixelTransitionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevSrcRef = useRef<string | null>(null);
  const animFrameRef = useRef(0);
  const [ready, setReady] = useState(false);

  /* Load an image and return its ImageData */
  const loadImageData = useCallback(
    (url: string): Promise<ImageData> =>
      new Promise((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const offscreen = document.createElement("canvas");
          offscreen.width = width;
          offscreen.height = height;
          const ctx = offscreen.getContext("2d");
          if (!ctx) return reject(new Error("No 2d context"));
          ctx.drawImage(img, 0, 0, width, height);
          resolve(ctx.getImageData(0, 0, width, height));
        };
        img.onerror = reject;
        img.src = url;
      }),
    [width, height],
  );

  /* Draw static image to canvas */
  const drawStatic = useCallback(
    (imageData: ImageData) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) return;
      ctx.putImageData(imageData, 0, 0);
    },
    [],
  );

  /* Animated pixel scatter/reform */
  const animate = useCallback(
    (fromData: ImageData, toData: ImageData) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) return;

      const cols = Math.ceil(width / pixelSize);
      const rows = Math.ceil(height / pixelSize);

      // Pre-compute random offsets for each pixel block
      const offsets: Array<{ dx: number; dy: number }> = [];
      for (let i = 0; i < cols * rows; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = scatterDistance * (0.5 + Math.random() * 0.5);
        offsets.push({ dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist });
      }

      const startTime = performance.now();
      const halfDur = duration / 2;

      const frame = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        ctx.clearRect(0, 0, width, height);

        // First half: scatter old, second half: reform new
        const isScatter = t < 0.5;
        const phase = isScatter ? t / 0.5 : (t - 0.5) / 0.5; // 0..1 within phase
        const eased = isScatter
          ? easeInCubic(phase)
          : 1 - easeInCubic(1 - phase);

        const sourceData = isScatter ? fromData : toData;

        let idx = 0;
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const sx = col * pixelSize;
            const sy = row * pixelSize;
            const pw = Math.min(pixelSize, width - sx);
            const ph = Math.min(pixelSize, height - sy);

            const { dx, dy } = offsets[idx];
            const scatter = isScatter ? eased : 1 - eased;

            const ox = sx + dx * scatter;
            const oy = sy + dy * scatter;
            const opacity = 1 - scatter * 0.6;

            // Sample colour from centre of pixel block
            const cx = Math.min(sx + Math.floor(pw / 2), width - 1);
            const cy = Math.min(sy + Math.floor(ph / 2), height - 1);
            const pi = (cy * width + cx) * 4;
            const r = sourceData.data[pi];
            const g = sourceData.data[pi + 1];
            const b = sourceData.data[pi + 2];
            const a = sourceData.data[pi + 3] / 255;

            ctx.globalAlpha = opacity * a;
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(Math.round(ox), Math.round(oy), pw, ph);

            idx++;
          }
        }

        ctx.globalAlpha = 1;

        if (t < 1) {
          animFrameRef.current = requestAnimationFrame(frame);
        } else {
          // Final: draw the new image cleanly
          ctx.putImageData(toData, 0, 0);
        }
      };

      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(frame);
    },
    [width, height, pixelSize, duration, scatterDistance],
  );

  /* React to src changes */
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const newData = await loadImageData(src);

        if (cancelled) return;

        if (prevSrcRef.current === null) {
          // First render — draw directly
          drawStatic(newData);
          setReady(true);
        } else if (prevSrcRef.current !== src) {
          const oldData = await loadImageData(prevSrcRef.current);
          if (cancelled) return;
          animate(oldData, newData);
        }

        prevSrcRef.current = src;
      } catch {
        // Fallback: if image fails, just clear
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, width, height);
      }
    };

    run();

    return () => {
      cancelled = true;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [src, loadImageData, drawStatic, animate, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={cn("block", !ready && "opacity-0", className)}
      style={{ width, height }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Easing                                                              */
/* ------------------------------------------------------------------ */

function easeInCubic(t: number) {
  return t * t * t;
}
