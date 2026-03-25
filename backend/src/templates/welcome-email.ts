interface WelcomeEmailData {
  firstName?: string;
  email: string;
}

export function welcomeEmailTemplate(data: WelcomeEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="margin: 0; font-size: 24px; font-weight: bold;">WebStore</h1>
    </div>

    <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <h2 style="margin: 0 0 8px; font-size: 20px;">Welcome to WebStore!</h2>
      <p style="margin: 0 0 24px; color: #6b7280; font-size: 14px; line-height: 1.6;">
        Hi ${data.firstName || "there"}, thanks for creating an account.
        You're now part of our community of fashion-forward shoppers.
      </p>

      <div style="margin-bottom: 24px;">
        <h3 style="margin: 0 0 12px; font-size: 16px;">What you can do now:</h3>
        <ul style="margin: 0; padding-left: 20px; color: #6b7280; font-size: 14px; line-height: 2;">
          <li>Browse our latest collections</li>
          <li>Save items to your wishlist</li>
          <li>Get faster checkout with saved addresses</li>
          <li>Track your orders easily</li>
        </ul>
      </div>

      <div style="text-align: center;">
        <a href="#" style="display: inline-block; background: #171717; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">
          Start Shopping
        </a>
      </div>

      <p style="margin: 24px 0 0; color: #9ca3af; font-size: 12px; text-align: center;">
        Use code <strong>WELCOME10</strong> for 10% off your first order!
      </p>
    </div>

    <div style="text-align: center; margin-top: 32px; font-size: 12px; color: #9ca3af;">
      <p>You received this email because you signed up at WebStore.</p>
      <p>&copy; ${new Date().getFullYear()} WebStore. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}
