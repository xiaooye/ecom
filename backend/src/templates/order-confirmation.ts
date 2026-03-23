interface OrderEmailData {
  displayId: number;
  email: string;
  firstName?: string;
  items: Array<{
    title: string;
    quantity: number;
    unitPrice: number;
  }>;
  subtotal: number;
  shippingTotal: number;
  taxTotal: number;
  total: number;
  currencyCode: string;
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

export function orderConfirmationTemplate(data: OrderEmailData): string {
  const itemRows = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
        ${item.title} &times; ${item.quantity}
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; text-align: right;">
        ${formatCurrency(item.unitPrice * item.quantity, data.currencyCode)}
      </td>
    </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="margin: 0; font-size: 24px; font-weight: bold;">WebStore</h1>
    </div>

    <!-- Main Card -->
    <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <h2 style="margin: 0 0 8px; font-size: 20px;">Order Confirmed!</h2>
      <p style="margin: 0 0 24px; color: #6b7280; font-size: 14px;">
        Hi ${data.firstName || "there"}, thanks for your order. We're getting it ready for you.
      </p>

      <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 13px; color: #6b7280;">Order Number</p>
        <p style="margin: 4px 0 0; font-size: 18px; font-weight: bold;">#${data.displayId}</p>
      </div>

      <!-- Items -->
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        ${itemRows}
      </table>

      <!-- Totals -->
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
        <tr>
          <td style="padding: 4px 0; color: #6b7280;">Subtotal</td>
          <td style="text-align: right;">${formatCurrency(data.subtotal, data.currencyCode)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #6b7280;">Shipping</td>
          <td style="text-align: right;">${formatCurrency(data.shippingTotal, data.currencyCode)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #6b7280;">Tax</td>
          <td style="text-align: right;">${formatCurrency(data.taxTotal, data.currencyCode)}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0 0; font-weight: bold; border-top: 2px solid #e5e7eb;">Total</td>
          <td style="padding: 12px 0 0; text-align: right; font-weight: bold; font-size: 16px; border-top: 2px solid #e5e7eb;">
            ${formatCurrency(data.total, data.currencyCode)}
          </td>
        </tr>
      </table>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; font-size: 12px; color: #9ca3af;">
      <p>If you have any questions, reply to this email or contact us at support@webstore.com</p>
      <p>&copy; ${new Date().getFullYear()} WebStore. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}
