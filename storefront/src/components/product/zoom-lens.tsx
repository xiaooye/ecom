"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ZoomLensProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  zoomLevel?: number;
  lensSize?: number;
  className?: string;
}

/**
 * Magnifying glass zoom lens for product images.
 * Circular lens follows the cursor showing a zoomed-in area.
 * Desktop only — no lens on touch devices.
 */
export function ZoomLens({
  src,
  alt,
  width = 800,
  height = 800,
  zoomLevel = 2.5,
  lensSize = 180,
  className,
}: ZoomLensProps) {
  const [showLens, setShowLens] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [bgPos, setBgPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Lens position (centered on cursor)
      setLensPos({
        x: x - lensSize / 2,
        y: y - lensSize / 2,
      });

      // Background position for zoomed view
      const bgX = -(x * zoomLevel - lensSize / 2);
      const bgY = -(y * zoomLevel - lensSize / 2);
      setBgPos({ x: bgX, y: bgY });
    },
    [lensSize, zoomLevel]
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative cursor-none overflow-hidden", className)}
      onMouseEnter={() => setShowLens(true)}
      onMouseLeave={() => setShowLens(false)}
      onMouseMove={handleMouseMove}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-full w-full object-cover"
      />

      {showLens && (
        <div
          className="pointer-events-none absolute z-20 overflow-hidden rounded-full border-2 border-white/60 shadow-2xl"
          style={{
            width: lensSize,
            height: lensSize,
            left: lensPos.x,
            top: lensPos.y,
          }}
        >
          <div
            className="absolute"
            style={{
              width: (containerRef.current?.offsetWidth || width) * zoomLevel,
              height: (containerRef.current?.offsetHeight || height) * zoomLevel,
              left: bgPos.x,
              top: bgPos.y,
              backgroundImage: `url(${src})`,
              backgroundSize: "cover",
            }}
          />
        </div>
      )}
    </div>
  );
}
