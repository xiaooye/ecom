"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Detect user idle state.
 * Returns true when user hasn't interacted for the given timeout.
 * Tracks mouse, keyboard, touch, and scroll events.
 */
export function useIdle(timeout: number = 30000): boolean {
  const [idle, setIdle] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const reset = useCallback(() => {
    setIdle(false);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIdle(true), timeout);
  }, [timeout]);

  useEffect(() => {
    const events = ["mousemove", "keydown", "touchstart", "scroll", "click"];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();

    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      clearTimeout(timerRef.current);
    };
  }, [reset]);

  return idle;
}
