"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Annotation {
  /** Horizontal position as percentage (0-100) */
  x: number;
  /** Vertical position as percentage (0-100) */
  y: number;
  /** Short label shown in the expanded bubble */
  label: string;
  /** Optional longer description */
  description?: string;
}

interface InteractiveShowcaseProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  annotations: Annotation[];
  className?: string;
}

/**
 * Product image with floating annotation bubbles. On hover,
 * each bubble expands to show a detail label (e.g., "Premium Cotton",
 * "Reinforced Stitching"). For product feature callouts.
 */
export function InteractiveShowcase({
  src,
  alt,
  width,
  height,
  annotations,
  className,
}: InteractiveShowcaseProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl", className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-auto w-full object-cover"
      />

      {annotations.map((annotation, i) => (
        <AnnotationBubble key={i} annotation={annotation} />
      ))}
    </div>
  );
}

function AnnotationBubble({ annotation }: { annotation: Annotation }) {
  const [isHovered, setIsHovered] = useState(false);

  // Determine which side to expand the label to avoid overflow
  const expandRight = annotation.x < 60;

  return (
    <div
      className="absolute z-10"
      style={{
        left: `${annotation.x}%`,
        top: `${annotation.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Pulsing dot */}
      <div className="relative">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40" />
        <button
          className="relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-primary text-[10px] font-bold text-primary-foreground shadow-lg"
          aria-label={annotation.label}
        >
          <span className="h-2 w-2 rounded-full bg-white" />
        </button>
      </div>

      {/* Expanded label */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={cn(
              "absolute top-full mt-2 w-max max-w-[200px] rounded-lg border bg-background/95 px-3 py-2 shadow-xl backdrop-blur-sm",
              expandRight ? "left-1/2 -translate-x-1/4" : "right-1/2 translate-x-1/4"
            )}
          >
            <p className="text-xs font-semibold">{annotation.label}</p>
            {annotation.description && (
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {annotation.description}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
