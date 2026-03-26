"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface GalleryImage {
  url: string;
  alt?: string;
}

interface ProductZoomGalleryProps {
  images: GalleryImage[];
  title?: string;
  className?: string;
  /** Zoom magnification (default 2.5) */
  zoomLevel?: number;
  /** Width of the zoom panel in px (default 400) */
  zoomPanelWidth?: number;
}

/**
 * Amazon-style product image gallery with zoom-on-hover.
 * Layout: vertical thumbnails (left) | main image (centre) | zoom panel (right).
 * Moving the cursor over the main image shows a zoomed region in the side panel.
 */
export function ProductZoomGallery({
  images,
  title = "Product",
  className,
  zoomLevel = 2.5,
  zoomPanelWidth = 400,
}: ProductZoomGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0.5, y: 0.5 });
  const mainRef = useRef<HTMLDivElement>(null);

  const currentImage = images[selected];

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = mainRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      setLensPos({ x, y });
    },
    [],
  );

  if (!images.length) return null;

  // Lens indicator size (fraction of image)
  const lensFrac = 1 / zoomLevel;

  return (
    <div className={cn("flex gap-4", className)}>
      {/* ---- Thumbnails ---- */}
      <div className="flex w-16 shrink-0 flex-col gap-2 sm:w-20">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelected(i)}
            className={cn(
              "relative aspect-square w-full overflow-hidden rounded-lg border-2 transition-colors",
              i === selected
                ? "border-primary"
                : "border-transparent hover:border-muted-foreground/30",
            )}
          >
            <Image
              src={img.url}
              alt={img.alt ?? `${title} thumbnail ${i + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* ---- Main image ---- */}
      <div className="relative flex-1">
        <div
          ref={mainRef}
          className="relative aspect-square w-full cursor-crosshair overflow-hidden rounded-xl bg-muted"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onMouseMove={handleMouseMove}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              className="relative h-full w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src={currentImage.url}
                alt={currentImage.alt ?? `${title} image ${selected + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Lens highlight box */}
          {hovering && (
            <div
              className="pointer-events-none absolute border-2 border-primary/50 bg-primary/10"
              style={{
                width: `${lensFrac * 100}%`,
                height: `${lensFrac * 100}%`,
                left: `${Math.max(0, Math.min(1 - lensFrac, lensPos.x - lensFrac / 2)) * 100}%`,
                top: `${Math.max(0, Math.min(1 - lensFrac, lensPos.y - lensFrac / 2)) * 100}%`,
              }}
            />
          )}
        </div>
      </div>

      {/* ---- Zoom panel ---- */}
      <AnimatePresence>
        {hovering && (
          <motion.div
            className="hidden shrink-0 overflow-hidden rounded-xl border bg-muted lg:block"
            style={{ width: zoomPanelWidth, height: zoomPanelWidth }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
          >
            <div
              className="relative h-full w-full"
              style={{
                backgroundImage: `url(${currentImage.url})`,
                backgroundSize: `${zoomLevel * 100}%`,
                backgroundPosition: `${lensPos.x * 100}% ${lensPos.y * 100}%`,
                backgroundRepeat: "no-repeat",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
