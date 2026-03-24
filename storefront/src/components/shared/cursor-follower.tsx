"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Custom cursor follower that replaces default cursor on desktop.
 * Shows a smooth dot + ring that follows mouse with spring physics.
 * Scales up on interactive elements (links, buttons).
 */
export function CursorFollower() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { damping: 25, stiffness: 200 });
  const springY = useSpring(cursorY, { damping: 25, stiffness: 200 });

  const ringX = useSpring(cursorX, { damping: 40, stiffness: 150 });
  const ringY = useSpring(cursorY, { damping: 40, stiffness: 150 });

  const scale = useMotionValue(1);
  const springScale = useSpring(scale, { damping: 20, stiffness: 300 });

  useEffect(() => {
    // Only on desktop
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const grow = () => scale.set(2.5);
    const shrink = () => scale.set(1);

    window.addEventListener("mousemove", moveCursor);

    // Watch for interactive elements
    const observer = new MutationObserver(() => {
      document
        .querySelectorAll("a, button, [role='button'], input, select, textarea")
        .forEach((el) => {
          el.addEventListener("mouseenter", grow);
          el.addEventListener("mouseleave", shrink);
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial bind
    document
      .querySelectorAll("a, button, [role='button'], input, select, textarea")
      .forEach((el) => {
        el.addEventListener("mouseenter", grow);
        el.addEventListener("mouseleave", shrink);
      });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      observer.disconnect();
    };
  }, [cursorX, cursorY, scale]);

  // Don't render on touch devices (SSR safe)
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Inner dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-2 w-2 rounded-full bg-primary mix-blend-difference md:block"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      {/* Outer ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden h-8 w-8 rounded-full border border-primary/50 mix-blend-difference md:block"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          scale: springScale,
        }}
      />
    </>
  );
}
