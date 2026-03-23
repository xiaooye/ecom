"use client";

import { Truck, ShieldCheck, RefreshCw, HeadphonesIcon } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/shared/motion";

const badges = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $50",
  },
  {
    icon: ShieldCheck,
    title: "Secure Checkout",
    description: "SSL encrypted payment",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day return policy",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Dedicated customer care",
  },
];

export function TrustBadges() {
  return (
    <section className="border-y bg-muted/30">
      <motion.div
        className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        {badges.map((badge) => (
          <motion.div
            key={badge.title}
            variants={staggerItem}
            className="flex flex-col items-center gap-2 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <badge.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold">{badge.title}</h3>
            <p className="text-xs text-muted-foreground">
              {badge.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
