# Plately MVP Architecture and Implementation Guide

## System Architecture Overview

Plately is a multi‑tenant SaaS platform that consists of a public restaurant directory, individual restaurant websites with online ordering, a dashboard for restaurant owners, and an admin panel for operators. The application is built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **Prisma**, and **PostgreSQL**. Authentication is handled by **NextAuth**, billing and payments by **Stripe**, file storage by UploadThing/S3 (not yet implemented), and email notifications via Resend or similar.

The system is deployed as a single Next.js application. Multi‑tenancy is achieved by:

* A **main domain** (`plately.us`) that hosts the marketing site, discovery directory, and admin/owner dashboards.
* **Subdomain routing** for restaurant websites. The middleware inspects the host header, extracts the subdomain, and rewrites requests to an internal tenant route (`/r/[slug]`). This pattern is inspired by best practices for subdomain multi‑tenancy【348048569145108†L70-L124】. Custom domains are supported via a `DomainMapping` table and future lookup from a KV store.
* A **PostgreSQL** database with a schema designed to isolate restaurant data by `restaurantId` and `ownerId`, enabling per‑tenant access control.
* Role‑based access control: users have roles (`ADMIN`, `RESTAURANT_OWNER`, `CUSTOMER`) stored in the `User` model. Utility functions in `lib/rbac.ts` and layout guards enforce access restrictions.

## Folder Structure

The codebase uses a clean, modular layout. Key directories include:

| Path | Purpose |
| --- | --- |
| `/app` | Contains all route segments for Next.js App Router. Each folder corresponds to a route. |
| `/app/layout.tsx` | Global layout with the navbar, footer, and providers. |
| `/app/page.tsx` | Landing page (marketing site). |
| `/app/directory` | Public restaurant directory and dynamic restaurant pages. |
| `/app/r/[slug]` | Tenant route for subdomains (via middleware). |
| `/app/dashboard` | Protected dashboard for restaurant owners, with a sidebar and pages for menu, orders, etc. |
| `/app/admin` | Protected admin area. |
| `/app/auth/signin` | Sign‑in page for NextAuth credentials provider. |
| `/app/api/auth/[...nextauth]` | API route configuring NextAuth. |
| `/components` | Reusable UI components (Navbar, Footer, RestaurantCard, sidebars, Providers). |
| `/lib` | Application logic and utilities (Prisma client, auth configuration, RBAC helpers, Stripe helpers). |
| `/prisma` | Prisma schema and seed script. |
| `/public` | Static assets (currently unused). |
| `/middleware.ts` | Subdomain rewriting logic for multi‑tenancy【348048569145108†L70-L124】. |

## Prisma Schema

The Prisma schema (see `prisma/schema.prisma`) models all important entities:

* **User** – stores user accounts with roles (`ADMIN`, `RESTAURANT_OWNER`, `CUSTOMER`). Users can own restaurants and place orders.
* **Restaurant** – represents a tenant. Fields include `slug`, `priceLevel`, `planId`, `ownerId`, publication status, and relations to categories, menu items, orders, reviews, addresses, and domain mappings.
* **SubscriptionPlan** and **Subscription** – define pricing tiers and track each restaurant’s subscription, including Stripe IDs and billing dates.
* **DomainMapping** – manages subdomain and custom domain assignments with a status (`PENDING`, `VERIFIED`, `CONNECTED`).
* **CuisineTag** – tags for cuisine filtering and SEO pages. Restaurants have a many‑to‑many relation to cuisines.
* **MenuCategory**, **MenuItem**, **MenuItemModifierGroup**, **MenuItemModifierOption** – define hierarchical menu structures with optional modifiers and additional pricing.
* **Order**, **OrderItem**, **OrderItemModifier** – capture customer orders and item‑level details. Orders include statuses (`NEW`, `CONFIRMED`, etc.) and types (`PICKUP`, `DELIVERY`).
* **Review** – customer ratings with moderation status.
* **Address**, **BusinessHour**, **MediaAsset**, **City** – supporting tables for geolocation, hours, uploaded images, and city pages.
* **FeaturedPlacement**, **AnalyticsEvent**, **AdminActionLog** – support featured listings, basic analytics, and admin auditing.

