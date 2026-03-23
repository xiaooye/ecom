"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCompareStore } from "@/stores/compare-store";

export function CompareBar() {
  const { products, removeProduct, clearAll } = useCompareStore();

  if (products.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="fixed bottom-16 left-0 right-0 z-40 border-t bg-background/95 shadow-lg backdrop-blur-lg md:bottom-0"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">
              Compare ({products.length}/3)
            </span>
            <div className="flex gap-2">
              {products.map((p) => (
                <div key={p.id} className="relative">
                  <div className="h-12 w-12 overflow-hidden rounded-lg border bg-gray-100">
                    {p.thumbnail ? (
                      <Image
                        src={p.thumbnail}
                        alt={p.title}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[8px] text-muted-foreground">
                        No img
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeProduct(p.id)}
                    className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[8px] text-white"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear
            </Button>
            <Button size="sm" asChild>
              <Link href="/compare">Compare Now</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
