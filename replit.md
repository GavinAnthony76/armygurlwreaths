# ArmyGurlWreaths — Replit Setup

## Architecture

Monorepo with three workspaces:
- **`client/`** — React + Vite + TailwindCSS frontend (port 5000)
- **`server/`** — Express + Drizzle ORM backend API (port 3001)
- **`packages/shared/`** — Shared TypeScript types, Zod schemas used by both

## Running the App

The "Start application" workflow runs both services concurrently:
```
npm run dev
```
- Vite serves the frontend at port 5000 (Replit webview)
- Express API runs at port 3001
- Vite proxies `/api/*` requests to the Express server

## Environment Variables

Required secrets (set in Replit Secrets):
- `DATABASE_URL` — Replit PostgreSQL (auto-provisioned)
- `JWT_ACCESS_SECRET` — min 32 chars, for access tokens
- `JWT_REFRESH_SECRET` — min 32 chars, for refresh tokens

Optional secrets for full functionality:
- `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`
- `BLOB_READ_WRITE_TOKEN` — for Vercel Blob image storage
- `RESEND_API_KEY` — for transactional email (contact form, order notifications)
- `ADMIN_EMAIL`

## Database

Uses Replit's built-in PostgreSQL via the `pg` driver + Drizzle ORM.

To push schema changes:
```
cd server && DATABASE_URL="$DATABASE_URL" ../node_modules/.bin/tsx --tsconfig tsconfig.json ../node_modules/.bin/drizzle-kit push --config=drizzle.config.ts
```

Tables: users, products, product_images, product_variants, categories, orders, order_items, cart, cart_items, reviews, announcements, shipping_addresses

## Key Routes

### Client Pages
- `/` — Home
- `/shop`, `/shop/:category` — Shop with filters
- `/products/:slug` — Product detail
- `/cart` — Cart
- `/checkout` — Checkout (protected)
- `/order-confirmation/:id` — Post-purchase confirmation (protected)
- `/orders` — Order history (protected)
- `/orders/:id` — Order detail by orderNumber or UUID (protected)
- `/account` — Login/register/profile
- `/admin`, `/admin/products`, `/admin/orders` — Admin dashboard (admin only)

### API Endpoints
- `GET /api/products` — List with filters (supports isActive, isFeatured, category, season, price range, search, pagination, sorting)
- `GET /api/products/featured` — Featured products
- `GET /api/products/:slug` — Single product by slug
- `POST /api/checkout/intent` — Create Stripe payment intent (or demo mode)
- `POST /api/checkout/demo` — Demo order (no payment keys needed)
- `POST /api/webhooks/stripe` — Stripe webhook (raw body, mounted before JSON middleware)
- `GET /api/orders/:id` — Get order by UUID or orderNumber
- `POST /api/contact` — Contact form with Resend email
- `POST /api/media/upload` — Admin image upload (base64, max 10MB)

## Payment Flow

- **Stripe**: Payment intent → client-side confirmation → webhook fulfillment via `fulfillOrderByPaymentIntent`
- **Demo mode**: When no `STRIPE_SECRET_KEY` is configured, checkout falls back to demo mode with simulated payment
- Webhook route receives raw body BEFORE `express.json()` middleware for signature verification

## Security Notes

- Products controller propagates errors (no silent swallowing)
- Auth controller clears cookies with matching options (httpOnly, secure, sameSite, path, domain)
- Auth service `updateProfile` restricted to safe fields only (firstName, lastName, phone)
- Product slugs enforce uniqueness with auto-suffix collision detection
- Cart service validates variant-level stock when variantId is provided
- API interceptor prevents infinite refresh loop on `/auth/refresh` 401
- Media uploads require fileData (non-empty, max 10MB)
- Admin routes (announcements, categories) have Zod validation

## Migration from Vercel

Changes made during migration:
1. Switched DB driver from `@neondatabase/serverless` to `pg` (standard PostgreSQL)
2. Updated `client/vite.config.ts` — port 5000, `host: '0.0.0.0'`, `allowedHosts: true`
3. Updated `server/src/index.ts` — added `trust proxy: 1` for Replit's reverse proxy
4. Removed `--env-file=.env` from server dev script (Replit injects secrets automatically)
5. Fixed `tags` array column default from `[]` to `sql\`ARRAY[]::text[]\`` (drizzle-kit compatibility)
6. Removed Vercel-specific `api/index.ts` handler (not used on Replit)
