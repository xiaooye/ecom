"use client";

import { type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface StickyHeaderV2Props {
  /** Logo / brand element shown in both modes */
  logo: ReactNode;
  /** Full navigation shown only in expanded mode */
  nav?: ReactNode;
  /** Icons / actions shown in compact mode (also visible expanded) */
  actions?: ReactNode;
  className?: string;
  /** Scroll threshold in px before compact mode kicks in (default 80) */
  threshold?: number;
}

/**
 * Header that transforms on scroll:
 * - Full-size with logo + navigation at the top of the page.
 * - Compact mode (logo + icon actions) after scrolling past threshold.
 * Smooth height/padding transition powered by framer-motion scroll values.
 */
export function StickyHeaderV2({
  logo,
  nav,
  actions,
  className,
  threshold = 80,
}: StickyHeaderV2Props) {
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    setCompact(v > threshold);
  });

  // Smooth interpolated values
  const paddingY = useTransform(scrollY, [0, threshold], [20, 8]);
  const logoScale = useTransform(scrollY, [0, threshold], [1, 0.85]);
  const borderOpacity = useTransform(scrollY, [0, threshold], [0, 1]);

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md",
        className,
      )}
      style={{
        paddingTop: paddingY,
        paddingBottom: paddingY,
        borderBottomColor: useTransform(
          borderOpacity,
          (v) => `rgba(0,0,0,${v * 0.08})`,
        ),
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <motion.div style={{ scale: logoScale }} className="origin-left">
          {logo}
        </motion.div>

        {/* Centre nav — hides in compact */}
        <motion.nav
          className="hidden items-center gap-6 lg:flex"
          animate={{
            opacity: compact ? 0 : 1,
            y: compact ? -8 : 0,
            pointerEvents: compact ? "none" : "auto",
          }}
          transition={{ duration: 0.25 }}
        >
          {nav}
        </motion.nav>

        {/* Actions — always visible */}
        <div className="flex items-center gap-2">{actions}</div>
      </div>
    </motion.header>
  );
}
