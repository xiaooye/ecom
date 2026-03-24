"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const shortcuts = [
  { keys: "mod+k", label: "Search", description: "Open search dialog" },
  { keys: "/", label: "/", description: "Focus search" },
  { keys: "g h", label: "G → H", description: "Go to home" },
  { keys: "g s", label: "G → S", description: "Go to shop" },
  { keys: "g c", label: "G → C", description: "Go to cart" },
  { keys: "g w", label: "G → W", description: "Go to wishlist" },
  { keys: "g a", label: "G → A", description: "Go to account" },
  { keys: "?", label: "?", description: "Show shortcuts" },
  { keys: "escape", label: "Esc", description: "Close modal/drawer" },
];

/**
 * Global keyboard shortcuts provider.
 * Registers navigation shortcuts and shows a help dialog.
 */
export function KeyboardShortcuts() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);

  // Navigation shortcuts
  useHotkeys("g h", () => router.push("/"), { preventDefault: true });
  useHotkeys("g s", () => router.push("/products"), { preventDefault: true });
  useHotkeys("g c", () => router.push("/cart"), { preventDefault: true });
  useHotkeys("g w", () => router.push("/wishlist"), { preventDefault: true });
  useHotkeys("g a", () => router.push("/account"), { preventDefault: true });

  // Help dialog
  useHotkeys("shift+/", () => setShowHelp((prev) => !prev), { preventDefault: true });
  useHotkeys("escape", () => setShowHelp(false));

  // Focus search with /
  useHotkeys("/", (e) => {
    // Don't trigger inside inputs
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
    e.preventDefault();
    router.push("/search");
  });

  return (
    <AnimatePresence>
      {showHelp && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={() => setShowHelp(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-[101] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-card p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Keyboard className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowHelp(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 space-y-2">
              {shortcuts.map((s) => (
                <div
                  key={s.keys}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-muted"
                >
                  <span className="text-muted-foreground">{s.description}</span>
                  <kbd className="rounded border bg-muted px-2 py-0.5 font-mono text-xs">
                    {s.label}
                  </kbd>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
