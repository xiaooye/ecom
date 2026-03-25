"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface CanvasWatermarkProps {
  /** The image source URL to overlay the watermark on */
  src: string;
  /** Alt text for the image */
  alt: string;
  /** Watermark text to repeat across the image (default: "PREVIEW") */
  text?: string;
  /** Watermark text color (default: "rgba(0,0,0,0.15)") */
  color?: string;
  /** Global canvas opacity for the watermark layer (0-1, default: 1) */
  opacity?: number;
  /** Font size in px (default: 24) */
  fontSize?: number;
  /** Rotation angle in degrees (default: -45) */
  angle?: number;
  /** Gap between repeated watermark texts in px (default: 80) */
  gap?: number;
  className?: string;
}

/**
 * Canvas-based diagonal watermark text overlay for product images.
 * Renders text at a configurable angle repeated across the canvas.
 * Useful for "PREVIEW" or "SAMPLE" overlays on product images.
 */
export function CanvasWatermark({
  src,
  alt,
  text = "PREVIEW",
  color = "rgba(0,0,0,0.15)",
  opacity = 1,
  fontSize = 24,
  angle = -45,
  gap = 80,
  className,
}: CanvasWatermarkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = container.offsetWidth;
      const displayHeight = (img.height / img.width) * displayWidth;

      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      ctx.scale(dpr, dpr);

      // Draw the source image
      ctx.drawImage(img, 0, 0, displayWidth, displayHeight);

      // Draw watermark overlay
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const radians = (angle * Math.PI) / 180;

      // Calculate the diagonal to ensure full coverage when rotated
      const diagonal = Math.sqrt(
        displayWidth * displayWidth + displayHeight * displayHeight
      );
      const textWidth = ctx.measureText(text).width;
      const step = textWidth + gap;

      // Translate to center, rotate, then tile across the expanded area
      ctx.translate(displayWidth / 2, displayHeight / 2);
      ctx.rotate(radians);

      const halfDiag = diagonal / 2;
      const lineHeight = fontSize + gap;

      for (let y = -halfDiag; y < halfDiag; y += lineHeight) {
        for (let x = -halfDiag; x < halfDiag; x += step) {
          ctx.fillText(text, x, y);
        }
      }

      ctx.restore();
    };

    img.src = src;
  }, [src, text, color, opacity, fontSize, angle, gap]);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <canvas
        ref={canvasRef}
        className="w-full"
        role="img"
        aria-label={alt}
      />
    </div>
  );
}
