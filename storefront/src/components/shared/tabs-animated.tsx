"use client";

import { useRef, useState, useLayoutEffect, useCallback, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface AnimatedTab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface TabsAnimatedProps {
  tabs: AnimatedTab[];
  defaultTab?: string;
  className?: string;
  tabBarClassName?: string;
  contentClassName?: string;
  /** Colour for the morphing indicator (default: primary) */
  indicatorClassName?: string;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

/**
 * Tabs with a morphing background indicator that resizes and slides
 * between tabs. Content crossfades with directional awareness
 * (slide left/right based on navigation direction).
 */
export function TabsAnimated({
  tabs,
  defaultTab,
  className,
  tabBarClassName,
  contentClassName,
  indicatorClassName,
}: TabsAnimatedProps) {
  const id = useId();
  const [activeId, setActiveId] = useState(defaultTab ?? tabs[0]?.id ?? "");
  const [direction, setDirection] = useState(0); // -1 left, 1 right
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  /* Measure the active tab button to position the indicator */
  const measure = useCallback(() => {
    const el = tabRefs.current.get(activeId);
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    setIndicator({
      left: rect.left - parentRect.left,
      width: rect.width,
    });
  }, [activeId]);

  /* Re-measure on activeId change and on mount */
  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const activeIndex = tabs.findIndex((t) => t.id === activeId);
  const activeContent = tabs[activeIndex]?.content;

  const handleSelect = (tabId: string) => {
    const newIdx = tabs.findIndex((t) => t.id === tabId);
    setDirection(newIdx > activeIndex ? 1 : -1);
    setActiveId(tabId);
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Tab bar */}
      <div
        className={cn(
          "relative flex items-center gap-1 rounded-lg bg-muted p-1",
          tabBarClassName,
        )}
        role="tablist"
      >
        {/* Morphing indicator */}
        <motion.div
          className={cn(
            "absolute top-1 bottom-1 rounded-md bg-background shadow-sm",
            indicatorClassName,
          )}
          animate={{ left: indicator.left, width: indicator.width }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />

        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => {
              if (el) tabRefs.current.set(tab.id, el);
            }}
            role="tab"
            aria-selected={tab.id === activeId}
            aria-controls={`${id}-panel-${tab.id}`}
            id={`${id}-tab-${tab.id}`}
            onClick={() => handleSelect(tab.id)}
            className={cn(
              "relative z-10 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              tab.id === activeId
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content area with directional crossfade */}
      <div className={cn("relative mt-4 overflow-hidden", contentClassName)}>
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={activeId}
            role="tabpanel"
            id={`${id}-panel-${activeId}`}
            aria-labelledby={`${id}-tab-${activeId}`}
            custom={direction}
            initial="enter"
            animate="active"
            exit="exit"
            variants={{
              enter: (dir: number) => ({
                x: dir * 40,
                opacity: 0,
              }),
              active: { x: 0, opacity: 1 },
              exit: (dir: number) => ({
                x: dir * -40,
                opacity: 0,
              }),
            }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {activeContent}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
