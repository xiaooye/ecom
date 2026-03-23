"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AnnouncementBannerProps {
  message: string;
  linkText?: string;
  linkHref?: string;
  dismissible?: boolean;
}

export function AnnouncementBanner({
  message,
  linkText,
  linkHref,
  dismissible = true,
}: AnnouncementBannerProps) {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2.5 text-center text-sm font-medium">
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>{message}</span>
            {linkText && linkHref && (
              <Link href={linkHref} className="underline underline-offset-2 hover:no-underline">
                {linkText}
              </Link>
            )}
          </div>
          {dismissible && (
            <button
              onClick={() => setVisible(false)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-white/10"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
