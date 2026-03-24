"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "./motion";

interface BentoItem {
  title: string;
  description: string;
  content?: React.ReactNode;
  className?: string;
}

interface BentoGridProps {
  items: BentoItem[];
  className?: string;
}

/**
 * Apple-style bento grid layout with animated stagger reveal.
 * Items can span multiple columns/rows for visual hierarchy.
 */
export function BentoGrid({ items, className }: BentoGridProps) {
  return (
    <motion.div
      className={cn(
        "grid auto-rows-[14rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      variants={staggerContainer}
    >
      {items.map((item, i) => (
        <motion.div
          key={i}
          variants={staggerItem}
          className={cn(
            "group relative overflow-hidden rounded-2xl border bg-card p-6 transition-shadow hover:shadow-lg",
            item.className
          )}
        >
          <div className="relative z-10">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {item.description}
            </p>
          </div>
          {item.content && (
            <div className="relative z-10 mt-4">{item.content}</div>
          )}
          {/* Hover gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </motion.div>
      ))}
    </motion.div>
  );
}
