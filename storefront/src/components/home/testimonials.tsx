"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/shared/motion";

const testimonials = [
  {
    name: "Sarah M.",
    text: "Amazing quality! The fabric feels premium and the fit is perfect. Will definitely be ordering more.",
    rating: 5,
  },
  {
    name: "James K.",
    text: "Fast shipping and great customer service. The sweatshirt I ordered exceeded my expectations.",
    rating: 5,
  },
  {
    name: "Emily R.",
    text: "Love the sustainable approach. The clothing is stylish, comfortable, and built to last.",
    rating: 4,
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold tracking-tight">
          What Our Customers Say
        </h2>
        <p className="mt-2 text-muted-foreground">
          Trusted by thousands of happy shoppers
        </p>
      </motion.div>

      <motion.div
        className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        {testimonials.map((testimonial) => (
          <motion.div
            key={testimonial.name}
            variants={staggerItem}
            className="rounded-xl border bg-card p-6"
          >
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < testimonial.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-200"
                  }`}
                />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              &ldquo;{testimonial.text}&rdquo;
            </p>
            <p className="mt-4 text-sm font-semibold">{testimonial.name}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
