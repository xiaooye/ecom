import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";

/**
 * GET /health
 * Health check endpoint for Railway, load balancers, and monitoring.
 * Returns service status and uptime.
 */
export async function GET(_req: MedusaRequest, res: MedusaResponse) {
  return res.json({
    status: "healthy",
    service: "medusa-backend",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || "0.0.1",
  });
}
