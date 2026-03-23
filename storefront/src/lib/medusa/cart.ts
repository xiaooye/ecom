import { sdk } from "@/lib/sdk";

export async function createCart(regionId: string) {
  return sdk.store.cart.create({ region_id: regionId });
}

export async function getCart(cartId: string) {
  return sdk.store.cart.retrieve(cartId, {
    fields:
      "+items,+items.variant,+items.product,+items.variant.calculated_price,+shipping_methods,+payment_collection",
  });
}

export async function addToCart(cartId: string, variantId: string, quantity: number) {
  return sdk.store.cart.createLineItem(cartId, {
    variant_id: variantId,
    quantity,
  });
}

export async function updateLineItem(
  cartId: string,
  lineItemId: string,
  quantity: number
) {
  return sdk.store.cart.updateLineItem(cartId, lineItemId, { quantity });
}

export async function removeLineItem(cartId: string, lineItemId: string) {
  return sdk.store.cart.deleteLineItem(cartId, lineItemId);
}

export async function updateCart(
  cartId: string,
  data: Record<string, unknown>
) {
  return sdk.store.cart.update(cartId, data);
}

export async function addShippingMethod(
  cartId: string,
  shippingOptionId: string
) {
  return sdk.store.cart.addShippingMethod(cartId, {
    option_id: shippingOptionId,
  });
}

export async function completeCart(cartId: string) {
  return sdk.store.cart.complete(cartId);
}

export async function getShippingOptions(cartId: string) {
  return sdk.store.fulfillment.listCartOptions({ cart_id: cartId });
}
