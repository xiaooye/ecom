"use client";

import { useState } from "react";
import { Camera, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/**
 * Virtual try-on placeholder component.
 * Shows a camera-based AR try-on concept UI that can be connected
 * to a WebXR/AR backend when ready.
 */
export function VirtualTryOn({ productName }: { productName: string }) {
  const [started, setStarted] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Camera className="h-3.5 w-3.5" />
          Try On
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Virtual Try-On
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {!started ? (
              <motion.div
                key="intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-muted">
                  <Camera className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="mt-4 font-semibold">
                  See how {productName} looks on you
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Use your camera to virtually try on this item.
                  AR-powered experience coming soon.
                </p>
                <Button className="mt-6 w-full" onClick={() => setStarted(true)}>
                  <Camera className="mr-2 h-4 w-4" />
                  Start Camera
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="camera"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="aspect-[3/4] rounded-xl bg-gradient-to-b from-neutral-800 to-neutral-900 flex items-center justify-center">
                  <div className="space-y-3">
                    <div className="mx-auto h-16 w-16 animate-pulse rounded-full border-2 border-dashed border-white/30" />
                    <p className="text-sm text-white/60">
                      Camera feed would appear here
                    </p>
                    <p className="text-xs text-white/40">
                      AR try-on coming soon
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => setStarted(false)}
                >
                  Close Camera
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
