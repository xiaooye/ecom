"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCounterDigitsProps {
  value: number;
  className?: string;
  digitClassName?: string;
  duration?: number;
  prefix?: string;
  suffix?: string;
  padStart?: number;
}

/**
 * Slot-machine style animated counter.
 * Each digit is a vertical strip of 0–9 that scrolls (spins) to the target digit.
 * Pure CSS transforms — no canvas.
 */
export function AnimatedCounterDigits({
  value,
  className,
  digitClassName,
  duration = 600,
  prefix,
  suffix,
  padStart = 0,
}: AnimatedCounterDigitsProps) {
  const digits = String(Math.max(0, Math.floor(value))).padStart(
    padStart,
    "0",
  );

  return (
    <span
      className={cn("inline-flex items-center overflow-hidden", className)}
      aria-label={`${prefix ?? ""}${value}${suffix ?? ""}`}
    >
      {prefix && <span className="mr-0.5">{prefix}</span>}
      {digits.split("").map((d, i) => (
        <SlotDigit
          key={`${digits.length}-${i}`}
          digit={Number(d)}
          duration={duration}
          index={i}
          total={digits.length}
          className={digitClassName}
        />
      ))}
      {suffix && <span className="ml-0.5">{suffix}</span>}
    </span>
  );
}

/* ------------------------------------------------------------------ */

interface SlotDigitProps {
  digit: number;
  duration: number;
  index: number;
  total: number;
  className?: string;
}

function SlotDigit({ digit, duration, index, total, className }: SlotDigitProps) {
  const stripRef = useRef<HTMLSpanElement>(null);
  const prevDigit = useRef(digit);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (digit !== prevDigit.current) {
      setSpinning(true);
      const timeout = setTimeout(() => setSpinning(false), duration + 50);
      prevDigit.current = digit;
      return () => clearTimeout(timeout);
    }
  }, [digit, duration]);

  // stagger: rightmost digit spins first
  const stagger = (total - 1 - index) * 60;

  const DIGIT_ARRAY = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
  const digitHeight = "1em";

  return (
    <span
      className={cn(
        "relative inline-block overflow-hidden text-center",
        className,
      )}
      style={{
        height: digitHeight,
        width: "0.65em",
        lineHeight: digitHeight,
      }}
    >
      <span
        ref={stripRef}
        className="absolute left-0 top-0 w-full"
        style={{
          transform: `translateY(-${digit * 100}%)`,
          transition: spinning
            ? `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${stagger}ms`
            : "none",
        }}
      >
        {DIGIT_ARRAY.map((n) => (
          <span
            key={n}
            className="block w-full text-center"
            style={{ height: digitHeight, lineHeight: digitHeight }}
            aria-hidden
          >
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}
