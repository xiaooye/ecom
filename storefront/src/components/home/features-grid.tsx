"use client";

import { Zap, Leaf, Shield, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/shared/motion";

const features = [
  {
    icon: Leaf,
    title: "Sustainable Materials",
    description: "Responsibly sourced fabrics with reduced environmental impact.",
  },
  {
    icon: Zap,
    title: "Fast Production",
    description: "Made-to-order reduces waste while maintaining quick turnaround.",
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    description: "Every piece inspected. Not satisfied? Full refund, no questions.",
  },
  {
    icon: Sparkles,
    title: "Unique Designs",
    description: "Limited runs ensure your style stands out from the crowd.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Why Choose THREAD
        </h2>
        <p className="mt-2 text-muted-foreground">
          More than just clothing — a commitment to quality and sustainability.
        </p>
      </motion.div>

      <motion.div
        className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={staggerItem}
            className="card-hover group rounded-2xl border p-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(28,60%,48%)]/10 transition-colors group-hover:bg-[hsl(28,60%,48%)]/20">
              <feature.icon className="h-6 w-6 text-[hsl(28,60%,48%)]" />
            </div>
            <h3 className="mt-4 font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
