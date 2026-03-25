"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  date?: string;
  icon?: React.ReactNode;
}

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

/**
 * Vertical timeline with an animated connecting line that draws as the user scrolls.
 * Each event node scales in when reaching viewport center.
 * Alternating left/right layout on desktop, single column on mobile.
 */
export function Timeline({ events, className }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 60%"],
  });

  // Line height draws from 0% to 100% as user scrolls through the container
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Center line (static background) */}
      <div className="absolute left-4 top-0 h-full w-0.5 bg-muted md:left-1/2 md:-translate-x-px" />

      {/* Animated drawn line */}
      <motion.div
        className="absolute left-4 top-0 w-0.5 bg-primary md:left-1/2 md:-translate-x-px"
        style={{ height: lineHeight }}
      />

      {/* Events */}
      <div className="space-y-12">
        {events.map((event, i) => (
          <TimelineItem
            key={event.id}
            event={event}
            index={i}
            isEven={i % 2 === 0}
          />
        ))}
      </div>
    </div>
  );
}

function TimelineItem({
  event,
  index,
  isEven,
}: {
  event: TimelineEvent;
  index: number;
  isEven: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <div
      ref={ref}
      className={cn(
        "relative grid grid-cols-[32px_1fr] gap-6 md:grid-cols-[1fr_32px_1fr] md:gap-8",
      )}
    >
      {/* Left content (desktop only, even items) */}
      <div
        className={cn(
          "hidden md:block",
          isEven ? "text-right" : "order-3",
        )}
      >
        {isEven && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <EventContent event={event} align="right" />
          </motion.div>
        )}
        {!isEven && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <EventContent event={event} align="left" />
          </motion.div>
        )}
      </div>

      {/* Center dot */}
      <div className="relative flex justify-center md:order-2">
        <motion.div
          className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : undefined}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.05,
          }}
        >
          {event.icon ?? (
            <div className="h-2.5 w-2.5 rounded-full bg-primary" />
          )}
        </motion.div>
      </div>

      {/* Right content (desktop: odd items) / Mobile: all items */}
      <div
        className={cn(
          "md:hidden",
          isEven ? "md:order-3" : "md:order-1",
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <EventContent event={event} align="left" />
        </motion.div>
      </div>

      {/* Desktop: content on opposite side */}
      <div
        className={cn(
          "hidden md:block",
          isEven ? "order-3" : "order-1 text-right",
        )}
      >
        {/* Placeholder to maintain grid on desktop; content rendered in the left column */}
      </div>
    </div>
  );
}

function EventContent({
  event,
  align,
}: {
  event: TimelineEvent;
  align: "left" | "right";
}) {
  return (
    <div>
      {event.date && (
        <span className="mb-1 block text-xs font-medium text-muted-foreground">
          {event.date}
        </span>
      )}
      <h3 className="text-base font-semibold">{event.title}</h3>
      {event.description && (
        <p className="mt-1 text-sm text-muted-foreground">
          {event.description}
        </p>
      )}
    </div>
  );
}
