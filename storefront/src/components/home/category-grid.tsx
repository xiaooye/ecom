"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/shared/motion";

const categories = [
  {
    name: "Shirts",
    handle: "shirts",
    description: "Classic and modern styles",
    gradient: "from-blue-600/80 to-indigo-900/90",
    pattern: "bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.1),transparent)]",
  },
  {
    name: "Sweatshirts",
    handle: "sweatshirts",
    description: "Comfortable everyday wear",
    gradient: "from-amber-600/80 to-orange-900/90",
    pattern: "bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent)]",
  },
  {
    name: "Pants",
    handle: "pants",
    description: "Perfect fit for any occasion",
    gradient: "from-emerald-600/80 to-teal-900/90",
    pattern: "bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]",
  },
  {
    name: "Merch",
    handle: "merch",
    description: "Exclusive collection items",
    gradient: "from-purple-600/80 to-violet-900/90",
    pattern: "bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1),transparent)]",
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
        className="text-2xl font-bold tracking-tight"
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
              <div
                className={`relative flex h-56 flex-col justify-end bg-gradient-to-br ${category.gradient} p-6 text-white transition-all duration-500 group-hover:scale-[1.02]`}
              >
                <div className={`absolute inset-0 ${category.pattern}`} />
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold">{category.name}</h3>
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
