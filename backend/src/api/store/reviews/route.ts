import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { REVIEW_MODULE } from "../../../modules/review";

// GET /store/reviews?product_id=xxx
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const reviewModuleService = req.scope.resolve(REVIEW_MODULE);
  const productId = req.query.product_id as string;

  if (!productId) {
    return res.status(400).json({ message: "product_id is required" });
  }

  const reviews = await reviewModuleService.listReviews(
    { product_id: productId, status: "approved" },
    { order: { created_at: "DESC" } }
  );

  return res.json({ reviews });
}

// POST /store/reviews
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const reviewModuleService = req.scope.resolve(REVIEW_MODULE);

  const { product_id, title, content, rating, author_name } = req.body as {
    product_id: string;
    title: string;
    content: string;
    rating: number;
    author_name: string;
  };

  if (!product_id || !title || !content || !rating || !author_name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  const review = await reviewModuleService.createReviews({
    product_id,
    title,
    content,
    rating,
    author_name,
    status: "pending",
  });

  return res.status(201).json({ review });
}
