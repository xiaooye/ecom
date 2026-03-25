"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GridCard {
  id: string;
  frontImage: string;
  frontTitle: string;
  backDescription: string;
  backCta?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

interface AnimatedGridCardsProps {
  cards: GridCard[];
  columns?: 2 | 3 | 4;
  className?: string;
}

/**
 * Grid of cards that do a 3D flip animation on hover.
 * Front shows image + title, back shows description + CTA button.
 * Uses CSS perspective and framer-motion rotateY.
 */
export function AnimatedGridCards({
  cards,
  columns = 3,
  className,
}: AnimatedGridCardsProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-6", gridCols[columns], className)}>
      {cards.map((card) => (
        <FlipCard key={card.id} card={card} />
      ))}
    </div>
  );
}

function FlipCard({ card }: { card: GridCard }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group relative h-80"
      style={{ perspective: "1000px" }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl border bg-card shadow-md"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="relative h-3/4 w-full">
            <Image
              src={card.frontImage}
              alt={card.frontTitle}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
          <div className="flex h-1/4 items-center justify-center px-4">
            <h3 className="text-center text-lg font-semibold">
              {card.frontTitle}
            </h3>
          </div>
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-6 rounded-2xl border bg-card p-6 shadow-md"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-center text-sm leading-relaxed text-muted-foreground">
            {card.backDescription}
          </p>
          {card.backCta && (
            card.backCta.href ? (
              <a
                href={card.backCta.href}
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {card.backCta.label}
              </a>
            ) : (
              <button
                onClick={card.backCta.onClick}
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {card.backCta.label}
              </button>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
}
