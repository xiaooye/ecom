export function formatPrice(
  amount: number | null | undefined,
  currencyCode: string = "usd"
): string {
  if (amount == null) return "";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount / 100);
}
