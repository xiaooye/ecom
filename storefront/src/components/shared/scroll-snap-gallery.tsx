"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollSnapGalleryProps {
  children: React.ReactNode[];
  className?: string;
}

/**
 * CSS scroll-snap gallery with dot indicators and arrow navigation.
 * Native scroll performance with custom UI overlays.
 */
export function ScrollSnapGallery({ children, className }: ScrollSnapGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const count = children.length;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const width = el.offsetWidth;
      setActiveIndex(Math.round(scrollLeft / width));
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.offsetWidth, behavior: "smooth" });
  };

  return (
    <div className={cn("relative group", className)}>
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory overflow-x-auto scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children.map((child, i) => (
          <div key={i} className="w-full flex-shrink-0 snap-center">
            {child}
          </div>
        ))}
      </div>

      {/* Arrows */}
      {count > 1 && (
        <>
          <button
            onClick={() => scrollTo(Math.max(0, activeIndex - 1))}
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100",
              activeIndex === 0 && "hidden"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scrollTo(Math.min(count - 1, activeIndex + 1))}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100",
              activeIndex === count - 1 && "hidden"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      {/* Dots */}
      {count > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {Array.from({ length: count }).map((_, i) => (
            <motion.button
              key={i}
              onClick={() => scrollTo(i)}
              className="h-2 rounded-full bg-white/60"
              animate={{
                width: activeIndex === i ? 24 : 8,
                opacity: activeIndex === i ? 1 : 0.5,
              }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
