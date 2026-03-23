import { model } from "@medusajs/framework/utils";

const Webhook = model.define("webhook", {
  id: model.id().primaryKey(),
  url: model.text(),
  events: model.json(), // Array of event names like ["order.placed", "product.updated"]
  secret: model.text().nullable(), // HMAC signing secret
  active: model.boolean().default(true),
  description: model.text().nullable(),
});

export default Webhook;
