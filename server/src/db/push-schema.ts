/**
 * Schema push script — mirrors the Drizzle schema definitions exactly.
 * Run with: tsx --env-file=server/.env server/src/db/push-schema.ts
 */
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function pushSchema() {
  console.log('🔧 Pushing schema to database...');

  // Drop all in dependency order
  await sql`DROP TABLE IF EXISTS reviews, cart_items, carts, order_items, shipping_addresses, orders, product_variants, product_images, products, categories, announcements, users CASCADE`;

  await sql`
    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'customer',
      stripe_customer_id TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE categories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      image_url TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      category_id UUID REFERENCES categories(id),
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      price INTEGER NOT NULL,
      compare_at_price INTEGER,
      sku TEXT UNIQUE,
      stock_qty INTEGER NOT NULL DEFAULT 0,
      low_stock_threshold INTEGER NOT NULL DEFAULT 3,
      is_active BOOLEAN NOT NULL DEFAULT true,
      is_featured BOOLEAN NOT NULL DEFAULT false,
      is_customizable BOOLEAN NOT NULL DEFAULT false,
      tags TEXT[] NOT NULL DEFAULT '{}',
      season TEXT,
      meta_title TEXT,
      meta_description TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE product_images (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      url TEXT NOT NULL,
      alt_text TEXT,
      is_primary BOOLEAN NOT NULL DEFAULT false,
      sort_order INTEGER NOT NULL DEFAULT 0
    )
  `;

  await sql`
    CREATE TABLE product_variants (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      value TEXT NOT NULL,
      price_adjustment INTEGER NOT NULL DEFAULT 0,
      stock_qty INTEGER NOT NULL DEFAULT 0,
      sku TEXT
    )
  `;

  await sql`
    CREATE TABLE orders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      order_number TEXT UNIQUE NOT NULL,
      user_id UUID REFERENCES users(id),
      email TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      payment_provider TEXT NOT NULL,
      payment_intent_id TEXT UNIQUE,
      stripe_customer_id TEXT,
      subtotal INTEGER NOT NULL,
      shipping_cost INTEGER NOT NULL DEFAULT 0,
      tax_amount INTEGER NOT NULL DEFAULT 0,
      discount_amount INTEGER NOT NULL DEFAULT 0,
      total INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'usd',
      notes TEXT,
      shipping_carrier TEXT,
      tracking_number TEXT,
      shipped_at TIMESTAMPTZ,
      delivered_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE order_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id UUID REFERENCES products(id),
      variant_id UUID REFERENCES product_variants(id),
      product_name TEXT NOT NULL,
      variant_name TEXT,
      price INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      custom_note TEXT
    )
  `;

  await sql`
    CREATE TABLE shipping_addresses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
      user_id UUID REFERENCES users(id),
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      address1 TEXT NOT NULL,
      address2 TEXT,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      postal_code TEXT NOT NULL,
      country TEXT NOT NULL DEFAULT 'US',
      phone TEXT,
      is_default TEXT DEFAULT 'false'
    )
  `;

  await sql`
    CREATE TABLE carts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id),
      session_id TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE cart_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
      product_id UUID NOT NULL REFERENCES products(id),
      variant_id UUID REFERENCES product_variants(id),
      quantity INTEGER NOT NULL DEFAULT 1,
      custom_note TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE reviews (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      user_id UUID REFERENCES users(id),
      order_id UUID REFERENCES orders(id),
      rating INTEGER NOT NULL,
      title TEXT,
      body TEXT,
      is_approved BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE announcements (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      message TEXT NOT NULL,
      link_text TEXT,
      link_url TEXT,
      bg_color TEXT NOT NULL DEFAULT '#8b7f50',
      text_color TEXT NOT NULL DEFAULT '#fdfcf7',
      is_active BOOLEAN NOT NULL DEFAULT false,
      starts_at TIMESTAMPTZ,
      ends_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  console.log('✅ Schema pushed successfully!');
  process.exit(0);
}

pushSchema().catch((err) => {
  console.error('Schema push failed:', err.message);
  process.exit(1);
});
