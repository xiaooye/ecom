"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";

/**
 * Re-export auto-animate hook for easy use across components.
 * Automatically animates list additions, removals, and reorders.
 *
 * Usage:
 * const [parent] = useListAnimation();
 * <ul ref={parent}>...</ul>
 */
export function useListAnimation(options?: Parameters<typeof useAutoAnimate>[0]) {
  return useAutoAnimate(options);
}
