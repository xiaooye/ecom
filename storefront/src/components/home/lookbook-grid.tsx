"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/shared/motion";

const looks = [
  {
    title: "Casual Friday",
    description: "Effortless style for the weekend",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&h=500&fit=crop",
    href: "/products",
  },
  {
    title: "Smart Casual",
    description: "Dress to impress, stay comfortable",
    image: "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=500&h=700&fit=crop",
    href: "/products",
    span: "row-span-2",
  },
  {
    title: "Street Style",
    description: "Bold and expressive",
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=500&h=500&fit=crop",
    href: "/products",
  },
  {
    title: "Active Wear",
    description: "Performance meets style",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=500&fit=crop",
    href: "/products",
  },
  {
    title: "Date Night",
    description: "Make an impression",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&h=500&fit=crop",
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
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
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
              className="group relative flex h-full min-h-[200px] flex-col justify-end overflow-hidden rounded-2xl text-white transition-transform hover:scale-[1.02]"
            >
              <Image
                src={look.image}
                alt={look.title}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="relative z-10 p-5">
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
