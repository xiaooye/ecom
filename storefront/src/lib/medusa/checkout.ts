import { sdk } from "@/lib/sdk";
import { getCart } from "./cart";

export async function initiatePaymentSession(cartId: string) {
  const { cart } = await getCart(cartId);
  return sdk.store.payment.initiatePaymentSession(
    cart,
    {
      provider_id: "pp_stripe_stripe",
    }
  );
}

export async function listCartPaymentMethods(regionId: string) {
  return sdk.store.payment.listPaymentProviders({
    region_id: regionId,
  });
}
