"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypingAnimationProps {
  text: string;
  speed?: number;
  className?: string;
  cursor?: boolean;
}

/**
 * Single-pass typing animation that types out text character by character.
 * Unlike Typewriter, this plays once without deletion.
 */
export function TypingAnimation({
  text,
  speed = 50,
  className,
  cursor = true,
}: TypingAnimationProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={cn("inline", className)}>
      {displayed}
      {cursor && !done && (
        <span className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-current align-text-bottom" />
      )}
    </span>
  );
}
