"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealScrollProps {
  text: string;
  className?: string;
  textClassName?: string;
  /** How much viewport height the animation occupies (default 2 = 200vh) */
  heightMultiplier?: number;
  /** Color for unread words */
  dimColor?: string;
  /** Color for revealed words */
  revealColor?: string;
}

/**
 * Text where each word's opacity is driven by scroll position.
 * Words start dim/transparent and become fully opaque one-by-one
 * as the user scrolls through the section. Wrap in a tall container
 * to give the scroll range.
 */
export function TextRevealScroll({
  text,
  className,
  textClassName,
  heightMultiplier = 2,
  dimColor = "rgba(var(--foreground-rgb, 0 0 0) / 0.15)",
  revealColor = "rgb(var(--foreground-rgb, 0 0 0))",
}: TextRevealScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const words = text.split(/\s+/).filter(Boolean);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"],
  });

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{ minHeight: `${heightMultiplier * 100}vh` }}
    >
      <div className="sticky top-1/2 -translate-y-1/2 px-4">
        <p
          className={cn(
            "mx-auto max-w-3xl text-2xl font-medium leading-relaxed sm:text-3xl md:text-4xl lg:text-5xl",
            textClassName,
          )}
        >
          {words.map((word, i) => (
            <Word
              key={`${word}-${i}`}
              word={word}
              index={i}
              total={words.length}
              progress={scrollYProgress}
              dimColor={dimColor}
              revealColor={revealColor}
            />
          ))}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

interface WordProps {
  word: string;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  dimColor: string;
  revealColor: string;
}

function Word({ word, index, total, progress, dimColor, revealColor }: WordProps) {
  const start = index / total;
  const end = (index + 1) / total;

  const opacity = useTransform(progress, [start, end], [0.15, 1]);
  const color = useTransform(progress, [start, end], [dimColor, revealColor]);

  return (
    <motion.span
      className="mr-[0.25em] inline-block"
      style={{ opacity, color }}
    >
      {word}
    </motion.span>
  );
}
