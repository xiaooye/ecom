"use client";

import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { staggerContainer, staggerItem } from "@/components/shared/motion";

const placeholderImages = [
  "bg-gradient-to-br from-rose-200 to-rose-400",
  "bg-gradient-to-br from-sky-200 to-sky-400",
  "bg-gradient-to-br from-amber-200 to-amber-400",
  "bg-gradient-to-br from-emerald-200 to-emerald-400",
  "bg-gradient-to-br from-violet-200 to-violet-400",
  "bg-gradient-to-br from-pink-200 to-pink-400",
];

export function InstagramFeed() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-2">
          <Instagram className="h-5 w-5" />
          <h2 className="text-2xl font-bold tracking-tight">
            Follow Us @webstore
          </h2>
        </div>
        <p className="mt-2 text-muted-foreground">
          Share your style and get featured
        </p>
      </motion.div>

      <motion.div
        className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        {placeholderImages.map((bg, i) => (
          <motion.div
            key={i}
            variants={staggerItem}
            className={`group aspect-square cursor-pointer overflow-hidden rounded-xl ${bg}`}
          >
            <div className="flex h-full items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <div className="rounded-full bg-black/30 p-2 backdrop-blur-sm">
                <Instagram className="h-5 w-5 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
