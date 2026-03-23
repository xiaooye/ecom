"use client";

import { useEffect } from "react";

/**
 * Enables smooth scrolling behavior globally.
 * Add this component to the root layout.
 */
export function SmoothScroll() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return null;
}
