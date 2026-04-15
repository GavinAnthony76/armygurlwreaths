# ArmyGurlWreaths — Replit Setup

## Architecture

Monorepo with three workspaces:
- **`client/`** — React + Vite + TailwindCSS frontend (port 5000)
- **`server/`** — Express + Drizzle ORM backend API (port 3001)
- **`packages/shared/`** — Shared TypeScript types used by both

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
- `RESEND_API_KEY` — for transactional email
- `ADMIN_EMAIL`

## Database

Uses Replit's built-in PostgreSQL via the `pg` driver + Drizzle ORM.

To push schema changes:
```
cd server && DATABASE_URL="$DATABASE_URL" ../node_modules/.bin/tsx --tsconfig tsconfig.json ../node_modules/.bin/drizzle-kit push --config=drizzle.config.ts
```

Tables: users, products, product_images, product_variants, categories, orders, order_items, cart, cart_items, reviews, announcements, shipping_addresses

## Migration from Vercel

Changes made during migration:
1. Switched DB driver from `@neondatabase/serverless` to `pg` (standard PostgreSQL)
2. Updated `client/vite.config.ts` — port 5000, `host: '0.0.0.0'`, `allowedHosts: true`
3. Updated `server/src/index.ts` — added `trust proxy: 1` for Replit's reverse proxy
4. Removed `--env-file=.env` from server dev script (Replit injects secrets automatically)
5. Fixed `tags` array column default from `[]` to `sql\`ARRAY[]::text[]\`` (drizzle-kit compatibility)
6. Removed Vercel-specific `api/index.ts` handler (not used on Replit)
