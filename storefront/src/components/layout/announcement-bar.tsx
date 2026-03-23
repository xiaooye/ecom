"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const announcements = [
  "Free shipping on orders over $50",
  "Spring Sale — 20% off new arrivals with code SPRING26",
  "New collection just dropped — Shop now",
];

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="relative bg-primary text-primary-foreground">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center px-4 text-center text-xs font-medium sm:text-sm">
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {announcements[index]}
          </motion.span>
        </AnimatePresence>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-white/10"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
