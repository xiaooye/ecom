"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RatingStars } from "@/components/shared/rating-stars";

interface ProductTabsProps {
  description?: string | null;
  material?: string;
  care?: string;
}

export function ProductTabs({
  description,
  material = "100% Premium Cotton",
  care = "Machine wash cold. Tumble dry low. Do not bleach.",
}: ProductTabsProps) {
  return (
    <Tabs defaultValue="description" className="mt-10">
      <TabsList className="w-full justify-start border-b bg-transparent p-0">
        <TabsTrigger
          value="description"
          className="rounded-none border-b-2 border-transparent px-6 pb-3 pt-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          Description
        </TabsTrigger>
        <TabsTrigger
          value="details"
          className="rounded-none border-b-2 border-transparent px-6 pb-3 pt-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          Details & Care
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="rounded-none border-b-2 border-transparent px-6 pb-3 pt-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          Reviews
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
              <p className="text-4xl font-bold">4.8</p>
              <RatingStars rating={4.8} size="md" />
              <p className="mt-1 text-xs text-muted-foreground">Based on 24 reviews</p>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {[
              { name: "Alex J.", rating: 5, text: "Great quality, fits perfectly. Very comfortable material.", date: "2 weeks ago" },
              { name: "Maria S.", rating: 4, text: "Love the design. Shipping was fast. Would buy again.", date: "1 month ago" },
              { name: "Tom K.", rating: 5, text: "Exceeded expectations. The fabric feels premium.", date: "1 month ago" },
            ].map((review) => (
              <div key={review.name} className="border-b pb-6 last:border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{review.name}</p>
                    <RatingStars rating={review.rating} size="sm" />
                  </div>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
