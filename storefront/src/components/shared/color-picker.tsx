"use client";

import { useState, useEffect } from "react";
import { Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const themes = [
  { name: "Default", hue: 0, color: "#171717" },
  { name: "Blue", hue: 221, color: "#2563eb" },
  { name: "Green", hue: 142, color: "#16a34a" },
  { name: "Purple", hue: 270, color: "#9333ea" },
  { name: "Rose", hue: 350, color: "#e11d48" },
  { name: "Orange", hue: 25, color: "#ea580c" },
  { name: "Teal", hue: 174, color: "#0d9488" },
];

/**
 * Accent color picker that applies a CSS custom property override.
 * Persists choice in localStorage.
 */
export function ColorPicker() {
  const [selected, setSelected] = useState("Default");

  useEffect(() => {
    const stored = localStorage.getItem("ws-accent");
    if (stored) {
      const theme = themes.find((t) => t.name === stored);
      if (theme) {
        setSelected(theme.name);
        applyTheme(theme);
      }
    }
  }, []);

  const applyTheme = (theme: (typeof themes)[number]) => {
    if (theme.name === "Default") {
      document.documentElement.style.removeProperty("--color-primary");
      document.documentElement.style.removeProperty("--color-primary-foreground");
    } else {
      document.documentElement.style.setProperty(
        "--color-primary",
        `hsl(${theme.hue} 70% 45%)`
      );
      document.documentElement.style.setProperty(
        "--color-primary-foreground",
        "hsl(0 0% 100%)"
      );
    }
    localStorage.setItem("ws-accent", theme.name);
    setSelected(theme.name);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 p-2">
        <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
          Accent Color
        </p>
        <div className="grid grid-cols-4 gap-1.5">
          {themes.map((theme) => (
            <button
              key={theme.name}
              onClick={() => applyTheme(theme)}
              className={cn(
                "relative flex h-9 w-9 items-center justify-center rounded-full border-2 transition-transform hover:scale-110",
                selected === theme.name
                  ? "border-foreground"
                  : "border-transparent"
              )}
              style={{ backgroundColor: theme.color }}
              title={theme.name}
            >
              {selected === theme.name && (
                <Check className="h-3.5 w-3.5 text-white" />
              )}
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
