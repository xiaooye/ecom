"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
  total: number;
  limit: number;
}

export function PaginationControls({ total, limit }: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const offset = Number(searchParams.get("offset") || "0");
  const hasNext = offset + limit < total;
  const hasPrev = offset > 0;

  const navigate = (newOffset: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("offset", String(newOffset));
    router.push(`${pathname}?${params.toString()}`);
  };

  if (total <= limit) return null;

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => hasPrev && navigate(Math.max(0, offset - limit))}
            className={!hasPrev ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
        <PaginationItem>
          <span className="px-4 text-sm text-muted-foreground">
            {offset + 1}–{Math.min(offset + limit, total)} of {total}
          </span>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={() => hasNext && navigate(offset + limit)}
            className={!hasNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
