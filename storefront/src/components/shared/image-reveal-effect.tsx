"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageRevealEffectProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  /** Colour of the curtain block (default primary via CSS var) */
  curtainColor?: string;
  /** Total duration in seconds (default 1.2) */
  duration?: number;
  /** Wipe direction */
  direction?: "left" | "right" | "top" | "bottom";
  /** Trigger once or every time it enters viewport */
  once?: boolean;
}

/**
 * Image that reveals with a coloured-block wipe effect when scrolled into view.
 * A solid-colour rectangle slides across (like a curtain), revealing the image
 * behind it.
 *
 * Sequence: block slides in covering full area -> image appears -> block slides out.
 */
export function ImageRevealEffect({
  src,
  alt,
  width,
  height,
  className,
  curtainColor = "hsl(var(--primary))",
  duration = 1.2,
  direction = "left",
  once = true,
}: ImageRevealEffectProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-60px" });

  const isHorizontal = direction === "left" || direction === "right";
  const axis = isHorizontal ? "X" : "Y";
  const sign = direction === "left" || direction === "top" ? -1 : 1;

  /* Phase 1: curtain enters covering the frame */
  /* Phase 2: curtain exits revealing the image */
  const curtainVariants = {
    hidden: {
      [isHorizontal ? "x" : "y"]: `${sign * -100}%`,
    },
    enter: {
      [isHorizontal ? "x" : "y"]: "0%",
      transition: { duration: duration * 0.5, ease: [0.65, 0, 0.35, 1] },
    },
    exit: {
      [isHorizontal ? "x" : "y"]: `${sign * 100}%`,
      transition: {
        duration: duration * 0.5,
        ease: [0.65, 0, 0.35, 1],
        delay: 0,
      },
    },
  };

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      style={{ aspectRatio: `${width}/${height}` }}
    >
      {/* Image (hidden until curtain covers, then revealed) */}
      <motion.div
        className="h-full w-full"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.01, delay: duration * 0.45 }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Curtain block */}
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: curtainColor }}
        initial="hidden"
        animate={isInView ? ["enter", "exit"] : "hidden"}
        variants={{
          hidden: {
            transform: `translate${axis}(${sign * -100}%)`,
          },
          enter: {
            transform: `translate${axis}(0%)`,
            transition: {
              duration: duration * 0.5,
              ease: [0.65, 0, 0.35, 1],
            },
          },
          exit: {
            transform: `translate${axis}(${sign * 100}%)`,
            transition: {
              duration: duration * 0.5,
              ease: [0.65, 0, 0.35, 1],
              delay: duration * 0.05,
            },
          },
        }}
      />
    </div>
  );
}
