"use client";

import { useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ElasticSliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  value?: number;
  onChange?: (value: number) => void;
  minLabel?: string;
  maxLabel?: string;
  formatValue?: (value: number) => string;
  className?: string;
}

/**
 * Range slider with elastic/rubbery thumb animation.
 * Thumb overshoots the target position and springs back.
 * Shows min/max labels and a current value tooltip above the thumb.
 */
export function ElasticSlider({
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 50,
  value: controlledValue,
  onChange,
  minLabel,
  maxLabel,
  formatValue = (v) => String(v),
  className,
}: ElasticSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : defaultValue;

  // Normalized position (0 to 1)
  const normalizedTarget = (currentValue - min) / (max - min);
  const rawX = useMotionValue(normalizedTarget);
  const springX = useSpring(rawX, { stiffness: 300, damping: 15, mass: 0.8 });

  // Convert spring position to percentage
  const thumbPercent = useTransform(springX, (v) => `${Math.max(0, Math.min(1, v)) * 100}%`);
  const fillPercent = useTransform(springX, (v) => `${Math.max(0, Math.min(1, v)) * 100}%`);

  // Value display from spring position
  const displayValue = useTransform(springX, (v) => {
    const clamped = Math.max(0, Math.min(1, v));
    const raw = min + clamped * (max - min);
    const stepped = Math.round(raw / step) * step;
    return formatValue(stepped);
  });

  const snapToValue = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const fraction = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const rawValue = min + fraction * (max - min);
      const snapped = Math.round(rawValue / step) * step;
      const clampedValue = Math.max(min, Math.min(max, snapped));
      const normalizedPos = (clampedValue - min) / (max - min);

      rawX.set(normalizedPos);
      onChange?.(clampedValue);
    },
    [min, max, step, rawX, onChange],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const element = e.currentTarget as HTMLElement;
      element.setPointerCapture(e.pointerId);
      snapToValue(e.clientX);

      const handleMove = (ev: PointerEvent) => snapToValue(ev.clientX);
      const handleUp = () => {
        element.removeEventListener("pointermove", handleMove);
        element.removeEventListener("pointerup", handleUp);
      };

      element.addEventListener("pointermove", handleMove);
      element.addEventListener("pointerup", handleUp);
    },
    [snapToValue],
  );

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {minLabel && (
        <span className="shrink-0 text-xs text-muted-foreground">{minLabel}</span>
      )}

      <div className="relative flex-1">
        {/* Tooltip */}
        <motion.div
          className="pointer-events-none absolute -top-9 flex -translate-x-1/2 items-center justify-center"
          style={{ left: thumbPercent }}
        >
          <span className="rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background">
            <motion.span>{displayValue}</motion.span>
          </span>
        </motion.div>

        {/* Track */}
        <div
          ref={trackRef}
          className="relative h-2 cursor-pointer rounded-full bg-muted"
          onPointerDown={handlePointerDown}
        >
          {/* Fill */}
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-primary"
            style={{ width: fillPercent }}
          />

          {/* Thumb */}
          <motion.div
            className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-background shadow-md transition-shadow hover:shadow-lg"
            style={{ left: thumbPercent }}
          />
        </div>
      </div>

      {maxLabel && (
        <span className="shrink-0 text-xs text-muted-foreground">{maxLabel}</span>
      )}
    </div>
  );
}
