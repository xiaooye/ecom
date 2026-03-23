import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

// POST /store/contact
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);

  const { name, email, subject, message } = req.body as {
    name: string;
    email: string;
    subject: string;
    message: string;
  };

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Basic email format validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  logger.info(`Contact form submission from ${name} (${email}): ${subject}`);

  // TODO: Send email via Resend
  // await resend.emails.send({
  //   from: 'WebStore <noreply@webstore.com>',
  //   to: 'support@webstore.com',
  //   subject: `Contact Form: ${subject}`,
  //   html: `<p>From: ${name} (${email})</p><p>${message}</p>`,
  // });

  return res.json({ success: true, message: "Message sent successfully" });
}
