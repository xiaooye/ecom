"use client";

import { Drawer } from "vaul";
import { cn } from "@/lib/utils";

interface VaulDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  snapPoints?: (string | number)[];
  className?: string;
}

/**
 * iOS-style bottom drawer using Vaul library.
 * Native-feeling drag gestures with snap points and velocity detection.
 * Much smoother than custom drawer implementations.
 */
export function VaulDrawer({
  open,
  onOpenChange,
  children,
  title,
  snapPoints,
  className,
}: VaulDrawerProps) {
  return (
    <Drawer.Root
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={snapPoints}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Drawer.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-2xl bg-background",
            className
          )}
        >
          {/* Drag handle */}
          <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted-foreground/30" />

          {title && (
            <Drawer.Title className="px-4 pb-2 pt-4 text-lg font-semibold">
              {title}
            </Drawer.Title>
          )}

          <div className="flex-1 overflow-y-auto p-4">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

/**
 * VaulDrawer trigger button wrapper.
 */
export function VaulDrawerTrigger({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="md:hidden">
      {children}
    </button>
  );
}
