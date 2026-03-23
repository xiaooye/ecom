"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackButton({ label = "Back" }: { label?: string }) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.back()}
      className="mb-4"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
