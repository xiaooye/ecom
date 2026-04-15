import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import {
  Database,
  Globe,
  Layout,
  Server,
  CreditCard,
  Star,
  Webhook,
  ShieldCheck,
  Layers,
  TestTube,
  ArrowRight,
  Code2,
  Brain,
  RefreshCw,
  Blocks,
  MessagesSquare,
  MapPin,
  Clock,
  Languages,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About & Architecture",
  description:
    "Built by Wei — System Architect & Senior Full Stack Developer. Legacy modernization, AI integration, and production-grade architecture.",
};

// ── Developer Services ──────────────────────────────────────
const services = [
  {
    icon: RefreshCw,
    title: "Vue 2 to Vue 3 Migration",
    description:
      "Options API to Composition API, Vuex to Pinia, Webpack to Vite, mixin spaghetti to composables. Phased migration plans that don't break what's already working.",
  },
  {
    icon: Brain,
    title: "AI Integration & LLM Features",
    description:
      "RAG pipelines, Claude/OpenAI APIs, MCP servers, AI-assisted workflows, smart search, and custom agents. Production AI infrastructure, not just API calls.",
  },
  {
    icon: Code2,
    title: "Full-Stack Web Development",
    description:
      "Vue 3 + Nuxt 3 (primary), React + Next.js, Tailwind CSS on the frontend. PostgreSQL, MySQL, SQL Server, REST APIs, and Node.js on the backend.",
  },
  {
    icon: Blocks,
    title: "Legacy Modernization",
    description:
      "jQuery, ASP, PHP templates, aging Angular — incremental modernization that delivers value at every step. No reckless rewrites.",
  },
  {
    icon: MessagesSquare,
    title: "Architecture & Technical Leadership",
    description:
      "Tech stack evaluation, code review, architecture recommendations, technical specs, and prototype-to-handoff workflows.",
  },
];

// ── Tech Stack ──────────────────────────────────────────────
const techStack = [
  {
    name: "Next.js 15",
    role: "Storefront",
    description: "App Router, React 19, server components, ISR with tag-based revalidation",
    icon: Layout,
  },
  {
    name: "Medusa.js v2",
    role: "Commerce Engine",
    description: "Headless commerce with products, orders, payments, inventory, and admin dashboard",
    icon: Server,
  },
  {
    name: "PostgreSQL + Redis",
    role: "Data Layer",
    description: "Relational storage for commerce data, Redis for session cache and job queues",
    icon: Database,
  },
  {
    name: "Stripe",
    role: "Payments",
    description: "PCI-compliant payment processing via Medusa's built-in Stripe integration",
    icon: CreditCard,
  },
  {
    name: "Tailwind v4 + shadcn/ui",
    role: "Design System",
    description: "Token-driven styling with accessible, composable UI primitives",
    icon: Layers,
  },
  {
    name: "Vitest + Playwright",
    role: "Testing",
    description: "38 unit/integration tests and 21 end-to-end tests across the storefront",
    icon: TestTube,
  },
];

const customModules = [
  {
    name: "Review Module",
    description: "Custom Medusa module with model, service, migrations, store + admin API routes, and admin moderation widget.",
    icon: Star,
  },
  {
    name: "Webhook Module",
    description: "Event-driven webhook dispatch with configurable endpoints, delivery logging, and retry logic.",
    icon: Webhook,
  },
  {
    name: "Event Subscribers",
    description: "6 event handlers: order confirmation, customer welcome, inventory alerts, view tracking, ISR revalidation, webhook dispatch.",
    icon: Globe,
  },
];

