"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type GradientPreset = "rainbow" | "sunset" | "ocean" | "forest";

interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  preset?: GradientPreset;
  speed?: number;
  borderWidth?: number;
  children: React.ReactNode;
  className?: string;
}

const presets: Record<GradientPreset, string[]> = {
  rainbow: ["#6366f1", "#8b5cf6", "#d946ef", "#f43f5e", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#6366f1"],
  sunset: ["#f97316", "#f43f5e", "#ec4899", "#a855f7", "#f97316"],
  ocean: ["#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#06b6d4"],
  forest: ["#22c55e", "#16a34a", "#15803d", "#065f46", "#14b8a6", "#22c55e"],
};

/**
 * Button with an animated rotating conic gradient border.
 * Inner content stays solid. Border is a rotating conic gradient.
 * Supports color presets: rainbow, sunset, ocean, forest.
 */
export function GradientButton({
  preset = "rainbow",
  speed = 3,
  borderWidth = 2,
  children,
  className,
  ...props
}: GradientButtonProps) {
  const colors = presets[preset];
  const gradient = `conic-gradient(${colors.join(", ")})`;

  return (
    <button
      className={cn("group relative inline-flex items-center justify-center overflow-hidden rounded-xl p-px", className)}
      {...props}
    >
      {/* Rotating gradient border */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: gradient,
          padding: borderWidth,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Faster spin on hover via a second layer */}
      <motion.div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: gradient }}
        animate={{ rotate: -360 }}
        transition={{
          duration: speed * 0.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Inner solid content */}
      <span
        className="relative z-10 flex items-center gap-2 rounded-[calc(0.75rem-1px)] bg-background px-6 py-2.5 text-sm font-medium transition-colors group-hover:bg-background/95"
        style={{
          margin: borderWidth,
        }}
      >
        {children}
      </span>
    </button>
  );
}
