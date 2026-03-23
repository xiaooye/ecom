"use client";

import { useState } from "react";
import { Ruler, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const sizeRanges = [
  { size: "S", minChest: 34, maxChest: 36 },
  { size: "M", minChest: 37, maxChest: 40 },
  { size: "L", minChest: 41, maxChest: 44 },
  { size: "XL", minChest: 45, maxChest: 48 },
];

export function SizeRecommendation() {
  const [chest, setChest] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleCalculate = () => {
    const value = Number(chest);
    if (!value || value < 30 || value > 60) {
      setResult(null);
      return;
    }

    const match = sizeRanges.find(
      (s) => value >= s.minChest && value <= s.maxChest
    );
    setResult(match?.size || "Custom sizing needed");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="h-auto p-0 text-xs text-muted-foreground">
          <Ruler className="mr-1 h-3 w-3" />
          Find Your Size
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Size Recommendation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter your chest measurement in inches and we&apos;ll recommend
            your size.
          </p>
          <div>
            <Label htmlFor="chest-measurement">Chest (inches)</Label>
            <Input
              id="chest-measurement"
              type="number"
              value={chest}
              onChange={(e) => setChest(e.target.value)}
              placeholder="e.g., 38"
              min={30}
              max={60}
            />
          </div>
          <Button onClick={handleCalculate} className="w-full">
            Get Recommendation
          </Button>

          {result && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 dark:bg-green-950">
              <Check className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium">
                We recommend size <strong>{result}</strong>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
