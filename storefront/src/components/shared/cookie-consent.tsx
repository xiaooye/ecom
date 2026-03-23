"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-20 left-4 right-4 z-[70] mx-auto max-w-lg rounded-xl border bg-card p-5 shadow-2xl md:bottom-6"
        >
          <div className="flex gap-3">
            <Cookie className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium">We use cookies</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                We use cookies to enhance your shopping experience, analyze site
                traffic, and personalize content. By clicking &quot;Accept&quot;,
                you consent to our use of cookies.
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={accept}>
                  Accept
                </Button>
                <Button size="sm" variant="outline" onClick={decline}>
                  Decline
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
