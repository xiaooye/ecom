"use client";

import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring-dampened parallax for floating elements
  const x1 = useSpring(useTransform(mouseX, [-1, 1], [-20, 20]), { stiffness: 50, damping: 20 });
  const y1 = useSpring(useTransform(mouseY, [-1, 1], [-15, 15]), { stiffness: 50, damping: 20 });
  const x2 = useSpring(useTransform(mouseX, [-1, 1], [15, -15]), { stiffness: 40, damping: 25 });
  const y2 = useSpring(useTransform(mouseY, [-1, 1], [10, -10]), { stiffness: 40, damping: 25 });
  const x3 = useSpring(useTransform(mouseX, [-1, 1], [-10, 10]), { stiffness: 30, damping: 30 });
  const y3 = useSpring(useTransform(mouseY, [-1, 1], [-20, 20]), { stiffness: 30, damping: 30 });

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
      className="relative overflow-hidden bg-neutral-950 text-white"
    >
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-950 to-neutral-950" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />

      {/* Parallax floating elements */}
      <motion.div
        style={{ x: x1, y: y1 }}
        className="absolute right-[10%] top-[15%] h-72 w-72 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl"
      />
      <motion.div
        style={{ x: x2, y: y2 }}
        className="absolute left-[5%] bottom-[10%] h-96 w-96 rounded-full bg-gradient-to-br from-blue-500/8 to-cyan-500/8 blur-3xl"
      />
      <motion.div
        style={{ x: x3, y: y3 }}
        className="absolute right-[30%] bottom-[20%] h-48 w-48 rounded-full bg-gradient-to-br from-rose-500/6 to-orange-500/6 blur-2xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 sm:py-36 lg:px-8 lg:py-44">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-400"
          >
            Spring / Summer 2026
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >
            New Season
            <br />
            <span className="bg-gradient-to-r from-white via-white to-neutral-400 bg-clip-text text-transparent">
              Arrivals
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-neutral-300"
          >
            Discover the latest trends in fashion. Quality clothing crafted for
            comfort, durability, and style.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Button asChild size="lg" className="h-12 bg-white px-8 text-black hover:bg-neutral-200">
              <Link href="/products">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 border-neutral-600 px-8 text-white hover:bg-white/10">
              <Link href="/categories/shirts">Browse Collection</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
