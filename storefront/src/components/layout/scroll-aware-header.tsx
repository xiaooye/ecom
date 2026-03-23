"use client";

import { useEffect, useState } from "react";

/**
 * Hook to detect scroll direction for header visibility.
 */
export function useScrollDirection() {
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const handle = () => {
      const y = window.scrollY;
      if (y > lastY && y > 80) setDirection("down");
      else if (y < lastY) setDirection("up");
      setLastY(y);
    };
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, [lastY]);

  return direction;
}
