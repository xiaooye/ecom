import { model } from "@medusajs/framework/utils";

const Review = model.define("review", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  customer_id: model.text().nullable(),
  title: model.text(),
  content: model.text(),
  rating: model.number(),
  author_name: model.text(),
  status: model.enum(["pending", "approved", "rejected"]).default("pending"),
});

export default Review;