## Route Map

Below is an overview of the main routes defined in the MVP:

| Route | Description |
| --- | --- |
| `/` | Landing page with hero, benefits, pricing tiers, and CTA. |
| `/directory` | Public directory listing published restaurants. |
| `/directory/[slug]` | Restaurant detail page showing menu, description, cuisines, and pricing. |
| `/r/[slug]` | Tenant route used by subdomains; identical to `/directory/[slug]` but resolved via middleware. |
| `/dashboard` | Restaurant owner dashboard home (protected). |
| `/dashboard/menu` | Manage menu categories and items (to be implemented). |
| `/dashboard/orders` | View and manage orders (to be implemented). |
| `/dashboard/settings` | Edit business profile, hours, and plan details (to be implemented). |
| `/admin` | Admin dashboard overview (protected). |
| `/admin/restaurants`, `/admin/orders`, `/admin/plans`, `/admin/domains` | Management screens for operators (future work). |
| `/auth/signin` | Credentials sign‑in form for NextAuth. |
| `/api/auth/[...nextauth]` | NextAuth API route for authentication. |
| Middleware | Intercepts requests to determine if the host is a subdomain of `plately.us` and rewrites to `/r/[slug]` accordingly【348048569145108†L70-L124】. |

## Component Map

Key React components include:

* **`Navbar`** – responsive navigation bar with links to the home page, directory, pricing, dashboard/admin links based on user role, and sign‑in/out actions.
* **`Footer`** – simple footer with the Plately tagline.
* **`RestaurantCard`** – displays restaurant name, price level, rating, and cuisine tags; used in the directory grid.
* **`DashboardSidebar` / `AdminSidebar`** – side navigation for protected dashboards.
* **`Providers`** – wraps the app in the NextAuth `SessionProvider` for client‑side access to sessions.
* **Pages** – server components defined under `/app` implement the marketing page, directory, restaurant pages, dashboards, and sign‑in page.

## Database Seed Strategy

The seed script `prisma/seed.ts` populates development data:

1. Upserts an admin user (`admin@plately.us`).
2. Seeds cuisine tags (`Italian`, `Mexican`, `Sushi`).
3. Adds a city entry (Los Angeles).
4. Creates a starter subscription plan with monthly and setup fees.
5. Creates a restaurant owner and a sample restaurant (“Mario’s Italian Kitchen”) with address, cuisine tag, and menu categories/items.
6. Inserts menu items under “Starters” and “Mains” categories with realistic pricing.

Run `npm run prisma:seed` after setting up the database to initialise the schema and sample data.

## Authentication & RBAC Plan

Authentication is handled via **NextAuth** using a **Credentials provider**. Users sign in with email and password stored in the `User` table. Passwords should be hashed using `bcryptjs` before storage. Sessions are JWT‑based. The `authOptions` in `lib/auth.ts` defines callback functions to include the user’s role in session tokens, enabling role‑based UI and route guards.

RBAC helpers in `lib/rbac.ts` expose functions like `isAdmin()`, `isRestaurantOwner()`, and `assertRole()` to centralise permission checks. Protected layouts for `/dashboard` and `/admin` call `getAuthSession()` and redirect to the home page if the user’s role is insufficient.

## Stripe Billing Flow

Stripe integration is encapsulated in `lib/stripe.ts`. Two helper functions are provided:

1. **`createSubscriptionCheckoutSession`** – Creates a Stripe Checkout Session in subscription mode for recurring monthly plans. The caller passes a Stripe price ID, customer email, and success/cancel URLs. The session’s ID is returned to the client, which uses Stripe.js to redirect the user.
2. **`createSetupFeeSession`** – Creates a one‑time payment Checkout Session for charging setup fees during onboarding.

