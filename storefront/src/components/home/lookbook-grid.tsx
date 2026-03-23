"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/shared/motion";

const looks = [
  {
    title: "Casual Friday",
    description: "Effortless style for the weekend",
    gradient: "from-sky-400 to-blue-600",
    href: "/products",
  },
  {
    title: "Smart Casual",
    description: "Dress to impress, stay comfortable",
    gradient: "from-slate-600 to-slate-900",
    href: "/products",
    span: "row-span-2",
  },
  {
    title: "Street Style",
    description: "Bold and expressive",
    gradient: "from-rose-400 to-pink-600",
    href: "/products",
  },
  {
    title: "Active Wear",
    description: "Performance meets style",
    gradient: "from-emerald-400 to-teal-600",
    href: "/products",
  },
  {
    title: "Date Night",
    description: "Make an impression",
    gradient: "from-violet-500 to-purple-800",
    href: "/products",
  },
];

export function LookbookGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Shop the Look
        </h2>
        <p className="mt-2 text-muted-foreground">
          Curated outfits for every occasion
        </p>
      </motion.div>

      <motion.div
        className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-rows-2"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        {looks.map((look) => (
          <motion.div
            key={look.title}
            variants={staggerItem}
            className={look.span || ""}
          >
            <Link
              href={look.href}
              className={`group relative flex h-full min-h-[200px] flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br ${look.gradient} p-5 text-white transition-transform hover:scale-[1.02]`}
            >
              <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20" />
              <div className="relative z-10">
                <h3 className="text-lg font-bold">{look.title}</h3>
                <p className="text-sm text-white/80">{look.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
