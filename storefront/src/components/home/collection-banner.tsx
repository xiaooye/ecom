"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CollectionBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left banner — dark with image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="group relative overflow-hidden rounded-2xl text-white"
        >
          <div className="relative z-0 h-full min-h-[320px]">
            <Image
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=500&fit=crop"
              alt="Essential collection display"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          </div>
          <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12">
            <p className="text-xs font-medium uppercase tracking-widest text-white/60">
              Limited Edition
            </p>
            <h3 className="font-display mt-2 text-2xl font-bold sm:text-3xl">
              Essential Collection
            </h3>
            <p className="mt-2 max-w-xs text-sm text-white/70">
              Timeless pieces designed to be the foundation of your wardrobe.
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-6 w-fit border-white/40 text-white hover:bg-white hover:text-black"
            >
              <Link href="/products">
                Explore
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Right banner — warm with image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="group relative overflow-hidden rounded-2xl"
        >
          <div className="relative z-0 h-full min-h-[320px]">
            <Image
              src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=500&fit=crop"
              alt="Customer favorites display"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-[hsl(28,30%,15%)]/80 via-[hsl(28,30%,15%)]/40 to-transparent" />
          </div>
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white sm:p-12">
            <p className="text-xs font-medium uppercase tracking-widest text-[hsl(28,60%,65%)]">
              Best Sellers
            </p>
            <h3 className="font-display mt-2 text-2xl font-bold sm:text-3xl">
              Customer Favorites
            </h3>
            <p className="mt-2 max-w-xs text-sm text-white/70">
              The pieces our customers love the most. See what&apos;s trending.
            </p>
            <Button asChild className="mt-6 w-fit">
              <Link href="/products">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