Environment variables for Stripe keys must be set in `.env.local`. The Vercel knowledge base warns that only variables prefixed with `NEXT_PUBLIC_` are exposed to the client and secrets must remain server‑side【651866220503002†L64-L78】. The Stripe.js library should be loaded via `@stripe/stripe-js` using the singleton pattern to prevent multiple instantiations【651866220503002†L84-L104】.

In a full production build, you would also implement Stripe webhooks to listen for `checkout.session.completed`, `customer.subscription.updated`, and `invoice.payment_failed` events to update the `Subscription` table, grant or revoke plan features, and notify operators.

## Restaurant Onboarding Flow

1. **Admin/Sales rep creates a restaurant** via the admin dashboard:
   * Enters business information (name, description, address, phone/email) and selects a subscription plan.
   * Chooses a URL slug; the system automatically provisions a subdomain (`slug.plately.us`).
   * Optionally sets up a custom domain by creating a `DomainMapping` entry with status `PENDING` and instructs the owner to update their DNS.
2. **Import or create the menu** – Admin or owner adds menu categories, items, and modifiers using the restaurant dashboard.
3. **Invite the restaurant owner** – The system sends an email invitation to the owner with a sign‑up link. Upon registration, the owner is assigned the `RESTAURANT_OWNER` role and linked to the restaurant record.
4. **Collect payment** – The owner is redirected to Stripe Checkout to pay the setup fee (if applicable) and subscribe to the chosen plan. After successful payment, the restaurant’s subscription is marked active in the database.
5. **Publish** – Once the menu and branding assets are complete, the restaurant toggles the `isPublished` flag and the site becomes visible in the directory and accessible via its subdomain.

## MVP Implementation Plan

### Phase 1 (implemented in this code)

* **Marketing site:** Landing page with hero, benefits, pricing, and CTAs.
* **Public directory:** `/directory` lists restaurants using server‑side fetching. `/directory/[slug]` displays restaurant details and menu. Subdomain routing via middleware rewrites requests to `/r/[slug]` using the host header【348048569145108†L70-L124】.
* **Restaurant dashboard:** Basic owner dashboard with overview and orders summary. Menu and orders management pages are placeholders for now.
* **Admin dashboard:** Basic admin overview with counts of restaurants, users, and orders.
* **Authentication:** Credentials‑based sign‑in and session management via NextAuth. Role guards for dashboards.
* **Prisma & seed:** Database schema covers all core entities; seed script populates sample data.
* **Tailwind & shadcn UI:** Basic responsive components and styling.

### Phase 2 (future work)

* **Reviews system:** Allow customers to leave reviews post‑order. Display average rating on restaurant cards. Admin moderation and optional owner replies.
* **Analytics:** Track page views, menu item popularity, and order conversion. Display insights in dashboards.
* **Featured listings:** Admin can promote restaurants on the homepage or city/cuisine pages using `FeaturedPlacement` records.
* **Domain mapping UI:** Build UI for restaurants to connect custom domains and display connection status from `DomainMapping`.
* **City & cuisine pages:** Dynamic pages (`/city/[slug]` and `/cuisine/[slug]`) listing restaurants by location or cuisine. Optimised for SEO.

### Phase 3 (future work)

* **Delivery support:** Add delivery addresses, fees, and driver assignments; integrate with third‑party delivery partners as needed.
* **POS integrations:** Sync menu and orders with popular POS systems.
* **Advanced marketing tools:** Email campaigns, discounts, loyalty programmes, and promotions.
* **AI‑powered features:** Automatic menu suggestions, dynamic SEO meta generation, and personalised recommendations.

With this foundation in place, Plately can onboard the first restaurants manually, drive traffic via local pages, and grow into a scalable platform supporting custom domains and advanced features.