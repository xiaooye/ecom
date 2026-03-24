"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  label: string;
}

interface ScrollMinimapProps {
  sections: Section[];
  className?: string;
}

/**
 * Vertical scroll minimap showing page sections.
 * Highlights the currently visible section based on scroll position.
 * Click a dot to smooth-scroll to that section.
 */
export function ScrollMinimap({ sections, className }: ScrollMinimapProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id);

  useEffect(() => {
    const observers = sections.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: "-40% 0px -40% 0px" }
      );

      observer.observe(el);
      return observer;
    });

    return () => {
      observers.forEach((o) => o?.disconnect());
    };
  }, [sections]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={cn(
        "fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex",
        className
      )}
    >
      {sections.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          className="group flex items-center gap-2"
          aria-label={`Scroll to ${label}`}
        >
          <span className="text-[10px] font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
            {label}
          </span>
          <motion.div
            animate={{
              scale: activeId === id ? 1.5 : 1,
              backgroundColor:
                activeId === id
                  ? "var(--color-primary)"
                  : "var(--color-muted-foreground)",
            }}
            className="h-2 w-2 rounded-full"
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        </button>
      ))}
    </div>
  );
}
