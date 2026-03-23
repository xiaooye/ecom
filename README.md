# WebStore — Clothing E-Commerce Platform

A full-featured clothing e-commerce store built with **Medusa.js v2** (commerce backend) and **Next.js 15** (storefront) in a monorepo architecture.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Commerce Backend | [Medusa.js v2](https://medusajs.com/) | 2.13 |
| Storefront | [Next.js](https://nextjs.org/) (App Router) | 15.5 |
| UI Framework | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) | v4 |
| Animations | [Framer Motion](https://www.framer.com/motion/) | 11 |
| Payments | Stripe (via Medusa integration) | — |
| Auth | Medusa built-in (customer + admin) | — |
| State | [Zustand](https://zustand-demo.pmnd.rs/) | 5 |
| Email | Resend (via Medusa subscribers) | — |
| i18n | [next-intl](https://next-intl-docs.vercel.app/) | 4 |
| Analytics | Vercel Analytics + Speed Insights | — |

## Features

### Storefront
- **Homepage**: Animated hero, category grid, featured products, trust badges, testimonials, stats counter, Instagram feed, newsletter CTA
- **Product Catalog**: Grid/list view toggle, sort, price range filter, pagination, product badges (New/Sale/Sold Out)
- **Product Detail**: Image gallery (Embla carousel + zoom + lightbox), color swatches, size selector with chart modal, quantity picker, delivery estimate, share buttons, tabs (description/details/reviews), related products, recently viewed
- **Cart**: Slide-out cart drawer with animated items, full cart page, quantity management
- **Checkout**: Multi-step flow (information → shipping → payment) with visual stepper, Stripe integration
- **Account**: Orders with tracking timeline, addresses (CRUD), profile management
- **Search**: Cmd+K global search dialog with typeahead, dedicated search page
- **Wishlist**: Persistent wishlist with localStorage, heart overlay on cards
- **Product Comparison**: Compare up to 3 products side-by-side with floating bar

### UX Enhancements
- Dark mode with system detection
- Smart header (hides on scroll down, reveals on scroll up)
- Announcement bar with rotating promotions
- Mobile bottom navigation
- Scroll progress bar + back-to-top button
- Toast notifications (Sonner)
- Cookie consent banner (GDPR)
- Shimmer skeleton loading states
- Skip-to-content accessibility link
- PWA manifest for installable app

### Backend (Medusa)
- Custom review module (model, service, store + admin API routes)
- Admin review moderation widget
- Contact form API route
- Order placed + customer created event subscribers
- Order confirmation HTML email template
- Clothing seed script (30+ products, 6 categories)
- Stripe payment provider configuration

## Project Structure

```
├── backend/                    # Medusa.js v2 server
│   ├── medusa-config.ts        # DB, Redis, Stripe, modules config
│   ├── Procfile                # Railway deployment
│   ├── railway.toml            # Railway build config
│   └── src/
│       ├── modules/review/     # Custom review module
│       ├── api/store/          # Store API (reviews, contact)
│       ├── api/admin/          # Admin API (review moderation)
│       ├── subscribers/        # Event handlers (order, customer)
│       ├── templates/          # Email templates
│       ├── admin/widgets/      # Admin dashboard extensions
│       └── scripts/            # Seed scripts
│
└── storefront/                 # Next.js 15 App Router
    ├── vercel.json             # Vercel deployment config
    ├── public/manifest.json    # PWA manifest
    └── src/
        ├── app/                # 22+ routes
        ├── components/         # 50+ components
        │   ├── ui/             # shadcn/ui primitives (20+)
        │   ├── layout/         # header, footer, nav, search, cart sheet
        │   ├── product/        # cards, gallery, variants, filters
        │   ├── cart/            # items, summary
        │   ├── checkout/       # form, stepper
        │   ├── account/        # nav, timeline
        │   ├── home/           # hero, categories, featured, trust, testimonials
        │   └── shared/         # breadcrumbs, motion, scroll, countdown
        ├── lib/                # SDK, types, utilities, data fetching
        ├── stores/             # Zustand (cart, region, wishlist, compare, recent)
        └── i18n/               # Internationalization config
```

## Hosting

| Service | Provider | Config |
|---------|----------|--------|
| Storefront | Vercel | `storefront/vercel.json` |
| Backend | Railway | `backend/railway.toml` |
| PostgreSQL | Railway | Add-on service |
| Redis | Railway | Add-on service |

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/xiaooye/ecom.git
cd ecom

# Install all dependencies (both workspaces)
npm install

# Set up environment variables
cp backend/.env.template backend/.env
cp storefront/.env.template storefront/.env.local
```

### Development

```bash
# Start Medusa backend (port 9000)
npm run dev --workspace=backend

# Start Next.js storefront (port 3000)
npm run dev --workspace=storefront

# Seed the database with sample products
npm run seed --workspace=backend
```

### Environment Variables

**Backend** (`backend/.env`):
- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_URL` — Redis connection string
- `STRIPE_API_KEY` — Stripe secret key
- `JWT_SECRET` / `COOKIE_SECRET` — Auth secrets

**Storefront** (`storefront/.env.local`):
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL` — Medusa API URL
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` — Medusa publishable key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key

### Production Build

```bash
# Build storefront
npm run build --workspace=storefront

# Build backend
npm run build --workspace=backend
```

## Deployment

### Railway (Backend)

1. Connect your GitHub repo to Railway
2. Add PostgreSQL and Redis services
3. Set environment variables from `backend/.env.template`
4. Railway auto-deploys on push using `railway.toml`

### Vercel (Storefront)

1. Import the repo on Vercel
2. Set root directory to `storefront`
3. Add environment variables from `storefront/.env.template`
4. Vercel auto-deploys on push

## License

Private
