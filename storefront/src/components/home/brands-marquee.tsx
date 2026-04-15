"use client";

import { motion } from "framer-motion";

const certifications = [
  "OEKO-TEX® Certified",
  "GOTS Organic",
  "Fair Trade",
  "Responsible Wool",
  "Better Cotton",
  "WRAP Certified",
  "bluesign®",
  "Cradle to Cradle",
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
            duration: 25,
            ease: "linear",
          },
        }}
      >
        {[...certifications, ...certifications].map((cert, i) => (
          <span
            key={i}
            className="text-sm font-medium uppercase tracking-widest text-muted-foreground/40"
          >
            {cert}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
