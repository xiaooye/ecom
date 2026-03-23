"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CollectionBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left banner */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-950 p-8 text-white sm:p-12"
        >
          <div className="relative z-10">
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">
              Limited Edition
            </p>
            <h3 className="mt-2 text-2xl font-bold sm:text-3xl">
              Essential Collection
            </h3>
            <p className="mt-2 max-w-xs text-sm text-neutral-400">
              Timeless pieces designed to be the foundation of your wardrobe.
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-6 border-white text-white hover:bg-white hover:text-black"
            >
              <Link href="/products">
                Explore
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-white/5" />
        </motion.div>

        {/* Right banner */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 p-8 dark:from-amber-950 dark:to-orange-950 sm:p-12"
        >
          <div className="relative z-10">
            <p className="text-xs font-medium uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Best Sellers
            </p>
            <h3 className="mt-2 text-2xl font-bold sm:text-3xl">
              Customer Favorites
            </h3>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              The pieces our customers love the most. See what&apos;s trending.
            </p>
            <Button asChild className="mt-6">
              <Link href="/products">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-black/5 dark:bg-white/5" />
        </motion.div>
      </div>
    </section>
  );
}
