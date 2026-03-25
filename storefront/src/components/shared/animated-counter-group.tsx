"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatItem {
  /** The target number to count up to */
  end: number;
  /** Text before the number, e.g. "$" */
  prefix?: string;
  /** Text after the number, e.g. "K+", "%", "+" */
  suffix?: string;
  /** Label below the number */
  label: string;
  /** Number of decimal places (default 0) */
  decimals?: number;
}

interface AnimatedCounterGroupProps {
  stats: StatItem[];
  className?: string;
  /** Animation duration in seconds */
  duration?: number;
  /** Separator between stats */
  separator?: boolean;
}

/**
 * A row of stat counters (like "50K+ Customers | 200+ Products | 4.9 Rating")
 * that animate when scrolled into view with configurable prefix/suffix
 * and number formatting.
 */
export function AnimatedCounterGroup({
  stats,
  className,
  duration = 2,
  separator = true,
}: AnimatedCounterGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={cn(
        "flex flex-wrap items-center justify-center gap-8 md:gap-12",
        className
      )}
    >
      {stats.map((stat, i) => (
        <div key={stat.label} className="flex items-center gap-8 md:gap-12">
          <CounterItem stat={stat} isInView={isInView} duration={duration} />
          {separator && i < stats.length - 1 && (
            <div className="hidden h-12 w-px bg-border md:block" />
          )}
        </div>
      ))}
    </motion.div>
  );
}

interface CounterItemProps {
  stat: StatItem;
  isInView: boolean;
  duration: number;
}

function CounterItem({ stat, isInView, duration }: CounterItemProps) {
  const [count, setCount] = useState(0);
  const decimals = stat.decimals ?? 0;

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let rafId: number;

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * stat.end);

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, stat.end, duration]);

  const formatted =
    decimals > 0
      ? count.toFixed(decimals)
      : Math.floor(count).toLocaleString();

  return (
    <div className="text-center">
      <p className="text-3xl font-bold tracking-tight md:text-4xl">
        {stat.prefix}
        {formatted}
        {stat.suffix}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
    </div>
  );
}
