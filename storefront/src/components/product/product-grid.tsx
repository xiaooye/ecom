"use client";

import { useState } from "react";
import { ProductCard } from "./product-card";
import { ProductListItem } from "./product-list-item";
import { ViewToggle } from "./view-toggle";
import { StaggerGrid, StaggerItem } from "@/components/shared/motion";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem as staggerItemVariant } from "@/components/shared/motion";
import type { Product } from "@/lib/types";

export function ProductGrid({ products }: { products: Product[] }) {
  const [view, setView] = useState<"grid" | "list">("grid");

  if (products.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No products found.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <ViewToggle view={view} onChange={setView} />
      </div>

      {view === "grid" ? (
        <StaggerGrid>
          {products.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      ) : (
        <motion.div
          className="flex flex-col gap-3"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={staggerItemVariant}>
              <ProductListItem product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
