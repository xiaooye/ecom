"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingPlan {
  name: string;
  price: number;
  currency?: string;
  interval?: string;
  description?: string;
  features: string[];
  ctaLabel?: string;
  onCtaClick?: () => void;
  popular?: boolean;
}

interface PricingCardProps {
  plan: PricingPlan;
  className?: string;
}

/**
 * Animated pricing card for subscription/membership display.
 * Price animates with spring motion, features stagger in,
 * and the popular plan gets a glow border effect.
 */
export function PricingCard({ plan, className }: PricingCardProps) {
  const {
    name,
    price,
    currency = "$",
    interval = "month",
    description,
    features,
    ctaLabel = "Get Started",
    onCtaClick,
    popular = false,
  } = plan;

  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-10% 0px" });

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative flex flex-col rounded-2xl border bg-card p-8",
        popular && "border-primary/50 shadow-lg",
        className,
      )}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Popular glow effect */}
      {popular && (
        <>
          <div className="absolute -inset-px -z-10 rounded-2xl bg-gradient-to-b from-primary/30 via-primary/10 to-transparent blur-sm" />
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
            Most Popular
          </div>
        </>
      )}

      {/* Plan name */}
      <h3 className="text-lg font-semibold">{name}</h3>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}

      {/* Price with spring animation */}
      <div className="mt-6 flex items-baseline gap-1">
        <span className="text-sm font-medium text-muted-foreground">
          {currency}
        </span>
        <SpringPrice value={price} isInView={isInView} />
        <span className="text-sm text-muted-foreground">/{interval}</span>
      </div>

      {/* Features with stagger */}
      <ul className="mt-8 flex-1 space-y-3">
        {features.map((feature, i) => (
          <motion.li
            key={feature}
            className="flex items-start gap-3 text-sm"
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : undefined}
            transition={{ delay: 0.3 + i * 0.08, duration: 0.35 }}
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{feature}</span>
          </motion.li>
        ))}
      </ul>

      {/* CTA Button */}
      <motion.button
        className={cn(
          "mt-8 w-full rounded-xl py-3 text-sm font-semibold transition-colors",
          popular
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "border bg-background hover:bg-muted",
        )}
        onClick={onCtaClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {ctaLabel}
      </motion.button>
    </motion.div>
  );
}

function SpringPrice({
  value,
  isInView,
}: {
  value: number;
  isInView: boolean;
}) {
  const springValue = useSpring(0, { stiffness: 100, damping: 20, mass: 0.5 });
  const display = useTransform(springValue, (v) => Math.round(v));
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  useEffect(() => {
    const unsubscribe = display.on("change", (v) => setCurrent(v));
    return unsubscribe;
  }, [display]);

  return <span className="text-4xl font-bold tabular-nums">{current}</span>;
}
