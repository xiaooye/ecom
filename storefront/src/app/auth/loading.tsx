import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <Skeleton className="mx-auto h-8 w-48" />
      <Skeleton className="mx-auto mt-2 h-4 w-64" />
      <div className="mt-8 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
