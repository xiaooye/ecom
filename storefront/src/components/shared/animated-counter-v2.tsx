"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCounterV2Props {
  value: number;
  duration?: number;
  className?: string;
}

/**
 * Odometer-style counter where each digit rolls independently
 * in a vertical strip, like a mechanical counter.
 * Uses CSS overflow hidden and translateY transitions.
 */
export function AnimatedCounterV2({
  value,
  duration = 1000,
  className,
}: AnimatedCounterV2Props) {
  const digits = String(Math.abs(Math.floor(value))).split("");
  const isNegative = value < 0;

  return (
    <span
      className={cn("inline-flex items-center overflow-hidden", className)}
      aria-label={String(value)}
    >
      {isNegative && <span className="inline-block">-</span>}
      {digits.map((digit, i) => (
        <DigitStrip key={digits.length - i} digit={parseInt(digit)} duration={duration} index={i} />
      ))}
    </span>
  );
}

interface DigitStripProps {
  digit: number;
  duration: number;
  index: number;
}

function DigitStrip({ digit, duration, index }: DigitStripProps) {
  const stripRef = useRef<HTMLSpanElement>(null);
  const [currentDigit, setCurrentDigit] = useState(digit);
  const prevDigitRef = useRef(digit);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (digit === prevDigitRef.current) return;

    setIsAnimating(true);
    prevDigitRef.current = digit;

    // Stagger each digit slightly based on position
    const delay = index * 60;
    const timer = setTimeout(() => {
      setCurrentDigit(digit);
    }, delay);

    const animTimer = setTimeout(() => {
      setIsAnimating(false);
    }, duration + delay);

    return () => {
      clearTimeout(timer);
      clearTimeout(animTimer);
    };
  }, [digit, duration, index]);

  // On first mount, animate from 0 to the initial digit
  useEffect(() => {
    const delay = index * 60;
    const timer = setTimeout(() => {
      setIsAnimating(true);
      setCurrentDigit(digit);
    }, delay);

    const animTimer = setTimeout(() => {
      setIsAnimating(false);
    }, duration + delay);

    return () => {
      clearTimeout(timer);
      clearTimeout(animTimer);
    };
    // Only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span
      ref={stripRef}
      className="relative inline-block overflow-hidden"
      style={{ height: "1em", width: "0.65em" }}
    >
      <span
        className="absolute left-0 top-0 flex flex-col"
        style={{
          transform: `translateY(${-currentDigit * 100}%)`,
          transition: isAnimating
            ? `transform ${duration}ms cubic-bezier(0.23, 1, 0.32, 1)`
            : "none",
          willChange: "transform",
        }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className="flex items-center justify-center"
            style={{ height: "1em", lineHeight: "1em" }}
            aria-hidden={i !== currentDigit}
          >
            {i}
          </span>
        ))}
      </span>
    </span>
  );
}
