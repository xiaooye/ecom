"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TrailImage {
  id: number;
  x: number;
  y: number;
  src: string;
}

interface ImageTrailProps {
  images: string[];
  className?: string;
}

/**
 * Mouse trail that spawns product images behind the cursor.
 * Creates an engaging interactive gallery experience.
 */
export function ImageTrail({ images, className }: ImageTrailProps) {
  const [trail, setTrail] = useState<TrailImage[]>([]);
  const counter = useRef(0);
  const lastSpawn = useRef(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const now = Date.now();
      if (now - lastSpawn.current < 100) return; // throttle
      lastSpawn.current = now;

      const rect = e.currentTarget.getBoundingClientRect();
      const img: TrailImage = {
        id: counter.current++,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        src: images[counter.current % images.length],
      };

      setTrail((prev) => [...prev.slice(-8), img]);
      setTimeout(() => {
        setTrail((prev) => prev.filter((t) => t.id !== img.id));
      }, 1000);
    },
    [images]
  );

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onMouseMove={handleMouseMove}
    >
      <AnimatePresence>
        {trail.map((img) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 1, scale: 0.5, rotate: Math.random() * 20 - 10 }}
            animate={{ opacity: 0.8, scale: 1 }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.8 }}
            className="pointer-events-none absolute z-0 h-24 w-20 overflow-hidden rounded-lg shadow-lg"
            style={{
              left: img.x - 40,
              top: img.y - 48,
            }}
          >
            <img
              src={img.src}
              alt=""
              className="h-full w-full object-cover"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
