import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { WEBHOOK_MODULE } from "../../../modules/webhook";

// GET /admin/webhooks — list all registered webhooks
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const webhookService = req.scope.resolve(WEBHOOK_MODULE);
  const webhooks = await webhookService.listWebhooks();
  return res.json({ webhooks });
}

// POST /admin/webhooks — register a new webhook
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const webhookService = req.scope.resolve(WEBHOOK_MODULE);

  const { url, events, secret, description } = req.body as {
    url: string;
    events: string[];
    secret?: string;
    description?: string;
  };

  if (!url || !events || !Array.isArray(events) || events.length === 0) {
    return res.status(400).json({
      message: "url and events (non-empty array) are required",
    });
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    return res.status(400).json({ message: "Invalid URL format" });
  }

  const webhook = await webhookService.createWebhooks({
    url,
    events,
    secret: secret || null,
    description: description || null,
    active: true,
  });

  return res.status(201).json({ webhook });
}
