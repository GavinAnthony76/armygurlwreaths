# ArmyGurlWreaths — Production E-Commerce Platform

A full-stack, production-ready e-commerce platform for a handcrafted wreath brand. Built with React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Express, Drizzle ORM, Neon PostgreSQL, Stripe, and PayPal.

---

## 🏗️ Architecture

```
armygurlwreaths/
├── packages/shared/    # Shared TypeScript types + Zod schemas
├── client/             # React 18 + Vite frontend
├── server/             # Express API (serverless-ready)
└── api/                # Vercel serverless entry point
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites

- Node.js v18+
- A [Neon](https://neon.tech) PostgreSQL database (free tier works)
- A [Stripe](https://stripe.com) account
- A [PayPal Developer](https://developer.paypal.com) account
- A [Vercel](https://vercel.com) account (for Blob storage)

### 2. Clone & Install

```bash
git clone <your-repo>
cd armygurlwreaths
npm install
```

### 3. Configure Environment

Copy the environment template:

```bash
cp .env.example .env.local
cp client/.env.example client/.env.local
```

Fill in all values in `.env.local`:

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Neon Console → Connection string |
| `JWT_ACCESS_SECRET` | Generate: `openssl rand -base64 32` |
| `JWT_REFRESH_SECRET` | Generate: `openssl rand -base64 32` |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → API keys |
| `STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → API keys |
| `STRIPE_WEBHOOK_SECRET` | `stripe listen --forward-to localhost:3001/api/webhooks/stripe` |
| `PAYPAL_CLIENT_ID` | PayPal Developer → Apps |
| `PAYPAL_CLIENT_SECRET` | PayPal Developer → Apps |
| `BLOB_READ_WRITE_TOKEN` | Vercel Dashboard → Storage → Blob |
| `RESEND_API_KEY` | [resend.com](https://resend.com) |

### 4. Set Up Database

```bash
# Push schema to Neon
npm run db:push --workspace=server

# Seed with sample products
npm run db:seed --workspace=server
```

### 5. Run Development Servers

```bash
# Runs both client (port 5173) and server (port 3001) concurrently
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔑 Default Admin Credentials (after seeding)

```
Email:    admin@armygurlwreaths.com
Password: Admin@123456
```

**Change this immediately in production!**

---

## 💳 Stripe Webhook (Local Testing)

Install the Stripe CLI and run:

```bash
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```

Copy the webhook signing secret it provides and set `STRIPE_WEBHOOK_SECRET` in your `.env.local`.

---

## 🚢 Deploying to Vercel

### 1. Install Vercel CLI

```bash
npm i -g vercel
vercel login
```

### 2. Create Vercel Project

```bash
vercel
```

### 3. Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add **all** variables from `.env.example`.

Or via CLI:
```bash
vercel env add DATABASE_URL production
# (repeat for each variable)
```

### 4. Set Up Vercel Blob

In Vercel Dashboard → Storage → Create → Blob Store. Copy the `BLOB_READ_WRITE_TOKEN`.

### 5. Configure Stripe Webhooks for Production

In Stripe Dashboard → Webhooks → Add Endpoint:
- URL: `https://your-domain.vercel.app/api/webhooks/stripe`
- Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

Copy the signing secret → set `STRIPE_WEBHOOK_SECRET` in Vercel env vars.

### 6. Deploy

```bash
vercel --prod
```

---

## 📊 Database Management

```bash
# View/edit data with Drizzle Studio
npm run db:studio --workspace=server

# Generate migration files
npm run db:generate --workspace=server

# Push schema changes
npm run db:push --workspace=server
```

---

## 🏪 Key Features

### Store
- Cinematic homepage with parallax hero + scroll animations
- Shop with real-time filters (category, season, price range)
- Product detail with image gallery + variant selection
- Persistent cart (Zustand + localStorage)
- Stripe Checkout + PayPal Smart Buttons
- Free shipping threshold ($75+)
- Order confirmation + history

### Admin Dashboard (`/admin`)
- Product management (create/edit/delete, featured toggle)
- Order management with status updates
- Revenue + order analytics

### Security
- JWT with httpOnly cookies (refresh token rotation)
- Zod validation on all inputs
- Rate limiting (global + per-route)
- Stripe webhook signature verification
- Helmet security headers
- CORS configured per environment
- bcrypt password hashing (cost factor 12)

---

## 🎨 Design System

**Brand Colors:**
- Olive: `#8b7f50` (primary)
- Crimson: `#c8373a` (patriotic accent)
- Cream: `#faf6ec` (page background)
- Gold: `#b8891e` (premium accent)

**Fonts:**
- Headings: Playfair Display (serif, editorial)
- Body: Lato (clean, readable)
- Accent: Dancing Script (handwritten moments)

---

## 📁 Project Structure

```
client/src/
├── components/
│   ├── layout/          # Navbar, Footer, CartDrawer, AnnouncementBar
│   ├── product/         # ProductCard
│   ├── cart/            # CartDrawer
│   └── admin/           # AdminLayout
├── pages/
│   ├── Home.tsx         # Cinematic landing page
│   ├── Shop.tsx         # Filterable product grid
│   ├── ProductDetail.tsx
│   ├── Checkout.tsx     # Stripe + PayPal
│   ├── Account.tsx      # Login/Register
│   └── admin/           # Dashboard, Products, Orders
├── stores/              # Zustand (auth + cart)
├── lib/                 # API client, formatters, query client
├── design-system/       # Motion presets
└── styles/              # Tailwind globals

server/src/
├── config/              # env, db, stripe
├── db/schema/           # Drizzle ORM schemas
├── middleware/          # auth, validate, rateLimiter, errorHandler
├── routes/              # Express routers
├── services/            # Business logic
├── controllers/         # Request handlers
└── utils/               # AppError, asyncHandler, jwt, slug
```

---

## 🔒 Security Checklist

- [x] HTTPS enforced in production (Vercel)
- [x] JWT in httpOnly cookies with rotation
- [x] Zod validation on all API inputs
- [x] Rate limiting (global + auth + checkout)
- [x] Stripe webhook signature verification
- [x] bcrypt password hashing (factor 12)
- [x] Helmet security headers
- [x] CORS restricted to client domain
- [x] SQL injection prevented via Drizzle ORM parameterized queries
- [x] XSS prevented via proper escaping + CSP headers
- [x] Admin role enforced server-side
- [x] Environment secrets never exposed to client

---

## 📧 Transactional Emails

Email service uses [Resend](https://resend.com). Templates can be added to `server/src/services/email.service.ts` for:
- Order confirmation
- Shipping notification
- Welcome email

---

## 🌟 Bonus Features Included

- **Featured products toggle** in admin (star icon)
- **Seasonal banners** via Announcements system (admin-scheduled)
- **Free shipping threshold** incentive in cart
- **Low stock alerts** on product cards
- **Custom order notes** per cart item
- **Related products** on product detail pages
- **Newsletter capture** in footer + homepage CTA

---

Made with ❤️ for ArmyGurlWreaths
