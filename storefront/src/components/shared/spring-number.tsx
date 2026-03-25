"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform, type SpringOptions } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpringNumberProps {
  /** The target numeric value */
  value: number;
  /** Spring stiffness (default: 100) */
  stiffness?: number;
  /** Spring damping (default: 30) */
  damping?: number;
  /** Spring mass (default: 1) */
  mass?: number;
  /** Number of decimal places to show (default: 0) */
  precision?: number;
  /** Formatter function applied to the animated number */
  formatter?: (n: number) => string;
  /** Optional prefix (e.g., "$") */
  prefix?: string;
  /** Optional suffix (e.g., "items") */
  suffix?: string;
  className?: string;
}

/**
 * Number that uses framer-motion spring physics for transitions.
 * When value changes, it springs to the new value with configurable
 * stiffness/damping. Useful for cart totals, prices that update.
 */
export function SpringNumber({
  value,
  stiffness = 100,
  damping = 30,
  mass = 1,
  precision = 0,
  formatter,
  prefix,
  suffix,
  className,
}: SpringNumberProps) {
  const springConfig: SpringOptions = {
    stiffness,
    damping,
    mass,
  };

  const springValue = useSpring(value, springConfig);

  const display = useTransform(springValue, (current) => {
    const rounded =
      precision > 0
        ? parseFloat(current.toFixed(precision))
        : Math.round(current);

    if (formatter) return formatter(rounded);
    return precision > 0 ? rounded.toFixed(precision) : rounded.toString();
  });

  // Update the spring when the target value changes
  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  return (
    <span className={cn("tabular-nums", className)}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}
