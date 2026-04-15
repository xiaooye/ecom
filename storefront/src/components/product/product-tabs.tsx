"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RatingStars } from "@/components/shared/rating-stars";
import { ProductQA } from "./product-qa";
import { getReviewsForProduct } from "@/lib/data/products";
import { Star } from "lucide-react";

interface ProductTabsProps {
  description?: string | null;
  productId?: string;
  material?: string;
  care?: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days < 1) return "Today";
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
  return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`;
}

const tabTriggerClass =
  "rounded-none border-b-2 border-transparent px-6 pb-3 pt-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none";

export function ProductTabs({
  description,
  productId,
  material = "100% Premium Cotton",
  care = "Machine wash cold. Tumble dry low. Do not bleach.",
}: ProductTabsProps) {
  const reviews = productId ? getReviewsForProduct(productId) : [];
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 4.8;

  return (
    <Tabs defaultValue="description" className="mt-10">
      <TabsList className="w-full justify-start border-b bg-transparent p-0">
        <TabsTrigger value="description" className={tabTriggerClass}>
          Description
        </TabsTrigger>
        <TabsTrigger value="details" className={tabTriggerClass}>
          Details & Care
        </TabsTrigger>
        <TabsTrigger value="reviews" className={tabTriggerClass}>
          Reviews{reviews.length > 0 && ` (${reviews.length})`}
        </TabsTrigger>
        <TabsTrigger value="qa" className={tabTriggerClass}>
          Q&A
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6">
        {description ? (
          <p className="max-w-2xl leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : (
          <p className="text-muted-foreground">No description available.</p>
        )}
      </TabsContent>

      <TabsContent value="details" className="mt-6">
        <div className="max-w-2xl space-y-4">
          <div>
            <h3 className="text-sm font-semibold">Material</h3>
            <p className="mt-1 text-sm text-muted-foreground">{material}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Care Instructions</h3>
            <p className="mt-1 text-sm text-muted-foreground">{care}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Fit</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Regular fit. True to size. Model is 6&apos;1&quot; wearing size M.
            </p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-4xl font-bold">{avgRating.toFixed(1)}</p>
              <RatingStars rating={avgRating} size="md" />
              <p className="mt-1 text-xs text-muted-foreground">
                Based on {reviews.length || 24} review{reviews.length !== 1 ? "s" : ""}
              </p>
            </div>
            {/* Rating distribution */}
            <div className="flex-1 space-y-1">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = reviews.filter((r) => r.rating === stars).length;
                const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-2 text-xs">
                    <span className="flex w-6 items-center gap-0.5">
                      {stars}
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                    </span>
                    <div className="h-2 flex-1 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-yellow-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-6 text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {reviews.length > 0
              ? reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">{review.author_name}</p>
                        <RatingStars rating={review.rating} size="sm" />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {timeAgo(review.created_at)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium">{review.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {review.content}
                    </p>
                  </div>
                ))
              : [
                  { name: "Alex J.", rating: 5, text: "Great quality, fits perfectly.", date: "2 weeks ago" },
                  { name: "Maria S.", rating: 4, text: "Love the design. Would buy again.", date: "1 month ago" },
                ].map((review) => (
                  <div key={review.name} className="border-b pb-6 last:border-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">{review.name}</p>
                        <RatingStars rating={review.rating} size="sm" />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {review.date}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {review.text}
                    </p>
                  </div>
                ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="qa" className="mt-6">
        <ProductQA />
      </TabsContent>
    </Tabs>
  );
}
