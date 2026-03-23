"use client";

import { motion } from "framer-motion";

const brands = [
  "Premium Cotton",
  "Organic Blend",
  "EcoWear",
  "UrbanStyle",
  "Classic Fit",
  "Heritage Denim",
  "Modern Basics",
  "TrueKnit",
];

export function BrandsMarquee() {
  return (
    <section className="overflow-hidden border-y bg-muted/20 py-6">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
      >
        {[...brands, ...brands].map((brand, i) => (
          <span
            key={i}
            className="text-lg font-semibold text-muted-foreground/50"
          >
            {brand}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
