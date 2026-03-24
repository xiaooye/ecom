"use client";

import { useRef, useCallback, useState } from "react";
import { cn } from "@/lib/utils";

interface ColorWheelProps {
  size?: number;
  onColorSelect?: (color: string) => void;
  className?: string;
}

/**
 * Interactive HSL color wheel rendered on Canvas.
 * Click to pick a color — useful for custom product personalization.
 */
export function ColorWheel({
  size = 200,
  onColorSelect,
  className,
}: ColorWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Draw wheel on mount
  const drawWheel = useCallback(
    (canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size / 2 - 5;

      for (let angle = 0; angle < 360; angle++) {
        const startAngle = ((angle - 1) * Math.PI) / 180;
        const endAngle = ((angle + 1) * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = `hsl(${angle}, 100%, 50%)`;
        ctx.fill();
      }

      // White center
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.5, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
    },
    [size]
  );

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = `#${pixel[0].toString(16).padStart(2, "0")}${pixel[1].toString(16).padStart(2, "0")}${pixel[2].toString(16).padStart(2, "0")}`;

    setSelectedColor(hex);
    onColorSelect?.(hex);
  };

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <canvas
        ref={(el) => {
          if (el) {
            (canvasRef as React.MutableRefObject<HTMLCanvasElement>).current = el;
            el.width = size;
            el.height = size;
            drawWheel(el);
          }
        }}
        width={size}
        height={size}
        onClick={handleClick}
        className="cursor-crosshair rounded-full"
      />
      {selectedColor && (
        <div className="flex items-center gap-2">
          <div
            className="h-6 w-6 rounded-full border"
            style={{ backgroundColor: selectedColor }}
          />
          <span className="font-mono text-xs">{selectedColor}</span>
        </div>
      )}
    </div>
  );
}
