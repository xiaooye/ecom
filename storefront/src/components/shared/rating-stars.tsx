import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  count?: number;
}

const sizeMap = { sm: "h-3 w-3", md: "h-4 w-4", lg: "h-5 w-5" };

export function RatingStars({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  count,
}: RatingStarsProps) {
  const stars = [];
  const iconClass = sizeMap[size];

  for (let i = 1; i <= maxRating; i++) {
    if (rating >= i) {
      stars.push(
        <Star key={i} className={cn(iconClass, "fill-yellow-400 text-yellow-400")} />
      );
    } else if (rating >= i - 0.5) {
      stars.push(
        <StarHalf key={i} className={cn(iconClass, "fill-yellow-400 text-yellow-400")} />
      );
    } else {
      stars.push(
        <Star key={i} className={cn(iconClass, "text-gray-300")} />
      );
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      {showValue && (
        <span className="text-sm text-muted-foreground">{rating.toFixed(1)}</span>
      )}
      {count != null && (
        <span className="text-sm text-muted-foreground">({count})</span>
      )}
    </div>
  );
}
