"use client";

import { useState } from "react";
import { Send, Check } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterCta() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    toast.success("Thanks for subscribing!");
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <section className="bg-neutral-950 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8"
      >
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Join the Club
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-neutral-400">
          Be the first to know about new arrivals, exclusive offers, and style
          inspiration. No spam, ever.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-md gap-3"
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="h-11 border-neutral-700 bg-neutral-900 text-white placeholder:text-neutral-500 focus-visible:ring-white"
          />
          <Button
            type="submit"
            size="lg"
            className="h-11 shrink-0 bg-white text-black hover:bg-neutral-200"
          >
            {subscribed ? (
              <Check className="h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </motion.div>
    </section>
  );
}
