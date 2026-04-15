"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Github, ExternalLink, Layers, User } from "lucide-react";
import { DEMO_MODE } from "@/lib/constants";

export function DemoModeBadge() {
  const [expanded, setExpanded] = useState(false);

  if (!DEMO_MODE) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.button
            key="pill"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => setExpanded(true)}
            className="flex items-center gap-2 rounded-full border border-border/50 bg-background/90 px-4 py-2 text-xs font-medium text-muted-foreground shadow-lg backdrop-blur-sm transition-colors hover:text-foreground"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Portfolio Demo
          </motion.button>
        ) : (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-80 rounded-xl border bg-background/95 p-5 shadow-2xl backdrop-blur-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-[hsl(28,60%,48%)]" />
                <h3 className="text-sm font-semibold">Portfolio Demo</h3>
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="rounded-md p-1 text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Built by <strong className="text-foreground">Wei</strong> — Senior
              Full Stack Developer. This storefront runs in demo mode with static
              product data. In production, it connects to a Medusa.js v2 backend
              with PostgreSQL, Redis, and Stripe.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Stack:</span>
                Next.js 15 &middot; Medusa v2 &middot; Tailwind v4 &middot; TypeScript
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Scale:</span>
                280+ components &middot; 59 tests &middot; Custom modules
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="https://www.upwork.com/freelancers/weidev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
              >
                <User className="h-3.5 w-3.5" />
                Hire Me
              </a>
              <a
                href="https://github.com/xiaooye/ecom"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
              >
                <Github className="h-3.5 w-3.5" />
                Source
              </a>
              <a
                href="/about"
                className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                About
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
