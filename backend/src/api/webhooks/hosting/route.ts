import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import crypto from "crypto";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

/**
 * POST /webhooks/hosting
 *
 * Receives deployment webhook events from hosting platforms (Vercel, Railway).
 * Normalizes them into a common format and emits an event for the webhook dispatcher.
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);
  const secret = process.env.HOSTING_WEBHOOK_SECRET;

  // Verify webhook signature if secret is configured
  if (secret) {
    const signature = req.headers["x-webhook-signature"] as string | undefined;
    if (!signature) {
      return res.status(401).json({ error: "Missing webhook signature" });
    }

    const body = JSON.stringify(req.body);
    const expected = `sha256=${crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex")}`;

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return res.status(401).json({ error: "Invalid webhook signature" });
    }
  }

  const payload = req.body as Record<string, unknown>;
  const event = normalizeHostingEvent(payload, req.headers);

  if (!event) {
    logger.warn("Hosting webhook received with unrecognized format");
    return res.status(400).json({ error: "Unrecognized hosting event format" });
  }

  logger.info(
    `Hosting webhook: ${event.provider} deployment ${event.status} — ${event.url || "no url"}`
  );

  // Emit event for the webhook dispatcher subscriber to pick up
  const eventBus = req.scope.resolve(
    ContainerRegistrationKeys.EVENT_BUS
  ) as { emit: (event: string, data: Record<string, unknown>) => Promise<void> };

  await eventBus.emit("hosting.deployment", {
    provider: event.provider,
    status: event.status,
    environment: event.environment,
    url: event.url,
    commit_sha: event.commitSha,
    commit_message: event.commitMessage,
    branch: event.branch,
    timestamp: event.timestamp,
    raw: payload,
  });

  return res.json({ received: true, provider: event.provider, status: event.status });
}

interface NormalizedDeployEvent {
  provider: "vercel" | "railway" | "unknown";
  status: string;
  environment: string;
  url: string | null;
  commitSha: string | null;
  commitMessage: string | null;
  branch: string | null;
  timestamp: string;
}

function normalizeHostingEvent(
  payload: Record<string, unknown>,
  headers: Record<string, unknown>
): NormalizedDeployEvent | null {
  // Vercel deploy webhook format
  if (headers["x-vercel-signature"] || payload.type === "deployment") {
    return normalizeVercelEvent(payload);
  }

  // Railway webhook format
  if (headers["x-railway-signature"] || payload.type === "DEPLOY") {
    return normalizeRailwayEvent(payload);
  }

  // Generic format — allow custom integrations
  if (payload.provider && payload.status) {
    return {
      provider: "unknown",
      status: String(payload.status),
      environment: String(payload.environment || "production"),
      url: payload.url ? String(payload.url) : null,
      commitSha: payload.commit_sha ? String(payload.commit_sha) : null,
      commitMessage: payload.commit_message
        ? String(payload.commit_message)
        : null,
      branch: payload.branch ? String(payload.branch) : null,
      timestamp: new Date().toISOString(),
    };
  }

  return null;
}

function normalizeVercelEvent(
  payload: Record<string, unknown>
): NormalizedDeployEvent {
  const deployment = (payload.payload || payload) as Record<string, unknown>;
  const meta = (deployment.meta || {}) as Record<string, unknown>;
  const gitSource = (deployment.gitSource || {}) as Record<string, unknown>;

  return {
    provider: "vercel",
    status: String(deployment.state || deployment.readyState || "unknown"),
    environment: String(deployment.target || deployment.env || "production"),
    url: deployment.url ? String(deployment.url) : null,
    commitSha: (meta.githubCommitSha ||
      gitSource.sha ||
      null) as string | null,
    commitMessage: (meta.githubCommitMessage ||
      gitSource.message ||
      null) as string | null,
    branch: (meta.githubCommitRef ||
      gitSource.ref ||
      null) as string | null,
    timestamp: deployment.createdAt
      ? new Date(deployment.createdAt as number).toISOString()
      : new Date().toISOString(),
  };
}

function normalizeRailwayEvent(
  payload: Record<string, unknown>
): NormalizedDeployEvent {
  const deployment = (payload.deployment || payload) as Record<string, unknown>;
  const meta = (deployment.meta || {}) as Record<string, unknown>;

  return {
    provider: "railway",
    status: String(deployment.status || payload.status || "unknown"),
    environment: String(
      deployment.environment || payload.environment || "production"
    ),
    url: deployment.url ? String(deployment.url) : null,
    commitSha: (meta.commitHash ||
      deployment.commitSha ||
      null) as string | null,
    commitMessage: (meta.commitMessage ||
      deployment.commitMessage ||
      null) as string | null,
    branch: (meta.branch || deployment.branch || null) as string | null,
    timestamp: deployment.createdAt
      ? String(deployment.createdAt)
      : new Date().toISOString(),
  };
}
