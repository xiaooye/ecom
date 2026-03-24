"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface TextScrambleProps {
  text: string;
  className?: string;
  speed?: number;
  trigger?: boolean;
}

const chars = "!<>-_\\/[]{}—=+*^?#________";

/**
 * Hacker-style text scramble effect.
 * Text scrambles through random characters before revealing actual text.
 */
export function TextScramble({
  text,
  className,
  speed = 30,
  trigger = true,
}: TextScrambleProps) {
  const [displayed, setDisplayed] = useState(text);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!trigger) return;

    let frame = 0;
    const totalFrames = text.length * 2;

    const scramble = () => {
      const progress = frame / totalFrames;
      const revealedCount = Math.floor(progress * text.length);

      const result = text
        .split("")
        .map((char, i) => {
          if (i < revealedCount) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      setDisplayed(result);
      frame++;

      if (frame <= totalFrames) {
        frameRef.current = requestAnimationFrame(() =>
          setTimeout(scramble, speed)
        );
      }
    };

    scramble();

    return () => cancelAnimationFrame(frameRef.current);
  }, [text, speed, trigger]);

  return (
    <span className={cn("font-mono", className)}>{displayed}</span>
  );
}
