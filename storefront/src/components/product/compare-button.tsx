"use client";

import { ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCompareStore } from "@/stores/compare-store";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function CompareButton({ product }: { product: Product }) {
  const { isInCompare, addProduct, removeProduct } = useCompareStore();
  const inCompare = isInCompare(product.id);

  const handleToggle = () => {
    if (inCompare) {
      removeProduct(product.id);
      toast.success("Removed from comparison");
    } else {
      const added = addProduct(product);
      if (added) {
        toast.success("Added to comparison");
      } else {
        toast.error("Maximum 3 products to compare");
      }
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      className={cn(inCompare && "border-primary text-primary")}
    >
      <ArrowLeftRight className="mr-2 h-3.5 w-3.5" />
      {inCompare ? "Remove" : "Compare"}
    </Button>
  );
}
