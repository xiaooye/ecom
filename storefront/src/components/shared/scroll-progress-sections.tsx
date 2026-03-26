"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface SectionDef {
  id: string;
  label: string;
}

interface ScrollProgressSectionsProps {
  sections: SectionDef[];
  className?: string;
  /** Extra top offset in px (e.g. to account for sticky header) */
  topOffset?: number;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

/**
 * Vertical section progress indicator — like a table-of-contents sidebar
 * that tracks reading position. Shows named sections with a fill bar
 * for the currently visible section.
 */
export function ScrollProgressSections({
  sections,
  className,
  topOffset = 0,
}: ScrollProgressSectionsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fillPercent, setFillPercent] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const update = () => {
      const viewportH = window.innerHeight;

      let closestIdx = 0;
      let closestDist = Infinity;

      for (let i = 0; i < sections.length; i++) {
        const el = document.getElementById(sections[i].id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        const sectionTop = rect.top - topOffset;
        const sectionBottom = rect.bottom - topOffset;

        // Distance of the section's centre from the viewport centre
        const centre = (sectionTop + sectionBottom) / 2;
        const dist = Math.abs(centre - viewportH / 2);

        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = i;
        }
      }

      setActiveIndex(closestIdx);

      // Compute fill% for the active section
      const activeEl = document.getElementById(sections[closestIdx].id);
      if (activeEl) {
        const rect = activeEl.getBoundingClientRect();
        const sectionTop = rect.top - topOffset;
        const sectionHeight = rect.height;

        if (sectionHeight <= 0) {
          setFillPercent(0);
        } else {
          const scrolledInto = viewportH * 0.3 - sectionTop;
          const pct = Math.max(0, Math.min(1, scrolledInto / sectionHeight));
          setFillPercent(pct);
        }
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections, topOffset]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - topOffset - 20,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      className={cn("flex flex-col gap-1 text-sm", className)}
      aria-label="Section progress"
    >
      {sections.map((section, i) => {
        const isActive = i === activeIndex;
        const isPast = i < activeIndex;

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => handleClick(section.id)}
            className={cn(
              "group relative flex items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-muted",
              isActive && "text-foreground",
              !isActive && "text-muted-foreground",
            )}
          >
            {/* Progress bar track */}
            <span className="relative h-8 w-1 shrink-0 overflow-hidden rounded-full bg-muted">
              <motion.span
                className="absolute inset-x-0 top-0 rounded-full bg-primary"
                animate={{
                  height:
                    isPast
                      ? "100%"
                      : isActive
                        ? `${fillPercent * 100}%`
                        : "0%",
                }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              />
            </span>

            {/* Label */}
            <span
              className={cn(
                "font-medium transition-colors",
                isActive && "text-foreground",
              )}
            >
              {section.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
