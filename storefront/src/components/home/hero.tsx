"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring-dampened parallax for product images
  const x1 = useSpring(useTransform(mouseX, [-1, 1], [-15, 15]), { stiffness: 50, damping: 20 });
  const y1 = useSpring(useTransform(mouseY, [-1, 1], [-10, 10]), { stiffness: 50, damping: 20 });
  const x2 = useSpring(useTransform(mouseX, [-1, 1], [12, -12]), { stiffness: 40, damping: 25 });
  const y2 = useSpring(useTransform(mouseY, [-1, 1], [8, -8]), { stiffness: 40, damping: 25 });
  const x3 = useSpring(useTransform(mouseX, [-1, 1], [-8, 8]), { stiffness: 30, damping: 30 });
  const y3 = useSpring(useTransform(mouseY, [-1, 1], [-12, 12]), { stiffness: 30, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="grain relative overflow-hidden bg-[hsl(24,12%,8%)] text-white"
    >
      {/* Warm gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(28,30%,18%),hsl(24,12%,8%)_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(24,20%,14%),transparent_60%)]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwxKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-36">
        {/* ── Left: Copy ────────────────────────────────────── */}
        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm font-medium uppercase tracking-[0.2em] text-[hsl(28,60%,65%)]"
          >
            Spring / Summer 2026
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display mt-4 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >
            Crafted for
            <br />
            <span className="bg-gradient-to-r from-white via-white to-[hsl(30,20%,60%)] bg-clip-text text-transparent">
              the Modern
            </span>
            <br />
            Wardrobe
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-[hsl(30,15%,70%)]"
          >
            Thoughtfully designed clothing in premium fabrics.
            Built to last, made to be worn.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Button
              asChild
              size="lg"
              className="h-12 bg-white px-8 text-[hsl(24,12%,8%)] hover:bg-[hsl(36,30%,92%)]"
            >
              <Link href="/products">
                Shop Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 border-[hsl(30,15%,30%)] px-8 text-white hover:bg-white/10"
            >
              <Link href="/about">Our Story</Link>
            </Button>
          </motion.div>
        </div>

        {/* ── Right: Product imagery with parallax ──────────── */}
        <div className="relative hidden h-[500px] lg:block">
          {/* Main image */}
          <motion.div
            style={{ x: x1, y: y1 }}
            className="absolute right-0 top-4 z-20 h-[420px] w-[300px] overflow-hidden rounded-2xl shadow-2xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&h=840&fit=crop"
              alt="Model wearing premium casual outfit"
              width={600}
              height={840}
              priority
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* Secondary image — offset left & down */}
          <motion.div
            style={{ x: x2, y: y2 }}
            className="absolute left-4 top-16 z-10 h-[340px] w-[240px] overflow-hidden rounded-2xl shadow-xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=480&h=680&fit=crop"
              alt="Styled outfit flat lay"
              width={480}
              height={680}
              priority
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* Small accent image */}
          <motion.div
            style={{ x: x3, y: y3 }}
            className="absolute bottom-0 left-24 z-30 h-[180px] w-[160px] overflow-hidden rounded-xl shadow-lg"
          >
            <Image
              src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=320&h=360&fit=crop"
              alt="Close-up of fabric texture"
              width={320}
              height={360}
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* Warm glow behind images */}
          <div className="absolute right-12 top-1/2 -z-0 h-72 w-72 -translate-y-1/2 rounded-full bg-[hsl(28,40%,25%)] opacity-40 blur-[100px]" />
          <div className="absolute left-0 top-1/3 -z-0 h-48 w-48 rounded-full bg-[hsl(24,30%,20%)] opacity-30 blur-[80px]" />
        </div>

        {/* Mobile: single hero image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative mx-auto h-[350px] w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl lg:hidden"
        >
          <Image
            src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&h=840&fit=crop"
            alt="Model wearing premium casual outfit"
            width={600}
            height={840}
            priority
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
