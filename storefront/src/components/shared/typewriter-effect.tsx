"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TypewriterEffectProps {
  words: Array<{ text: string; className?: string }>;
  className?: string;
  cursorClassName?: string;
}

/**
 * Typewriter effect where each word appears character by character,
 * with per-word custom styling (e.g., gradient on last word).
 */
export function TypewriterEffect({
  words,
  className,
  cursorClassName,
}: TypewriterEffectProps) {
  const [currentWord, setCurrentWord] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWord].text;

    const timeout = setTimeout(
      () => {
        if (!isDeleting && currentChar < word.length) {
          setCurrentChar(currentChar + 1);
        } else if (!isDeleting && currentChar === word.length) {
          setTimeout(() => setIsDeleting(true), 1500);
        } else if (isDeleting && currentChar > 0) {
          setCurrentChar(currentChar - 1);
        } else {
          setIsDeleting(false);
          setCurrentWord((currentWord + 1) % words.length);
        }
      },
      isDeleting ? 40 : 80
    );

    return () => clearTimeout(timeout);
  }, [currentChar, isDeleting, currentWord, words]);

  return (
    <span className={cn("inline-flex items-center", className)}>
      <span className={words[currentWord].className}>
        {words[currentWord].text.slice(0, currentChar)}
      </span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className={cn("ml-0.5 inline-block h-[1.1em] w-[3px] rounded-full bg-primary", cursorClassName)}
      />
    </span>
  );
}
