"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface BlurHeroProps {
  backgroundSrc: string;
  backgroundAlt?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  overlayOpacity?: number;
}

/**
 * Hero section with a frosted glass card floating over a full-bleed background.
 * Background image has parallax scroll and a progressive blur on scroll.
 * Text content sits in the glass card with backdrop-blur.
 */
export function BlurHero({
  backgroundSrc,
  backgroundAlt = "",
  title,
  subtitle,
  children,
  className,
  overlayOpacity = 0.3,
}: BlurHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax: background moves slower than scroll
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  // Progressive blur as user scrolls down
  const blurAmount = useTransform(scrollYProgress, [0, 0.6], [0, 20]);
  const blurFilter = useTransform(blurAmount, (v) => `blur(${v}px)`);

  // Fade out background slightly on scroll
  const bgOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4]);

  // Glass card: subtle upward motion
  const cardY = useTransform(scrollYProgress, [0, 0.5], [0, -30]);

  return (
    <section
      ref={containerRef}
      className={cn("relative flex min-h-[70vh] items-center overflow-hidden", className)}
    >
      {/* Background image with parallax + blur */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ y: bgY, opacity: bgOpacity, filter: blurFilter }}
      >
        <Image
          src={backgroundSrc}
          alt={backgroundAlt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      </motion.div>

      {/* Frosted glass card */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl sm:p-12"
          style={{ y: cardY }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              {subtitle}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </motion.div>
      </div>
    </section>
  );
}
