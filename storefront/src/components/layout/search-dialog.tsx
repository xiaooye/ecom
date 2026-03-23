"use client";

import { useEffect, useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getProductsList } from "@/lib/medusa/products";
import type { Product } from "@/lib/types";

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Cmd+K shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const search = useCallback(
    (value: string) => {
      setQuery(value);
      if (value.length < 2) {
        setResults([]);
        return;
      }

      startTransition(async () => {
        try {
          const response = await getProductsList({ q: value, limit: 6 });
          setResults((response.products ?? []) as Product[]);
        } catch {
          setResults([]);
        }
      });
    },
    []
  );

  const handleSelect = (handle: string) => {
    setOpen(false);
    setQuery("");
    setResults([]);
    router.push(`/products/${handle}`);
  };

  const handleSearchAll = () => {
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
    setResults([]);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 rounded-md border border-input bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted md:flex"
      >
        <Search className="h-3.5 w-3.5" />
        Search...
        <kbd className="pointer-events-none ml-4 hidden select-none rounded border bg-background px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground lg:inline">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search products..."
          value={query}
          onValueChange={search}
        />
        <CommandList>
          {isPending && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isPending && query.length >= 2 && results.length === 0 && (
            <CommandEmpty>No products found.</CommandEmpty>
          )}

          {results.length > 0 && (
            <CommandGroup heading="Products">
              {results.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.title}
                  onSelect={() => handleSelect(product.handle)}
                  className="cursor-pointer"
                >
                  <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                  {product.title}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {query.length >= 2 && (
            <CommandGroup>
              <CommandItem onSelect={handleSearchAll} className="cursor-pointer">
                <Search className="mr-2 h-4 w-4" />
                Search all for &ldquo;{query}&rdquo;
              </CommandItem>
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
