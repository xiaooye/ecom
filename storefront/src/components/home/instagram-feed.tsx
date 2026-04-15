"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { staggerContainer, staggerItem } from "@/components/shared/motion";

const feedImages = [
  { src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop", alt: "Cotton tee styled flat lay" },
  { src: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop", alt: "Jacket on hangar" },
  { src: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop", alt: "Denim detail" },
  { src: "https://images.unsplash.com/photo-1578768079470-0a4a5fdbf847?w=400&h=400&fit=crop", alt: "Sweatshirt collection" },
  { src: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop", alt: "Canvas tote bag" },
  { src: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop", alt: "Hoodie detail shot" },
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
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Follow Us @thread
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
        {feedImages.map((img, i) => (
          <motion.div
            key={i}
            variants={staggerItem}
            className="group aspect-square cursor-pointer overflow-hidden rounded-xl"
          >
            <div className="relative h-full w-full">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                <div className="scale-0 rounded-full bg-white/20 p-2 backdrop-blur-sm transition-transform group-hover:scale-100">
                  <Instagram className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
