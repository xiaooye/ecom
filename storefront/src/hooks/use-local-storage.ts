"use client";

import { useState, useEffect } from "react";

/**
 * Persist state in localStorage with SSR safety.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) setValue(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, [key]);

  const setStoredValue = (newValue: T | ((prev: T) => T)) => {
    const resolved = newValue instanceof Function ? newValue(value) : newValue;
    setValue(resolved);
    try {
      localStorage.setItem(key, JSON.stringify(resolved));
    } catch {
      // ignore
    }
  };

  return [value, setStoredValue] as const;
}
