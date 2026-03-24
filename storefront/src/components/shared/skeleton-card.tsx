import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
  imageAspect?: string;
  lines?: number;
}

/**
 * Configurable skeleton card for content loading states.
 * Supports different image aspects and text line counts.
 */
export function SkeletonCard({
  className,
  imageAspect = "aspect-[3/4]",
  lines = 2,
}: SkeletonCardProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Skeleton className={cn("w-full rounded-xl", imageAspect)} />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{ width: `${100 - i * 25}%` }}
        />
      ))}
    </div>
  );
}

/**
 * Pre-configured skeleton grids.
 */
export function ProductGridSkeleton2({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 rounded-xl border p-4">
          <Skeleton className="h-20 w-20 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
