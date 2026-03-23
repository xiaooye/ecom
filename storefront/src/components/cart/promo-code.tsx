"use client";

import { useState, useTransition } from "react";
import { Tag, Loader2, X, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PromoCodeProps {
  cartId: string;
}

export function PromoCode({ cartId }: PromoCodeProps) {
  const [code, setCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);

  const handleApply = () => {
    if (!code.trim()) return;

    startTransition(async () => {
      try {
        // TODO: Call Medusa promotion/discount API
        // await sdk.store.cart.update(cartId, { promo_codes: [code] })
        setAppliedCode(code.toUpperCase());
        toast.success(`Promo code "${code.toUpperCase()}" applied!`);
        setCode("");
        setExpanded(false);
      } catch {
        toast.error("Invalid promo code");
      }
    });
  };

  const handleRemove = () => {
    setAppliedCode(null);
    toast.success("Promo code removed");
  };

  if (appliedCode) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-3 py-2 dark:border-green-900 dark:bg-green-950">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-700 dark:text-green-300">
            {appliedCode}
          </span>
        </div>
        <button
          onClick={handleRemove}
          className="text-green-600 hover:text-green-800 dark:hover:text-green-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <Tag className="h-3.5 w-3.5" />
        Have a promo code?
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter code"
        className="h-9 uppercase"
        onKeyDown={(e) => e.key === "Enter" && handleApply()}
      />
      <Button
        size="sm"
        className="h-9 shrink-0"
        onClick={handleApply}
        disabled={!code.trim() || isPending}
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-9 shrink-0"
        onClick={() => { setExpanded(false); setCode(""); }}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
