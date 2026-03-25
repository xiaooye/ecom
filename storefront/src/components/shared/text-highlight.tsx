"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

type HighlightColor = "yellow" | "green" | "blue" | "pink" | "orange";

interface TextHighlightProps {
  children: string;
  highlight: string | string[];
  color?: HighlightColor;
  delay?: number;
  duration?: number;
  className?: string;
  as?: "p" | "span" | "h1" | "h2" | "h3" | "h4";
}

const colorMap: Record<HighlightColor, string> = {
  yellow: "bg-yellow-300/60 dark:bg-yellow-500/40",
  green: "bg-emerald-300/60 dark:bg-emerald-500/40",
  blue: "bg-blue-300/60 dark:bg-blue-500/40",
  pink: "bg-pink-300/60 dark:bg-pink-500/40",
  orange: "bg-orange-300/60 dark:bg-orange-500/40",
};

/**
 * Text with an animated marker/highlighter effect.
 * On scroll into view, a colored highlight draws behind specific words
 * using background-size animation from 0% to 100%.
 */
export function TextHighlight({
  children,
  highlight,
  color = "yellow",
  delay = 0,
  duration = 0.6,
  className,
  as: Tag = "p",
}: TextHighlightProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  const highlights = Array.isArray(highlight) ? highlight : [highlight];

  // Build segments of text, splitting by highlighted words
  const segments = splitTextByHighlights(children, highlights);

  return (
    <Tag ref={ref as React.Ref<HTMLParagraphElement>} className={cn("leading-relaxed", className)}>
      {segments.map((segment, i) => {
        if (segment.isHighlighted) {
          return (
            <HighlightedWord
              key={`${segment.text}-${i}`}
              color={color}
              isInView={isInView}
              delay={delay + i * 0.1}
              duration={duration}
            >
              {segment.text}
            </HighlightedWord>
          );
        }
        return <span key={`${segment.text}-${i}`}>{segment.text}</span>;
      })}
    </Tag>
  );
}

function HighlightedWord({
  children,
  color,
  isInView,
  delay,
  duration,
}: {
  children: string;
  color: HighlightColor;
  isInView: boolean;
  delay: number;
  duration: number;
}) {
  return (
    <span className="relative inline">
      <motion.span
        className={cn(
          "absolute inset-0 -mx-0.5 -my-0.5 rounded-sm px-0.5 py-0.5",
          colorMap[color],
        )}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration, delay, ease: "easeOut" }}
        style={{ transformOrigin: "left center" }}
      />
      <span className="relative">{children}</span>
    </span>
  );
}

interface Segment {
  text: string;
  isHighlighted: boolean;
}

function splitTextByHighlights(
  text: string,
  highlights: string[],
): Segment[] {
  if (highlights.length === 0) return [{ text, isHighlighted: false }];

  // Escape regex special chars
  const escaped = highlights.map((h) =>
    h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);

  return parts
    .filter((p) => p.length > 0)
    .map((part) => ({
      text: part,
      isHighlighted: highlights.some(
        (h) => h.toLowerCase() === part.toLowerCase(),
      ),
    }));
}
