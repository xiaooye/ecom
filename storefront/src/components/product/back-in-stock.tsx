"use client";

import { useState } from "react";
import { Bell, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function BackInStock() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast.success("We'll notify you when this item is back in stock!");
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
        <Check className="h-5 w-5 text-green-600" />
        <p className="text-sm text-green-800 dark:text-green-200">
          We&apos;ll email you when this item is back in stock.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm font-medium">Get notified when back in stock</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="h-9"
        />
        <Button type="submit" size="sm" className="h-9">
          Notify Me
        </Button>
      </form>
    </div>
  );
}
