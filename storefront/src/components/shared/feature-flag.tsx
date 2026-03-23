"use client";

/**
 * Simple feature flag component for gradual feature rollouts.
 * Checks environment variable or localStorage for flag state.
 */
export function FeatureFlag({
  flag,
  children,
  fallback = null,
}: {
  flag: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  // Check environment variable first
  const envKey = `NEXT_PUBLIC_FF_${flag.toUpperCase()}`;
  const envValue = typeof window !== "undefined"
    ? (process.env[envKey] ?? "")
    : "";

  if (envValue === "true" || envValue === "1") {
    return <>{children}</>;
  }

  // Check localStorage for dev overrides
  if (typeof window !== "undefined") {
    const local = localStorage.getItem(`ff_${flag}`);
    if (local === "true") return <>{children}</>;
  }

  return <>{fallback}</>;
}
