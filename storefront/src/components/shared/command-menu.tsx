"use client";

import { useCallback, useEffect, useState } from "react";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  Clock,
  ShoppingBag,
  LayoutGrid,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CommandItem {
  id: string;
  label: string;
  group: "navigation" | "products" | "actions";
  icon?: React.ReactNode;
  onSelect: () => void;
  keywords?: string[];
}

interface CommandMenuProps {
  items: CommandItem[];
  placeholder?: string;
  maxRecent?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const groupIcons: Record<string, React.ReactNode> = {
  navigation: <LayoutGrid className="h-4 w-4 text-muted-foreground" />,
  products: <ShoppingBag className="h-4 w-4 text-muted-foreground" />,
  actions: <Zap className="h-4 w-4 text-muted-foreground" />,
};

const groupLabels: Record<string, string> = {
  navigation: "Navigation",
  products: "Products",
  actions: "Actions",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Command palette (Cmd+K / Ctrl+K) with fuzzy search, recent items,
 * keyboard navigation, and grouped results. Built on cmdk.
 */
export function CommandMenu({
  items,
  placeholder = "Type a command or search...",
  maxRecent = 5,
  className,
}: CommandMenuProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [recentIds, setRecentIds] = useState<string[]>([]);

  // Open on Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = useCallback(
    (item: CommandItem) => {
      // Track recent
      setRecentIds((prev) => {
        const next = [item.id, ...prev.filter((id) => id !== item.id)];
        return next.slice(0, maxRecent);
      });

      item.onSelect();
      setOpen(false);
      setSearch("");
    },
    [maxRecent],
  );

  // Group items
  const grouped = items.reduce<Record<string, CommandItem[]>>((acc, item) => {
    const group = item.group;
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  const recentItems = recentIds
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is CommandItem => item !== undefined);

  return (
    <>
      {/* Inline trigger button (optional) */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted",
          className,
        )}
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="pointer-events-none ml-auto hidden select-none items-center gap-0.5 rounded border bg-background px-1.5 py-0.5 font-mono text-[10px] font-medium sm:inline-flex">
          <span className="text-xs">&#8984;</span>K
        </kbd>
      </button>

      {/* Command dialog */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <div className="relative flex items-start justify-center pt-[20vh]">
              <motion.div
                className="w-full max-w-lg overflow-hidden rounded-xl border bg-card shadow-2xl"
                initial={{ opacity: 0, scale: 0.96, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                <Command
                  shouldFilter={true}
                  className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
                >
                  {/* Search input */}
                  <div className="flex items-center gap-2 border-b px-4 py-3">
                    <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <Command.Input
                      value={search}
                      onValueChange={setSearch}
                      placeholder={placeholder}
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </div>

                  <Command.List className="max-h-80 overflow-y-auto p-2">
                    <Command.Empty className="px-3 py-6 text-center text-sm text-muted-foreground">
                      No results found.
                    </Command.Empty>

                    {/* Recent items */}
                    {recentItems.length > 0 && !search && (
                      <Command.Group heading="Recent">
                        {recentItems.map((item) => (
                          <CommandRow
                            key={`recent-${item.id}`}
                            item={item}
                            icon={<Clock className="h-4 w-4 text-muted-foreground" />}
                            onSelect={() => handleSelect(item)}
                          />
                        ))}
                      </Command.Group>
                    )}

                    {/* Grouped items */}
                    {(["navigation", "products", "actions"] as const).map(
                      (group) =>
                        grouped[group]?.length ? (
                          <Command.Group
                            key={group}
                            heading={groupLabels[group]}
                          >
                            {grouped[group].map((item) => (
                              <CommandRow
                                key={item.id}
                                item={item}
                                icon={item.icon ?? groupIcons[group]}
                                onSelect={() => handleSelect(item)}
                              />
                            ))}
                          </Command.Group>
                        ) : null,
                    )}
                  </Command.List>

                  {/* Footer hint */}
                  <div className="flex items-center justify-between border-t px-4 py-2 text-xs text-muted-foreground">
                    <span>Navigate with arrow keys</span>
                    <span>
                      <kbd className="rounded border bg-muted px-1 py-0.5 text-[10px]">
                        Esc
                      </kbd>{" "}
                      to close
                    </span>
                  </div>
                </Command>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function CommandRow({
  item,
  icon,
  onSelect,
}: {
  item: CommandItem;
  icon: React.ReactNode;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      value={`${item.label} ${item.keywords?.join(" ") ?? ""}`}
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors aria-selected:bg-muted"
    >
      {icon}
      <span className="flex-1">{item.label}</span>
      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-aria-selected:opacity-100" />
    </Command.Item>
  );
}
