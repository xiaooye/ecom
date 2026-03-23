"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  actionHref,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex items-end justify-between"
    >
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="flex items-center gap-1 text-sm font-medium hover:underline"
        >
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </motion.div>
  );
}
