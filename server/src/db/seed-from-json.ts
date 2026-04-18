/**
 * Seed from products.seed.json and announcements.seed.json
 * Run: npm run db:seed-json --workspace=server
 *
 * Maps the flat seed JSON structure to the normalized Drizzle schema.
 * - category (string) → looked up / created in categories table
 * - price (decimal string "89.00") → integer cents (8900)
 * - imageUrl (relative "/seed/...") → product_images row (isPrimary=true)
 * - inventory → stock_qty
 * - featured → is_featured
 * - active → is_active
 * - shortDescription → description
 * - season → lowercased, "everyday" → "year-round"
 */
import { db } from '../config/db.js';
import { categories, products, productImages, announcements, users } from './schema/index.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../../../');

const CATEGORY_SLUGS: Record<string, string> = {
  Patriotic: 'patriotic',
  Military: 'military',
  Seasonal: 'seasonal',
  General: 'general',
  Everyday: 'everyday',
};

function normalizeSeason(season: string): string {
  const s = season.toLowerCase();
  if (s === 'everyday' || s === 'year-round') return 'year-round';
  if (s === 'spring' || s === 'summer' || s === 'fall' || s === 'winter') return s;
  return 'year-round';
}

function toCents(price: string | number): number {
  return Math.round(parseFloat(String(price)) * 100);
}

async function getOrCreateCategory(name: string): Promise<string> {
  const slug = CATEGORY_SLUGS[name] ?? name.toLowerCase().replace(/\s+/g, '-');
  const existing = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  });
  if (existing) return existing.id;

  const [created] = await db.insert(categories).values({
    name,
    slug,
    description: `${name} wreaths`,
    sortOrder: 0,
  }).returning();
  console.log(`  Created category: ${name}`);
  return created.id;
}

async function seed() {
  console.log('🌱 Seeding from JSON files...');

  // ── Admin user ──────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('Admin@123456', 12);
  await db.insert(users).values({
    email: 'admin@armygurlwreaths.com',
    passwordHash,
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  }).onConflictDoNothing();
  console.log('  Admin user ready');

  // ── Products ─────────────────────────────────────────────────────────────
  const productData = JSON.parse(readFileSync(resolve(ROOT, 'products.seed.json'), 'utf-8')) as Array<{
    slug: string;
    name: string;
    category: string;
    season: string;
    price: string;
    inventory: number;
    featured: boolean;
    active: boolean;
    shortDescription: string;
    imageUrl: string;
    tags: string[];
  }>;

  for (const p of productData) {
    const categoryId = await getOrCreateCategory(p.category);

    const [inserted] = await db.insert(products).values({
      slug: p.slug,
      name: p.name,
      categoryId,
      description: p.shortDescription,
      price: toCents(p.price),
      stockQty: p.inventory,
      isFeatured: p.featured,
      isActive: p.active,
      tags: p.tags,
      season: normalizeSeason(p.season) as 'spring' | 'summer' | 'fall' | 'winter' | 'year-round',
    }).onConflictDoUpdate({
      target: products.slug,
      set: {
        name: p.name,
        categoryId,
        description: p.shortDescription,
        price: toCents(p.price),
        stockQty: p.inventory,
        isFeatured: p.featured,
        isActive: p.active,
        tags: p.tags,
        season: normalizeSeason(p.season) as 'spring' | 'summer' | 'fall' | 'winter' | 'year-round',
      },
    }).returning();

    // Upsert primary image (delete existing primary, then insert)
    await db.delete(productImages).where(eq(productImages.productId, inserted.id));
    await db.insert(productImages).values({
      productId: inserted.id,
      url: p.imageUrl,
      altText: p.name,
      isPrimary: true,
      sortOrder: 0,
    });

    console.log(`  ✓ ${p.name}`);
  }

  // ── Announcements ────────────────────────────────────────────────────────
  // Clear all announcements before re-seeding to prevent duplicates on re-runs
  await db.delete(announcements);

  const announcementData = JSON.parse(readFileSync(resolve(ROOT, 'announcements.seed.json'), 'utf-8')) as Array<{
    title: string;
    message: string;
    isActive: boolean;
    ctaLabel: string;
    ctaHref: string;
  }>;

  for (const a of announcementData) {
    // Schema has: message, link_text, link_url, is_active (no title column)
    await db.insert(announcements).values({
      message: `${a.title}: ${a.message}`,
      linkText: a.ctaLabel,
      linkUrl: a.ctaHref,
      isActive: a.isActive,
    });
    console.log(`  ✓ Announcement: ${a.title}`);
  }

  console.log('\n✅ Seed complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
