"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { celebrationConfetti } from "@/components/shared/canvas-confetti";

export default function CheckoutSuccessPage() {
  useEffect(() => {
    celebrationConfetti();
  }, []);

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
      >
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-4 text-2xl font-bold"
      >
        Order Confirmed!
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-2 text-muted-foreground"
      >
        Thank you for your purchase. You&apos;ll receive an email confirmation
        shortly.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 flex flex-col gap-3"
      >
        <Button asChild>
          <Link href="/account/orders">View Orders</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </motion.div>
    </div>
  );
}
