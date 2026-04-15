import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about THREAD.",
};

const faqs = [
  {
    q: "How do I find my size?",
    a: "Check our Size Guide page for detailed measurements. If you're between sizes, we recommend sizing up for a relaxed fit or sizing down for a slim fit.",
  },
  {
    q: "What is your return policy?",
    a: "We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in their original condition with all tags attached. Visit our Returns & Exchanges page for details.",
  },
  {
    q: "How long does shipping take?",
    a: "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business day delivery. Free shipping on orders over $50.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes! We ship to multiple countries across Europe and North America. Shipping rates and delivery times vary by region.",
  },
  {
    q: "How can I track my order?",
    a: "Once your order ships, you'll receive an email with a tracking number. You can also view your order status in the Account > Orders section.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, American Express) through our secure Stripe payment processing.",
  },
  {
    q: "Can I modify or cancel my order?",
    a: "Orders can be modified or cancelled within 1 hour of placement. After that, please contact our support team and we'll do our best to help.",
  },
  {
    q: "How do I care for my clothes?",
    a: "Care instructions are provided on each product page under the 'Details & Care' tab. Generally, we recommend washing in cold water and tumble drying on low.",
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "FAQ" }]} />
      <h1 className="font-display mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
        Frequently Asked Questions
      </h1>
      <p className="mt-2 text-muted-foreground">
        Find answers to common questions about our products and services.
      </p>

      <Accordion type="single" collapsible className="mt-8">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left text-sm font-medium">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
