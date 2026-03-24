"use client";

import { useRef, useState, useCallback } from "react";
import { RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinViewerProps {
  images: string[];
  className?: string;
}

/**
 * 360° product spin viewer.
 * Drag horizontally to rotate through sequential product images.
 * Works with touch and mouse for cross-device support.
 */
export function SpinViewer({ images, className }: SpinViewerProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const lastX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalFrames = images.length;
  if (totalFrames === 0) return null;

  const handleStart = useCallback((clientX: number) => {
    setIsDragging(true);
    lastX.current = clientX;
  }, []);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging) return;
      const delta = clientX - lastX.current;
      const sensitivity = 5; // pixels per frame

      if (Math.abs(delta) >= sensitivity) {
        const frameDelta = Math.round(delta / sensitivity);
        setCurrentFrame((prev) => {
          let next = prev - frameDelta;
          while (next < 0) next += totalFrames;
          return next % totalFrames;
        });
        lastX.current = clientX;
      }
    },
    [isDragging, totalFrames]
  );

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-square cursor-grab select-none overflow-hidden rounded-xl bg-gray-100 active:cursor-grabbing",
        className
      )}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
    >
      {/* Current frame */}
      <img
        src={images[currentFrame]}
        alt={`Product view ${currentFrame + 1} of ${totalFrames}`}
        className="h-full w-full object-cover"
        draggable={false}
      />

      {/* Drag hint */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
        <RotateCw className="h-3 w-3" />
        Drag to rotate
      </div>

      {/* Frame indicator */}
      <div className="absolute right-3 top-3 rounded bg-black/50 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
        {currentFrame + 1}/{totalFrames}
      </div>
    </div>
  );
}
