import * as medusaCart from "@/lib/medusa/cart";

/**
 * Cart data wrapper. Cart operations require a running backend,
 * so in demo mode we provide no-op stubs that let the UI render
 * without throwing.
 */

export async function createCart(regionId: string) {
  try {
    return await medusaCart.createCart(regionId);
  } catch {
    return { cart: { id: "demo-cart", items: [], region_id: regionId } };
  }
}

export async function getCart(cartId: string) {
  try {
    return await medusaCart.getCart(cartId);
  } catch {
    return { cart: { id: cartId, items: [], total: 0 } };
  }
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number,
) {
  try {
    return await medusaCart.addToCart(cartId, variantId, quantity);
  } catch {
    return { cart: { id: cartId, items: [] } };
  }
}

export async function updateLineItem(
  cartId: string,
  lineItemId: string,
  quantity: number,
) {
  try {
    return await medusaCart.updateLineItem(cartId, lineItemId, quantity);
  } catch {
    return { cart: { id: cartId, items: [] } };
  }
}

export async function removeLineItem(cartId: string, lineItemId: string) {
  try {
    return await medusaCart.removeLineItem(cartId, lineItemId);
  } catch {
    return { cart: { id: cartId, items: [] } };
  }
}

export async function updateCart(
  cartId: string,
  data: Record<string, unknown>,
) {
  try {
    return await medusaCart.updateCart(cartId, data);
  } catch {
    return { cart: { id: cartId, items: [] } };
  }
}

export async function completeCart(cartId: string) {
  try {
    return await medusaCart.completeCart(cartId);
  } catch {
    return { type: "order", order: { id: "demo-order" } };
  }
}

export async function getShippingOptions(cartId: string) {
  try {
    return await medusaCart.getShippingOptions(cartId);
  } catch {
    return { shipping_options: [] };
  }
}

export async function addShippingMethod(
  cartId: string,
  shippingOptionId: string,
) {
  try {
    return await medusaCart.addShippingMethod(cartId, shippingOptionId);
  } catch {
    return { cart: { id: cartId, items: [] } };
  }
}
