import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { WEBHOOK_MODULE } from "../../../../modules/webhook";
import { dispatchWebhook } from "../../../../modules/webhook/dispatcher";

// POST /admin/webhooks/:id — update webhook
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const webhookService = req.scope.resolve(WEBHOOK_MODULE);
  const { id } = req.params;

  const { url, events, secret, description, active } = req.body as {
    url?: string;
    events?: string[];
    secret?: string;
    description?: string;
    active?: boolean;
  };

  const updates: Record<string, unknown> = {};
  if (url !== undefined) updates.url = url;
  if (events !== undefined) updates.events = events;
  if (secret !== undefined) updates.secret = secret;
  if (description !== undefined) updates.description = description;
  if (active !== undefined) updates.active = active;

  const webhook = await webhookService.updateWebhooks(id, updates);
  return res.json({ webhook });
}

// DELETE /admin/webhooks/:id
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const webhookService = req.scope.resolve(WEBHOOK_MODULE);
  const { id } = req.params;

  await webhookService.deleteWebhooks(id);
  return res.json({ id, deleted: true });
}
