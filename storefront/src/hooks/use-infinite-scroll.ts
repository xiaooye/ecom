"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollOptions<T> {
  fetcher: (offset: number, limit: number) => Promise<{ items: T[]; total: number }>;
  limit?: number;
}

/**
 * Infinite scroll hook using IntersectionObserver.
 * Automatically loads more items when sentinel element is in view.
 */
export function useInfiniteScroll<T>({
  fetcher,
  limit = 12,
}: UseInfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const offsetRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const { items: newItems, total } = await fetcher(offsetRef.current, limit);
      setItems((prev) => [...prev, ...newItems]);
      offsetRef.current += newItems.length;
      setHasMore(offsetRef.current < total);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [fetcher, limit, loading, hasMore]);

  // Initial load
  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Intersection observer for auto-loading
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && hasMore) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loading, hasMore, loadMore]);

  return {
    items,
    loading,
    hasMore,
    initialLoad,
    sentinelRef,
  };
}
