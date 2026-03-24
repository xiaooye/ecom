"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRegionStore } from "@/stores/region-store";
import { cn } from "@/lib/utils";

const currencies = [
  { code: "usd", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
  { code: "eur", symbol: "€", name: "Euro", flag: "🇪🇺" },
  { code: "gbp", symbol: "£", name: "British Pound", flag: "🇬🇧" },
  { code: "cad", symbol: "C$", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "aud", symbol: "A$", name: "Australian Dollar", flag: "🇦🇺" },
];

/**
 * Currency selector dropdown with flag icons.
 * Updates the region store currency code.
 */
export function CurrencySelector() {
  const { currencyCode, setRegion, regionId, countryCode } = useRegionStore();
  const [selected, setSelected] = useState(
    currencies.find((c) => c.code === currencyCode) || currencies[0]
  );

  const handleSelect = (currency: (typeof currencies)[number]) => {
    setSelected(currency);
    setRegion(regionId || "", countryCode, currency.code);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2 text-xs">
          <span>{selected.flag}</span>
          <span className="uppercase">{selected.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {currencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => handleSelect(currency)}
            className={cn(
              "cursor-pointer",
              selected.code === currency.code && "bg-muted"
            )}
          >
            <span className="mr-2">{currency.flag}</span>
            <span className="flex-1">{currency.name}</span>
            <span className="text-xs text-muted-foreground">{currency.symbol}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
