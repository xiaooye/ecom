import { model } from "@medusajs/framework/utils";

const WebhookLog = model.define("webhook_log", {
  id: model.id().primaryKey(),
  webhook_id: model.text(),
  event: model.text(),
  url: model.text(),
  request_body: model.json(),
  response_status: model.number().nullable(),
  response_body: model.text().nullable(),
  success: model.boolean().default(false),
  attempt: model.number().default(1),
  error: model.text().nullable(),
});

export default WebhookLog;
