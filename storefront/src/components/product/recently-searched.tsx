"use client";

import { useEffect, useState } from "react";
import { Clock, X } from "lucide-react";

const STORAGE_KEY = "webstore-recent-searches";
const MAX_SEARCHES = 5;

export function useRecentSearches() {
  const [searches, setSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSearches(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const addSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...searches.filter((s) => s !== trimmed)].slice(0, MAX_SEARCHES);
    setSearches(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const removeSearch = (query: string) => {
    const updated = searches.filter((s) => s !== query);
    setSearches(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const clearAll = () => {
    setSearches([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { searches, addSearch, removeSearch, clearAll };
}

interface RecentSearchesProps {
  onSelect: (query: string) => void;
}

export function RecentSearches({ onSelect }: RecentSearchesProps) {
  const { searches, removeSearch, clearAll } = useRecentSearches();

  if (searches.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">Recent searches</p>
        <button
          onClick={clearAll}
          className="text-xs text-muted-foreground hover:text-primary"
        >
          Clear all
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {searches.map((query) => (
          <div
            key={query}
            className="flex items-center gap-1 rounded-full border bg-muted/50 px-3 py-1 text-xs"
          >
            <button onClick={() => onSelect(query)} className="flex items-center gap-1 hover:text-primary">
              <Clock className="h-3 w-3" />
              {query}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); removeSearch(query); }}
              className="ml-0.5 text-muted-foreground hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
