"use client";

import { cn } from "@/lib/utils";

type ColorScheme = "purple" | "ocean" | "sunset" | "forest" | "custom";

interface GradientMeshBgProps {
  className?: string;
  /** Predefined colour scheme or "custom" with `customColors` */
  scheme?: ColorScheme;
  customColors?: string[];
  /** Animation speed multiplier (default 1) */
  speed?: number;
}

const SCHEMES: Record<Exclude<ColorScheme, "custom">, string[]> = {
  purple: ["#a78bfa", "#c084fc", "#818cf8", "#6366f1", "#a855f7"],
  ocean: ["#22d3ee", "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1"],
  sunset: ["#f97316", "#fb923c", "#f59e0b", "#ef4444", "#ec4899"],
  forest: ["#22c55e", "#16a34a", "#84cc16", "#10b981", "#059669"],
};

/**
 * CSS-only animated mesh gradient background.
 * Multiple overlapping radial gradients drift on independent keyframe loops.
 * No canvas — pure CSS animations.
 */
export function GradientMeshBg({
  className,
  scheme = "purple",
  customColors,
  speed = 1,
}: GradientMeshBgProps) {
  const colors =
    scheme === "custom" && customColors?.length
      ? customColors
      : SCHEMES[scheme === "custom" ? "purple" : scheme];

  const baseMs = 20000 / speed;

  // Build keyframe CSS — all values are hardcoded, no user input
  const keyframesCSS = [
    "@keyframes meshBlob0{0%{transform:translate(0%,0%) scale(1)}100%{transform:translate(30%,-20%) scale(1.15)}}",
    "@keyframes meshBlob1{0%{transform:translate(0%,0%) scale(1.1)}100%{transform:translate(-25%,30%) scale(0.9)}}",
    "@keyframes meshBlob2{0%{transform:translate(0%,0%) scale(0.95)}100%{transform:translate(20%,25%) scale(1.2)}}",
    "@keyframes meshBlob3{0%{transform:translate(0%,0%) scale(1.05)}100%{transform:translate(-30%,-15%) scale(0.85)}}",
    "@keyframes meshBlob4{0%{transform:translate(0%,0%) scale(1)}100%{transform:translate(15%,-30%) scale(1.1)}}",
  ].join("");

  return (
    <div
      className={cn("absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      {/* background fill */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${colors[0]}44, ${colors[colors.length - 1]}44)`,
        }}
      />

      {/* floating blobs */}
      {colors.map((color, i) => {
        const size = 50 + (i % 3) * 15;
        const dur = baseMs + i * 3000;

        return (
          <div
            key={`blob-${i}`}
            className="absolute rounded-full blur-3xl"
            style={{
              width: `${size}%`,
              height: `${size}%`,
              background: `radial-gradient(circle, ${color}88 0%, transparent 70%)`,
              animation: `meshBlob${i % 5} ${dur}ms ease-in-out infinite alternate`,
              left: `${(i * 23) % 80}%`,
              top: `${(i * 31) % 70}%`,
              opacity: 0.7,
            }}
          />
        );
      })}

      <style dangerouslySetInnerHTML={{ __html: keyframesCSS }} />
    </div>
  );
}
