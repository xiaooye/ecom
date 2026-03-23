"use client";

import { AnimatedCounter } from "@/components/shared/animated-counter";

const stats = [
  { end: 50000, suffix: "+", label: "Happy Customers", prefix: "" },
  { end: 200, suffix: "+", label: "Products", prefix: "" },
  { end: 15, suffix: "", label: "Countries Shipped", prefix: "" },
  { end: 98, suffix: "%", label: "Satisfaction Rate", prefix: "" },
];

export function StatsSection() {
  return (
    <section className="border-y bg-muted/20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <AnimatedCounter key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}
