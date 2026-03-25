"use client";

import { useState, useEffect } from "react";
import { View, Smartphone, CheckCircle, XCircle, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ARPlaceholderProps {
  /** Product name shown in the dialog */
  productName: string;
  /** Optional product image to show in the mock AR view */
  productImage?: string;
  className?: string;
}

type DeviceCapability = "checking" | "supported" | "partial" | "unsupported";

interface CompatibilityInfo {
  webXR: boolean;
  camera: boolean;
  gyroscope: boolean;
}

/**
 * AR "View in your space" button with a camera/AR icon.
 * Opens a dialog explaining the AR feature with a mock camera view
 * placeholder. Shows device compatibility status.
 */
export function ARPlaceholder({
  productName,
  productImage,
  className,
}: ARPlaceholderProps) {
  const [open, setOpen] = useState(false);
  const [capability, setCapability] = useState<DeviceCapability>("checking");
  const [compatibility, setCompatibility] = useState<CompatibilityInfo>({
    webXR: false,
    camera: false,
    gyroscope: false,
  });
  const [showMockCamera, setShowMockCamera] = useState(false);

  // Check device capabilities when dialog opens
  useEffect(() => {
    if (!open) {
      setShowMockCamera(false);
      return;
    }

    const checkCapabilities = async () => {
      const info: CompatibilityInfo = {
        webXR: false,
        camera: false,
        gyroscope: false,
      };

      // Check WebXR support
      if ("xr" in navigator) {
        try {
          const xr = navigator as Navigator & {
            xr?: { isSessionSupported: (mode: string) => Promise<boolean> };
          };
          info.webXR =
            (await xr.xr?.isSessionSupported("immersive-ar")) ?? false;
        } catch {
          info.webXR = false;
        }
      }

      // Check camera
      if ("mediaDevices" in navigator && navigator.mediaDevices.enumerateDevices) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          info.camera = devices.some((d) => d.kind === "videoinput");
        } catch {
          info.camera = false;
        }
      }

      // Check gyroscope
      info.gyroscope = "DeviceOrientationEvent" in window;

      setCompatibility(info);

      if (info.webXR && info.camera) {
        setCapability("supported");
      } else if (info.camera || info.gyroscope) {
        setCapability("partial");
      } else {
        setCapability("unsupported");
      }
    };

    checkCapabilities();
  }, [open]);

  const capabilityLabel: Record<DeviceCapability, string> = {
    checking: "Checking device...",
    supported: "Full AR support detected",
    partial: "Limited AR support",
    unsupported: "AR not supported on this device",
  };

  const capabilityColor: Record<DeviceCapability, string> = {
    checking: "text-muted-foreground",
    supported: "text-green-600 dark:text-green-400",
    partial: "text-yellow-600 dark:text-yellow-400",
    unsupported: "text-red-600 dark:text-red-400",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={cn("gap-2", className)}>
          <View className="h-3.5 w-3.5" />
          View in your space
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <View className="h-5 w-5 text-primary" />
            AR View
          </DialogTitle>
          <DialogDescription>
            See how {productName} looks in your space using augmented reality.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Device compatibility */}
          <div className="rounded-lg border p-3">
            <p
              className={cn(
                "mb-2 text-sm font-medium",
                capabilityColor[capability]
              )}
            >
              {capabilityLabel[capability]}
            </p>
            <div className="space-y-1.5">
              <CapabilityRow
                label="WebXR Support"
                supported={compatibility.webXR}
                loading={capability === "checking"}
              />
              <CapabilityRow
                label="Camera Access"
                supported={compatibility.camera}
                loading={capability === "checking"}
              />
              <CapabilityRow
                label="Motion Sensors"
                supported={compatibility.gyroscope}
                loading={capability === "checking"}
              />
            </div>
          </div>

          {/* Mock camera view */}
          <AnimatePresence mode="wait">
            {!showMockCamera ? (
              <motion.div
                key="start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-muted">
                  <Smartphone className="h-10 w-10 text-muted-foreground" />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Point your camera at a flat surface to place the product in
                  your space. This is a preview of our upcoming AR feature.
                </p>
                <Button
                  className="mt-4 w-full"
                  onClick={() => setShowMockCamera(true)}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Open AR Camera
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="camera"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                {/* Mock camera viewport */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gradient-to-b from-neutral-800 to-neutral-900">
                  {/* Simulated camera grid overlay */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className="border border-white/10"
                      />
                    ))}
                  </div>

                  {/* Mock product placement */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {productImage ? (
                      <motion.img
                        src={productImage}
                        alt={productName}
                        className="h-1/2 w-1/2 object-contain drop-shadow-2xl"
                        animate={{
                          y: [0, -4, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    ) : (
                      <div className="space-y-2">
                        <div className="mx-auto h-16 w-16 animate-pulse rounded-full border-2 border-dashed border-white/30" />
                        <p className="text-xs text-white/50">
                          Product placement area
                        </p>
                      </div>
                    )}
                  </div>

                  {/* AR label */}
                  <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-primary/80 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                    <View className="h-2.5 w-2.5" />
                    AR Preview
                  </div>

                  {/* Surface detection indicator */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm">
                    Surface detected - tap to place
                  </div>
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  This is a simulated AR view. Full AR experience coming soon.
                </p>

                <Button
                  variant="outline"
                  className="mt-3 w-full"
                  onClick={() => setShowMockCamera(false)}
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

function CapabilityRow({
  label,
  supported,
  loading,
}: {
  label: string;
  supported: boolean;
  loading: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      {loading ? (
        <span className="h-3 w-3 animate-spin rounded-full border border-muted-foreground/30 border-t-muted-foreground" />
      ) : supported ? (
        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <XCircle className="h-3.5 w-3.5 text-red-400" />
      )}
    </div>
  );
}
