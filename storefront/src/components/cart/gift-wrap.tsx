"use client";

import { useState } from "react";
import { Gift } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function GiftWrap() {
  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <Checkbox
          id="gift-wrap"
          checked={enabled}
          onCheckedChange={(v) => setEnabled(v === true)}
        />
        <Label
          htmlFor="gift-wrap"
          className="flex cursor-pointer items-center gap-2 text-sm font-medium"
        >
          <Gift className="h-4 w-4 text-muted-foreground" />
          Add gift wrapping (+$5.00)
        </Label>
      </div>

      <div
        className={cn(
          "mt-3 overflow-hidden transition-all",
          enabled ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a gift message (optional)"
          maxLength={150}
          className="h-9"
        />
        <p className="mt-1 text-right text-xs text-muted-foreground">
          {message.length}/150
        </p>
      </div>
    </div>
  );
}
