import { db } from '../config/db.js';
import { categories, products, productImages, users, announcements } from './schema/index.js';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Seeding database...');

  // Seed admin user
  const passwordHash = await bcrypt.hash('Admin@123456', 12);
  await db.insert(users).values({
    email: 'admin@armygurlwreaths.com',
    passwordHash,
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  }).onConflictDoNothing();

  // Seed categories
  const [seasonalCat, patrioticCat, customCat, everydayCat] = await db.insert(categories).values([
    { name: 'Seasonal', slug: 'seasonal', description: 'Beautiful wreaths for every season', sortOrder: 1 },
    { name: 'Patriotic', slug: 'patriotic', description: 'Honor and pride in every wreath', sortOrder: 2 },
    { name: 'Custom Orders', slug: 'custom', description: 'Handcrafted to your specifications', sortOrder: 3 },
    { name: 'Everyday', slug: 'everyday', description: 'Classic wreaths for year-round display', sortOrder: 4 },
  ]).onConflictDoNothing().returning();

  // Seed products
  if (seasonalCat) {
    const insertedProducts = await db.insert(products).values([
      {
        categoryId: seasonalCat.id,
        name: 'Autumn Harvest Wreath',
        slug: 'autumn-harvest-wreath',
        description: 'A stunning 24-inch wreath bursting with the warmth of autumn. Hand-assembled with preserved eucalyptus, dried orange slices, cinnamon sticks, and seasonal blooms in rich amber, burgundy, and gold tones. Each wreath is a one-of-a-kind piece crafted with love.',
        price: 8500,
        compareAtPrice: 11000,
        stockQty: 15,
        isFeatured: true,
        tags: ['autumn', 'seasonal', 'fall', 'harvest'],
        season: 'fall',
        metaTitle: 'Autumn Harvest Wreath - Handcrafted Fall Decor | ArmyGurlWreaths',
        metaDescription: 'Hand-assembled 24-inch autumn harvest wreath with preserved eucalyptus, dried orange slices, and seasonal blooms. Limited seasonal availability.',
      },
      {
        categoryId: seasonalCat.id,
        name: 'Winter Wonderland Wreath',
        slug: 'winter-wonderland-wreath',
        description: 'Capture the magic of winter with this 22-inch snow-dusted wreath. Features frosted pine branches, silver berries, pinecones, and a luxurious velvet ribbon bow. Perfect for door or wall display throughout the holiday season.',
        price: 9500,
        stockQty: 20,
        isFeatured: true,
        tags: ['winter', 'christmas', 'holiday', 'seasonal'],
        season: 'winter',
      },
      {
        categoryId: seasonalCat.id,
        name: 'Spring Bloom Wreath',
        slug: 'spring-bloom-wreath',
        description: 'Welcome spring with this vibrant 20-inch wreath. Hand-arranged with faux peonies, ranunculus, eucalyptus, and butterfly accents in soft blush, cream, and sage green. Lightweight and UV-resistant for lasting outdoor display.',
        price: 7500,
        stockQty: 25,
        tags: ['spring', 'floral', 'seasonal'],
        season: 'spring',
      },
    ]).onConflictDoNothing().returning();

    // Placeholder images per seasonal product (primary + secondary for hover-swap)
    const seasonalImages: Record<string, { primary: string; secondary: string }> = {
      'autumn-harvest-wreath': {
        primary: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80',
        secondary: 'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=800&q=80',
      },
      'winter-wonderland-wreath': {
        primary: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&q=80',
        secondary: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80',
      },
      'spring-bloom-wreath': {
        primary: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80',
        secondary: 'https://images.unsplash.com/photo-1490750967868-88df5691cc4c?w=800&q=80',
      },
    };

    for (const product of insertedProducts) {
      const imgs = seasonalImages[product.slug] ?? {
        primary: 'https://images.unsplash.com/photo-1467890947394-8171244e5410?w=800&q=80',
        secondary: 'https://images.unsplash.com/photo-1543059080-f9b1272213d5?w=800&q=80',
      };
      await db.insert(productImages).values([
        { productId: product.id, url: imgs.primary, altText: product.name, isPrimary: true, sortOrder: 0 },
        { productId: product.id, url: imgs.secondary, altText: `${product.name} — detail view`, isPrimary: false, sortOrder: 1 },
      ]).onConflictDoNothing();
    }
  }

  if (patrioticCat) {
    const patrioticProducts = await db.insert(products).values([
      {
        categoryId: patrioticCat.id,
        name: 'Stars & Stripes Forever Wreath',
        slug: 'stars-stripes-forever-wreath',
        description: 'Honor and celebrate with this bold 24-inch patriotic wreath. Handcrafted with red, white, and blue ribbon work, silk stars, and an American flag centerpiece. A proud display for Veterans Day, Memorial Day, July 4th, or any day you want to show your patriotism.',
        price: 9500,
        stockQty: 30,
        isFeatured: true,
        tags: ['patriotic', 'american', 'military', '4th-of-july', 'veterans-day'],
        season: 'year-round',
        metaTitle: 'Stars & Stripes Patriotic Wreath | ArmyGurlWreaths',
      },
      {
        categoryId: patrioticCat.id,
        name: 'Military Pride Wreath',
        slug: 'military-pride-wreath',
        description: 'A heartfelt tribute to those who serve. This 22-inch wreath features branch-specific ribbons (Army, Navy, Air Force, Marines, Coast Guard — specify at checkout), dog tag accents, olive drab netting, and a customizable nameplate. Honor your soldier in style.',
        price: 11500,
        stockQty: 10,
        isFeatured: true,
        isCustomizable: true,
        tags: ['military', 'patriotic', 'custom', 'army', 'navy', 'air-force'],
        season: 'year-round',
      },
      {
        categoryId: patrioticCat.id,
        name: 'Gold Star Family Wreath',
        slug: 'gold-star-family-wreath',
        description: 'Made with reverence and deep respect, this wreath honors the ultimate sacrifice. Features a gold star centerpiece, white and blue florals, and a personalized banner. Proceeds partially donated to Gold Star Family charities.',
        price: 12500,
        stockQty: 8,
        isCustomizable: true,
        tags: ['military', 'gold-star', 'memorial', 'patriotic'],
        season: 'year-round',
      },
    ]).onConflictDoNothing().returning();

    // Placeholder images per patriotic product (primary + secondary for hover-swap)
    const patrioticImages: Record<string, { primary: string; secondary: string }> = {
      'stars-stripes-forever-wreath': {
        primary: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=800&q=80',
        secondary: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80',
      },
      'military-pride-wreath': {
        primary: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        secondary: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&q=80',
      },
      'gold-star-family-wreath': {
        primary: 'https://images.unsplash.com/photo-1548248823-ce16a73b6d49?w=800&q=80',
        secondary: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80',
      },
    };

    for (const product of patrioticProducts) {
      const imgs = patrioticImages[product.slug] ?? {
        primary: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=800&q=80',
        secondary: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80',
      };
      await db.insert(productImages).values([
        { productId: product.id, url: imgs.primary, altText: product.name, isPrimary: true, sortOrder: 0 },
        { productId: product.id, url: imgs.secondary, altText: `${product.name} — detail view`, isPrimary: false, sortOrder: 1 },
      ]).onConflictDoNothing();
    }
  }

  // Seed announcement
  await db.insert(announcements).values({
    message: '🎖️ Free shipping on orders over $75 | Use code MILITARYSTRONG for 15% off patriotic collection',
    linkText: 'Shop Now',
    linkUrl: '/shop/patriotic',
    bgColor: '#8b7f50',
    textColor: '#fdfcf7',
    isActive: true,
  }).onConflictDoNothing();

  console.log('✅ Seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
