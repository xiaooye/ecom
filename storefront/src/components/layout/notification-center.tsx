"use client";

import { useState } from "react";
import { Bell, Package, Tag, Sparkles, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "order" | "promo" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const iconMap = {
  order: Package,
  promo: Tag,
  system: Sparkles,
};

const sampleNotifications: Notification[] = [
  {
    id: "1",
    type: "promo",
    title: "Spring Sale Live!",
    message: "20% off all new arrivals. Use code SPRING26.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "order",
    title: "Order Shipped",
    message: "Your order #1234 is on its way!",
    time: "1 day ago",
    read: false,
  },
  {
    id: "3",
    type: "system",
    title: "Welcome to WebStore",
    message: "Thanks for joining! Enjoy 10% off your first order.",
    time: "3 days ago",
    read: true,
  },
];

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(sampleNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9"
        onClick={() => setOpen(!open)}
      >
        <Bell className="h-4 w-4" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white"
            >
              {unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border bg-card shadow-xl"
            >
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h3 className="text-sm font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <Check className="h-3 w-3" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const Icon = iconMap[notification.type];
                    return (
                      <button
                        key={notification.id}
                        onClick={() => markRead(notification.id)}
                        className={cn(
                          "flex w-full gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-muted/50 last:border-0",
                          !notification.read && "bg-primary/5"
                        )}
                      >
                        <div
                          className={cn(
                            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                            notification.type === "order" && "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
                            notification.type === "promo" && "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400",
                            notification.type === "system" && "bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="mt-1 text-[10px] text-muted-foreground/60">
                            {notification.time}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
