import { NextResponse } from "next/server";

/**
 * GET /api/health
 * Health check endpoint for monitoring services (Vercel, uptime monitors).
 */
export async function GET() {
  const medusaUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
  let backendStatus = "unknown";

  if (medusaUrl) {
    try {
      const res = await fetch(`${medusaUrl}/health`, {
        signal: AbortSignal.timeout(5000),
      });
      backendStatus = res.ok ? "healthy" : "unhealthy";
    } catch {
      backendStatus = "unreachable";
    }
  }

  return NextResponse.json({
    status: "healthy",
    service: "storefront",
    timestamp: new Date().toISOString(),
    dependencies: {
      medusa: backendStatus,
    },
  });
}