const metrics = [
  { label: "Components", value: "280+" },
  { label: "Custom Hooks", value: "12" },
  { label: "Test Files", value: "59" },
  { label: "Zustand Stores", value: "5" },
  { label: "API Routes", value: "15" },
  { label: "Pages", value: "23" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "About & Architecture" }]} />

      {/* ═══════════════════════════════════════════════════
          SECTION 1: Developer Profile
          ═══════════════════════════════════════════════════ */}
      <div className="mt-10">
        {/* Status + Name */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Available for hire — 20+ hrs/week
          </div>
          <h1 className="font-display mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Built by Wei
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            System Architect & Senior Full Stack Developer
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            I help companies modernize legacy web applications and ship AI-powered
            features — with architecture decisions tested in production, not just
            in tutorials. Vue, React, Node, SQL — the framework changes, the
            engineering principles don&apos;t.
          </p>
        </div>

        {/* Quick facts */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> Georgia, US (ET)
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> Responds within 2 hours
          </span>
          <span className="flex items-center gap-1.5">
            <Languages className="h-3.5 w-3.5" /> English & Chinese
          </span>
        </div>

        {/* Social links */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <SocialLink href="https://www.upwork.com/freelancers/weidev" label="Upwork Profile" />
          <SocialLink href="https://wei-dev.com" label="Portfolio" />
          <SocialLink href="https://github.com/xiaooye" label="GitHub" />
          <SocialLink href="https://www.linkedin.com/in/wei-xin-029527158/" label="LinkedIn" />
        </div>
      </div>

      {/* ── Current Work ─────────────────────────────────── */}
      <div className="mt-16">
        <h2 className="font-display text-center text-2xl font-bold">
          What I Do Right Now
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(28,60%,48%)]">
              Enterprise Migration
            </p>
            <h3 className="mt-2 text-sm font-semibold">
              ASP → Vue 2 → Vite + Vue 3
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Leading one of the most complex frontend migrations a team can face:
              taking a legacy ASP application with injected inline scripts, through
              a Vue 2 intermediate layer, all the way to a fully bundled Vite + Vue 3
              architecture. Live migration on an enterprise product — no downtime,
              no regressions. I designed the strategy, built the tooling, and guide
              the team through execution.
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(28,60%,48%)]">
              Production AI
            </p>
            <h3 className="mt-2 text-sm font-semibold">
              RAG Pipelines & LLM Workflows
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Architected AI integration from scratch: RAG pipelines for domain-specific
              knowledge retrieval, MCP server configuration, Claude-powered features with
              structured prompting, and LLM-driven workflows now running in production.
              This isn&apos;t &ldquo;I called the OpenAI API once&rdquo; — it&apos;s production AI
              infrastructure serving real users.
            </p>
          </div>
        </div>
      </div>

      {/* ── Framework Philosophy ────────────────────────── */}
      <div className="mt-12 rounded-xl border border-[hsl(28,60%,48%)]/20 bg-[hsl(28,60%,48%)]/5 p-6">
        <p className="text-sm font-semibold">
          &ldquo;Why is this project React if you specialize in Vue?&rdquo;
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Because senior engineers aren&apos;t defined by a framework — they&apos;re defined by
          the problems they solve. My day job is Vue 3 + Vite at enterprise scale.
          I built this project in Next.js + React to prove the point: the architecture
          patterns — headless commerce, event-driven backends, type-safe data layers,
          graceful degradation — are the same regardless of the view layer. A monorepo
          is a monorepo. A custom module is a custom module. The thinking transfers.
        </p>
      </div>

      {/* ── Services ─────────────────────────────────────── */}
      <div className="mt-16">
        <h2 className="font-display text-center text-2xl font-bold">
          What I Can Do For You
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((svc) => (
            <div
              key={svc.title}
              className="card-hover rounded-xl border bg-card p-5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(28,60%,48%)]/10">
                <svc.icon className="h-4 w-4 text-[hsl(28,60%,48%)]" />
              </div>
              <h3 className="mt-3 text-sm font-semibold">{svc.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {svc.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Hire CTA ─────────────────────────────────────── */}
      <div className="mt-16 overflow-hidden rounded-2xl bg-[hsl(24,12%,8%)] p-8 text-center text-white sm:p-12">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          Let&apos;s Work Together
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-[hsl(30,15%,65%)]">
          I communicate proactively, ask good questions upfront, and build the
          right thing the first time. You&apos;ll never have to chase me for updates.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="https://www.upwork.com/freelancers/weidev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-[hsl(24,12%,8%)] transition-colors hover:bg-[hsl(36,30%,92%)]"
          >
            Hire Me on Upwork
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="mailto:contact@wei-dev.com"
            className="inline-flex items-center gap-2 rounded-lg border border-[hsl(30,15%,30%)] px-6 py-3 text-sm font-medium transition-colors hover:bg-white/10"
          >
            contact@wei-dev.com
          </a>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          SECTION 2: Architecture Showcase
          ═══════════════════════════════════════════════════ */}
      <div className="mt-20 border-t pt-16">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(28,60%,48%)]">
            Project Deep Dive
          </p>
          <h2 className="font-display mt-2 text-2xl font-bold sm:text-3xl">
            How THREAD Is Built
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            A full-stack e-commerce platform demonstrating production-grade
            architecture: headless commerce, custom modules, type-safe data layer,
            and comprehensive testing.
          </p>
        </div>
      </div>

      {/* ── Architecture Diagram ─────────────────────────── */}
      <div className="mt-12">
        <h3 className="font-display text-center text-xl font-bold">
          System Architecture
        </h3>
        <div className="mt-8 overflow-hidden rounded-2xl border bg-card p-6 sm:p-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl border-2 border-dashed border-[hsl(28,60%,48%)]/30 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(28,60%,48%)]">
                Client Layer
              </p>
              <div className="mt-4 space-y-3">
                <ArchNode label="Next.js 15 Storefront" sub="React 19 · App Router · RSC" />
                <ArchNode label="Tailwind v4 + shadcn/ui" sub="280+ components" />
                <ArchNode label="Zustand Stores" sub="Cart · Wishlist · Compare · Region" />
                <ArchNode label="Framer Motion" sub="Transitions + parallax" />
              </div>
            </div>
            <div className="rounded-xl border-2 border-dashed border-primary/20 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Commerce Layer
              </p>
              <div className="mt-4 space-y-3">
                <ArchNode label="Medusa.js v2" sub="Products · Orders · Inventory · Admin" />
                <ArchNode label="Custom Review Module" sub="Model · Service · API · Widget" />
                <ArchNode label="Custom Webhook Module" sub="Dispatch · Logging · Test" />
                <ArchNode label="6 Event Subscribers" sub="Orders · Email · Revalidation" />
              </div>
            </div>
            <div className="rounded-xl border-2 border-dashed border-muted-foreground/20 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Infrastructure
              </p>
              <div className="mt-4 space-y-3">
                <ArchNode label="PostgreSQL" sub="Commerce data + custom modules" />
                <ArchNode label="Redis" sub="Sessions · Job queue · Cache" />
                <ArchNode label="Stripe" sub="Payment processing (test mode)" />
                <ArchNode label="Vercel + Railway" sub="Edge CDN + managed hosting" />
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>Storefront</span>
            <span className="text-primary">→ Medusa SDK →</span>
            <span>Commerce API</span>
            <span className="text-primary">→ ORM →</span>
            <span>PostgreSQL</span>
          </div>
        </div>
      </div>

      {/* ── Demo Mode Pattern ────────────────────────────── */}
      <div className="mt-16">
        <h3 className="font-display text-center text-xl font-bold">
          Demo Mode Architecture
        </h3>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          How this portfolio demo works without a live backend
        </p>
        <div className="mt-8 overflow-hidden rounded-2xl border bg-card p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-semibold">Data Wrapper Pattern</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                A <code className="rounded bg-muted px-1.5 py-0.5 text-xs">lib/data/</code> layer
                wraps every Medusa SDK call. Each function tries the real API first, then
                falls back to typed static data with filtering, pagination, and search.
              </p>
              <pre className="mt-4 overflow-x-auto rounded-lg bg-[hsl(24,12%,8%)] p-4 text-xs text-[hsl(30,15%,70%)]">
{`async function listProducts(params) {
  try {
    return await medusaSDK.list(params);
  } catch {
    // Medusa unavailable → demo data
    return filterAndPaginate(
      demoProducts, params
    );
  }
}`}
              </pre>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Why This Pattern</h4>
              <ul className="mt-2 space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(28,60%,48%)]" />
                  <span><strong className="text-foreground">Zero runtime overhead</strong> — static TypeScript data, no mock server</span>
                </li>
                <li className="flex gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(28,60%,48%)]" />
                  <span><strong className="text-foreground">Type-safe</strong> — demo data matches the real Product interface exactly</span>
                </li>
                <li className="flex gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(28,60%,48%)]" />
                  <span><strong className="text-foreground">Transparent</strong> — a demo badge signals the mode to viewers</span>
                </li>
                <li className="flex gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(28,60%,48%)]" />
                  <span><strong className="text-foreground">Reversible</strong> — connect a real backend and the wrappers pass through</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tech Stack ───────────────────────────────────── */}
      <div className="mt-16">
        <h3 className="font-display text-center text-xl font-bold">
          Tech Stack
        </h3>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {techStack.map((tech) => (
            <div key={tech.name} className="card-hover rounded-xl border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <tech.icon className="h-4 w-4 text-[hsl(28,60%,48%)]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">{tech.name}</h4>
                  <p className="text-xs text-muted-foreground">{tech.role}</p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {tech.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Custom Modules ───────────────────────────────── */}
      <div className="mt-16">
        <h3 className="font-display text-center text-xl font-bold">
          Custom Medusa Modules
        </h3>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Built beyond the defaults to demonstrate extensibility
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {customModules.map((mod) => (
            <div key={mod.name} className="card-hover rounded-xl border bg-card p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <mod.icon className="h-4 w-4 text-[hsl(28,60%,48%)]" />
              </div>
              <h4 className="mt-3 text-sm font-semibold">{mod.name}</h4>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {mod.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Metrics ──────────────────────────────────────── */}
      <div className="mt-16 mb-8">
        <h3 className="font-display text-center text-xl font-bold">
          By the Numbers
        </h3>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-xl border bg-card p-4 text-center">
              <p className="font-display text-2xl font-bold text-[hsl(28,60%,48%)]">
                {m.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Source Code CTA ──────────────────────────────── */}
      <div className="mt-8 mb-16 rounded-2xl border bg-card p-8 text-center">
        <h3 className="font-display text-xl font-bold">
          Explore the Source Code
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This entire project is open source. Browse the monorepo, read the
          commit history, and see how every feature was built.
        </p>
        <a
          href="https://github.com/xiaooye/ecom"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current" aria-hidden>
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          View on GitHub
        </a>
      </div>
    </div>
  );
}

function ArchNode({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="rounded-lg border bg-background px-3 py-2.5">
      <p className="text-xs font-semibold">{label}</p>
      <p className="text-[10px] text-muted-foreground">{sub}</p>
    </div>
  );
}

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      {label}
      <ArrowRight className="h-3 w-3" />
    </a>
  );
}
