"use client";

import { Suspense, lazy, ComponentType } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface LazyComponentProps<T extends Record<string, unknown>> {
  loader: () => Promise<{ default: ComponentType<T> }>;
  props: T;
  fallback?: React.ReactNode;
}

/**
 * Generic lazy-loading wrapper with Suspense.
 * Loads components on demand with skeleton fallback.
 * Use for heavy components (3D viewer, charts, etc.).
 */
export function LazyComponent<T extends Record<string, unknown>>({
  loader,
  props,
  fallback,
}: LazyComponentProps<T>) {
  const Component = lazy(loader);

  return (
    <Suspense
      fallback={
        fallback || (
          <div className="flex items-center justify-center p-8">
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        )
      }
    >
      <Component {...props} />
    </Suspense>
  );
}
