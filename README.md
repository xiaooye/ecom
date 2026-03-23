# WebStore — Clothing E-Commerce Platform

A full-featured clothing e-commerce store built with **Medusa.js v2** (commerce backend) and **Next.js 15** (storefront).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Commerce Backend | [Medusa.js v2](https://medusajs.com/) |
| Storefront | [Next.js 15](https://nextjs.org/) (App Router) |
| UI | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Payments | Stripe (via Medusa integration) |
| Auth | Medusa built-in (customer + admin) |
| State | Zustand |
| Email | Resend (via Medusa subscribers) |
| i18n | next-intl (English, extensible) |

## Project Structure

```
├── backend/          # Medusa.js v2 server
│   └── src/
│       ├── modules/  # Custom modules (reviews, wishlist)
│       ├── api/      # Custom API routes
│       ├── subscribers/ # Event handlers (emails)
│       └── admin/    # Admin dashboard extensions
│
└── storefront/       # Next.js 15 App Router
    └── src/
        ├── app/      # Pages and routes
        ├── components/ # UI components
        ├── lib/      # SDK, utilities, data fetching
        └── stores/   # Zustand state
```

## Features

**Built-in (Medusa):**
- Product management with variants (size, color, SKU)
- Inventory tracking
- Order lifecycle & returns
- Stripe payments
- Discounts & promotions
- Customer management
- Multi-currency pricing
- Admin dashboard

**Custom:**
- Product reviews & ratings
- Wishlist
- Email notifications (order confirmation, welcome)
- SEO (metadata, JSON-LD, sitemap)
- Size guide, contact form

## Hosting

| Service | Provider |
|---------|----------|
| Storefront | Vercel |
| Backend | Railway |
| PostgreSQL | Railway |
| Redis | Railway |

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp backend/.env.template backend/.env
cp storefront/.env.template storefront/.env.local

# Run backend (port 9000)
npm run dev --workspace=backend

# Run storefront (port 3000)
npm run dev --workspace=storefront
```

### Environment Variables

See `backend/.env.template` and `storefront/.env.template` for required variables.

## License

Private
