"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/shared/motion";

const categories = [
  {
    name: "Shirts",
    handle: "shirts",
    description: "Classic and modern styles",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=400&fit=crop",
  },
  {
    name: "Sweatshirts",
    handle: "sweatshirts",
    description: "Comfortable everyday wear",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=400&fit=crop",
  },
  {
    name: "Pants",
    handle: "pants",
    description: "Perfect fit for any occasion",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=400&fit=crop",
  },
  {
    name: "Merch",
    handle: "merch",
    description: "Exclusive collection items",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=400&fit=crop",
  },
];

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="font-display text-2xl font-bold tracking-tight sm:text-3xl"
      >
        Shop by Category
      </motion.h2>
      <motion.div
        className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        {categories.map((category) => (
          <motion.div key={category.handle} variants={staggerItem}>
            <Link
              href={`/categories/${category.handle}`}
              className="group relative block overflow-hidden rounded-2xl"
            >
              <div className="relative flex h-56 flex-col justify-end overflow-hidden text-white transition-all duration-500 group-hover:scale-[1.02]">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="relative z-10 p-6">
                  <h3 className="font-display text-2xl font-bold">{category.name}</h3>
                  <p className="mt-1 text-sm text-white/80">
                    {category.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-sm font-medium">
                    Shop now
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
