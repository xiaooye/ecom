"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SizeBodyChartProps {
  className?: string;
}

const measurements = [
  { id: "chest", label: "Chest", path: "M 85,80 Q 100,75 115,80 L 115,100 Q 100,95 85,100 Z", description: '38-40"' },
  { id: "waist", label: "Waist", path: "M 88,105 Q 100,100 112,105 L 112,120 Q 100,115 88,120 Z", description: '32-34"' },
  { id: "hips", label: "Hips", path: "M 82,125 Q 100,120 118,125 L 118,145 Q 100,140 82,145 Z", description: '38-40"' },
  { id: "inseam", label: "Inseam", path: "M 95,145 L 95,210 L 100,210 L 100,145 Z", description: '32"' },
];

/**
 * Interactive body outline SVG where hovering a measurement
 * highlights the corresponding area on the body.
 */
export function SizeBodyChart({ className }: SizeBodyChartProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className={cn("flex gap-8", className)}>
      {/* SVG body outline */}
      <div className="relative w-32 flex-shrink-0">
        <svg viewBox="60 20 80 210" className="h-64 w-full">
          {/* Head */}
          <circle cx="100" cy="35" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/40" />
          {/* Neck */}
          <line x1="100" y1="47" x2="100" y2="55" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/40" />
          {/* Torso */}
          <path d="M 85,55 L 75,70 L 65,95 L 70,95 L 85,80 L 85,145 L 82,145 L 82,210 L 95,210 L 95,145 L 100,145 L 105,145 L 105,210 L 118,210 L 118,145 L 115,145 L 115,80 L 130,95 L 135,95 L 125,70 L 115,55 Z"
            fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/40" />

          {/* Highlight areas */}
          {measurements.map((m) => (
            <path
              key={m.id}
              d={m.path}
              className={cn(
                "transition-all duration-200",
                hovered === m.id
                  ? "fill-primary/30 stroke-primary stroke-2"
                  : "fill-transparent stroke-transparent"
              )}
            />
          ))}
        </svg>
      </div>

      {/* Measurement list */}
      <div className="flex flex-col gap-2">
        {measurements.map((m) => (
          <button
            key={m.id}
            onMouseEnter={() => setHovered(m.id)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              "flex items-center justify-between rounded-lg border px-4 py-2.5 text-left text-sm transition-all",
              hovered === m.id
                ? "border-primary bg-primary/5 text-primary"
                : "border-transparent hover:bg-muted"
            )}
          >
            <span className="font-medium">{m.label}</span>
            <span className="text-muted-foreground">{m.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
