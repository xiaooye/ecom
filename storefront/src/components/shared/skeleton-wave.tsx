"use client";

import {
  createContext,
  useContext,
  useId,
  type ReactNode,
  type CSSProperties,
} from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Context – every SkeletonWaveItem in a group shares the same id     */
/* ------------------------------------------------------------------ */

interface WaveCtx {
  groupId: string;
  speed: number;
  color: string;
  highlightColor: string;
}

const WaveContext = createContext<WaveCtx>({
  groupId: "skw",
  speed: 1.6,
  color: "hsl(var(--accent))",
  highlightColor: "hsl(var(--accent) / 0.5)",
});

/* ------------------------------------------------------------------ */
/* Group                                                               */
/* ------------------------------------------------------------------ */

interface SkeletonWaveGroupProps {
  children: ReactNode;
  className?: string;
  /** Wave animation duration in seconds (default 1.6) */
  speed?: number;
  /** Base skeleton colour */
  color?: string;
  /** Shimmer highlight colour */
  highlightColor?: string;
}

/**
 * Group wrapper that makes all child `SkeletonWaveItem` shimmer in unison.
 * A single gradient sweep travels across the entire group simultaneously.
 */
export function SkeletonWaveGroup({
  children,
  className,
  speed = 1.6,
  color = "hsl(var(--accent))",
  highlightColor = "hsl(var(--accent) / 0.5)",
}: SkeletonWaveGroupProps) {
  const groupId = useId().replace(/:/g, "");

  // Static CSS keyframe — no user input involved
  const keyframeCSS = `@keyframes skeletonWave_${groupId}{0%{background-position:200% 0}100%{background-position:-200% 0}}`;

  return (
    <WaveContext.Provider value={{ groupId, speed, color, highlightColor }}>
      <div className={cn("relative", className)}>
        {children}

        {/* eslint-disable-next-line react/no-danger -- static CSS keyframes with auto-generated React id */}
        <style dangerouslySetInnerHTML={{ __html: keyframeCSS }} />
      </div>
    </WaveContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Item                                                                */
/* ------------------------------------------------------------------ */

interface SkeletonWaveItemProps {
  className?: string;
  style?: CSSProperties;
  /** Border radius override */
  rounded?: string;
}

/**
 * Individual skeleton bar/block that participates in the group wave.
 * Uses a fixed-position gradient so every item in the group shows the
 * same wave position — creating a unified shimmer across all items.
 */
export function SkeletonWaveItem({
  className,
  style,
  rounded = "rounded-md",
}: SkeletonWaveItemProps) {
  const { groupId, speed, color, highlightColor } = useContext(WaveContext);

  return (
    <div
      className={cn(rounded, className)}
      style={{
        backgroundImage: `linear-gradient(
          90deg,
          ${color} 0%,
          ${highlightColor} 40%,
          ${highlightColor} 60%,
          ${color} 100%
        )`,
        backgroundSize: "400% 100%",
        animation: `skeletonWave_${groupId} ${speed}s ease-in-out infinite`,
        ...style,
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Prebuilt card skeleton using the wave system                        */
/* ------------------------------------------------------------------ */

interface SkeletonWaveCardProps {
  lines?: number;
  className?: string;
}

/**
 * Convenience: a card-shaped skeleton (image + text lines)
 * already wrapped in a SkeletonWaveGroup.
 */
export function SkeletonWaveCard({ lines = 3, className }: SkeletonWaveCardProps) {
  return (
    <SkeletonWaveGroup className={cn("space-y-3", className)}>
      <SkeletonWaveItem className="aspect-[3/4] w-full" rounded="rounded-xl" />
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonWaveItem
          key={i}
          className="h-4"
          style={{ width: `${100 - i * 20}%` }}
        />
      ))}
    </SkeletonWaveGroup>
  );
}
