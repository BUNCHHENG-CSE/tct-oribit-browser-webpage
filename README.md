# TCT Orbit — Marketing Website & Web Platform

A modern, production-quality marketing website for **TCT Orbit**, a fast, private, distraction-free desktop web browser for Windows, macOS, and Linux.

- **Product Name**: TCT Orbit
- **Developed By**: The Capy Team (TCT)
- **Browser Repository**: [https://github.com/BUNCHHENG-CSE/tct-orbit-browser](https://github.com/BUNCHHENG-CSE/tct-orbit-browser)
- **Domain**: [tctorbit.com](https://tctorbit.com)
- **Support Email**: [support@tctorbit.com](mailto:support@tctorbit.com)
- **Current Version**: v0.1.2
- **Taglines**: *"Browse in orbit. Focused, fast, private."* / *"The browser that stays out of your way."*

---

## Technical Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React Server Components, Server Actions, Turbopack, React 19)
- **Language**: TypeScript in strict mode
- **Styling**: Tailwind CSS v4 (`@theme` CSS-first config)
- **UI Primitives**: [shadcn/ui](https://ui.shadcn.com/) (Button, Card, Tabs, Accordion, Dialog, Sheet, NavigationMenu, Table, Badge, Input, Textarea, Select, DropdownMenu, Separator, Tooltip, Sonner)
- **Icons**: Lucide React
- **Theme Engine**: `next-themes` (light / dark / system)
- **Database**: [Neon PostgreSQL](https://neon.tech/) (Serverless PostgreSQL with connection pooling)
- **ORM**: [Prisma ORM](https://www.prisma.io/) with `@prisma/adapter-neon` + `@neondatabase/serverless`
- **Validation**: Zod + React Hook Form
- **Security & Privacy**:
  - Middleware-protected `/admin` with signed httpOnly cookies
  - In-memory rate limiting per hashed IP (raw IPs are NEVER stored or logged)
  - Honeypot protection against automated spam bots
  - Sanitized CDN geo-header download analytics
- **SEO & Quality**:
  - Full Metadata API integration
  - Dynamic Open Graph social cards (`/opengraph-image`)
  - Dynamic `sitemap.ts` and `robots.ts`
  - JSON-LD `SoftwareApplication` structured schema
  - WCAG AA compliant contrast and accessible keyboard navigation

---

## Architecture & Project Structure

```text
├── app/
│   ├── (marketing)/           # Public marketing routes
│   │   ├── page.tsx           # Home: Hero, FeatureRows (Spaces, Split View, Privacy), BuiltIn, FAQ, FinalCta
│   │   ├── features/          # Feature deep-dive with sticky TOC and kbd badges
│   │   ├── privacy-features/  # Technical architecture, SVG data locality diagram
│   │   ├── download/          # Release binaries (.exe, .dmg, .AppImage, .deb), SHA-256 copy, OS steps
│   │   ├── channels/          # Stable, Nova Beta, Deep Nightly, Canary + Waitlist
│   │   ├── changelog/         # All releases, markdown release notes, channel filter tabs
│   │   ├── blog/              # Technical journal, tag filters
│   │   │   └── [slug]/        # Post detail (generateStaticParams + ISR 3600s, OG cards, related articles)
│   │   ├── support/           # Real-time FAQ search, categories, feedback contact form
│   │   ├── privacy-policy/    # Zero-telemetry policy (marked for legal review)
│   │   └── terms/             # Terms of Service (marked for legal review)
│   ├── admin/                 # Password-protected admin console
│   │   ├── page.tsx           # Dashboard: stats by platform/channel, subscriber count, feedback log
│   │   ├── login/             # Password authentication
│   │   ├── releases/          # CRUD for releases and binary assets
│   │   ├── posts/             # CRUD for blog publications
│   │   └── faqs/              # CRUD for FAQ knowledge base
│   ├── api/
│   │   ├── download/[assetId] # 302 redirect & privacy-safe country download logging
│   │   └── admin/export-subscribers # CSV subscriber registry export
│   ├── layout.tsx             # Root layout with fonts, ThemeProvider, TooltipProvider, Sonner
│   ├── not-found.tsx          # "Lost in orbit" custom 404
│   ├── loading.tsx            # Orbital stream skeleton loader
│   ├── error.tsx              # Resilient error boundary
│   ├── sitemap.ts             # Dynamic sitemap with published posts
│   ├── robots.ts              # Robots directives
│   └── opengraph-image.tsx    # High-resolution dynamic OG card generator
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── layout/                # Header, Footer, OrbitLogo, ThemeToggle
│   ├── mockups/               # BrowserMockup, ShieldPopoverMockup (pure JSX/Tailwind)
│   ├── sections/              # Hero, FeatureRows, BuiltIn, FaqAccordion, FinalCta, DownloadCards, etc.
│   ├── forms/                 # NewsletterForm, WaitlistForm
│   └── admin/                 # ReleaseCrudClient, PostCrudClient, FaqCrudClient
├── lib/
│   ├── db.ts                  # Hot-reload safe Prisma Client with Neon Serverless adapter
│   ├── auth-edge.ts           # Web Crypto HMAC token verification for Edge Middleware & Node
│   ├── os-detect.ts           # Client & Server OS detection (Windows / macOS / Linux)
│   ├── rate-limit.ts          # Salted SHA-256 in-memory sliding window rate limiter
│   ├── validations.ts         # Zod schemas for all forms and mutations
│   ├── queries/               # Typed data fetchers (releases, posts, faqs, stats)
│   └── actions/               # Server Actions (newsletter, waitlist, feedback, admin CRUD)
├── prisma/
│   ├── schema.prisma          # Database schema (Release, ReleaseAsset, DownloadEvent, Subscriber, Post, Faq, Feedback)
│   └── seed.ts                # Realistic seed data for all tables
├── middleware.ts              # Admin route protection
└── prisma.config.ts           # Prisma 7 CLI configuration
```

---

## Setup & Local Development

### 1. Create a Neon Project
Create a Neon PostgreSQL database at [neon.tech](https://neon.tech) and copy:
1. The **Pooled connection string**
2. The **Direct connection string**

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in the values:
```env
DATABASE_URL="postgresql://neondb_owner:password@ep-something-pooler.region.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require"
DIRECT_URL="postgresql://neondb_owner:password@ep-something.region.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require"
ADMIN_PASSWORD="your-secure-admin-password"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. Install Dependencies
```bash
bun install
# or
npm install
```

### 4. Push Schema & Seed Database
Synchronize the Prisma schema with your Neon database:
```bash
bunx prisma db push
# or
npx prisma db push
```
Seed realistic data (v0.1.2 Stable, Nova Beta, Deep Nightly, Canary builds, 3 blog posts, 10 FAQs):
```bash
bun prisma/seed.ts
# or
npx prisma db seed
```

### 5. Run Local Development Server
```bash
bun run dev
# or
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Stealth Admin Gateway Access & Security

The administrative console has been hardened with a stealth security model to prevent bot discovery, credential stuffing, and brute-force scans:

- **Stealth URL**: Configurable via `ADMIN_SECRET_PATH` in `.env` (Default: `/orbit-mission-ctrl-8x92`)
  - Direct URL: [http://localhost:3000/orbit-mission-ctrl-8x92](http://localhost:3000/orbit-mission-ctrl-8x92)
- **Honeypot 404 Protection**: Direct requests to `/admin`, `/admin/*`, `/dashboard`, or `/wp-admin` automatically return an identical `404 Not Found` page with zero redirects or information leakage.
- **Login Rate Limiting**: Maximum 5 attempts per 15-minute window per hashed IP, with artificial constant-time response delay to prevent timing attacks.
- **Stealth Search Indexing**: The secret path is never exposed in `robots.txt` or public sitemaps; `/admin/` is retained in `robots.txt` as a decoy.
- **Password**: Enter the `ADMIN_PASSWORD` defined in your `.env` (e.g. `orbit-admin-secret-2026`).
- **Features**:
  - Real-time download metrics by Platform and Channel
  - One-click CSV export of subscribers
  - Full CRUD operations for Releases & Binary Assets
  - Full CRUD operations for Blog Articles & FAQs

---

## Deployment to Vercel

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Environment Variables in Vercel:
   - `DATABASE_URL` (Pooled Neon connection string)
   - `DIRECT_URL` (Direct Neon connection string)
   - `ADMIN_PASSWORD` (Secret admin console key)
   - `ADMIN_SECRET_PATH` (Stealth admin path slug, e.g. `orbit-mission-ctrl-8x92`)
   - `NEXT_PUBLIC_ADMIN_SECRET_PATH` (Same slug, exposed for client routing)
   - `NEXT_PUBLIC_SITE_URL` (Your production domain, e.g. `https://tctorbit.com`)
4. In Build Settings, set:
   - Build Command: `prisma generate && next build`
5. Deploy!

---

## Verification & Code Quality

Run the verification suite:
```bash
# Type check
bun x tsc --noEmit

# Lint
bun run lint

# Production build
bun run build
```

---

## License

Distributed under the Apache 2.0 License. See `LICENSE` for details.
