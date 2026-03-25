import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

/**
 * GET /admin/analytics
 * Returns basic store analytics: order count, revenue, customer count.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  try {
    const { data: orders } = await query.graph({
      entity: "order",
      fields: ["id", "total", "currency_code", "status"],
    });

    const { data: customers } = await query.graph({
      entity: "customer",
      fields: ["id"],
    });

    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id"],
    });

    const totalRevenue = orders.reduce(
      (sum: number, o: { total?: number }) => sum + (o.total || 0),
      0
    );

    return res.json({
      analytics: {
        orders: {
          total: orders.length,
          revenue: totalRevenue,
        },
        customers: {
          total: customers.length,
        },
        products: {
          total: products.length,
        },
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return res.json({
      analytics: {
        orders: { total: 0, revenue: 0 },
        customers: { total: 0 },
        products: { total: 0 },
        generatedAt: new Date().toISOString(),
        error: "Analytics unavailable",
      },
    });
  }
}
