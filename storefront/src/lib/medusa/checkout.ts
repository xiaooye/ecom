import { sdk } from "@/lib/sdk";

export async function initiatePaymentSession(cartId: string) {
  return sdk.store.payment.initiatePaymentSession(
    { cart_id: cartId },
    {},
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
