import { db } from '../config/db.js';
import { categories, products, productImages, productVariants, users, announcements } from './schema/index.js';
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
  const [wreathsCat, apparelCat, homeDecorCat, patrioticCat, customCat] = await db.insert(categories).values([
    { name: 'Wreaths', slug: 'wreaths', description: 'Handcrafted wreaths for every season and occasion', sortOrder: 1 },
    { name: 'Apparel', slug: 'apparel', description: 'Patriotic & military-inspired shirts, hoodies, and more', sortOrder: 2 },
    { name: 'Home Decor', slug: 'home-decor', description: 'Signs, accents, and decor to make your house a home', sortOrder: 3 },
    { name: 'Patriotic', slug: 'patriotic', description: 'Honor and pride in every piece', sortOrder: 4 },
    { name: 'Custom Orders', slug: 'custom', description: 'Handcrafted to your specifications', sortOrder: 5 },
  ]).onConflictDoNothing().returning();

  // Seed wreath products
  if (wreathsCat) {
    const insertedProducts = await db.insert(products).values([
      {
        categoryId: wreathsCat.id,
        name: 'Autumn Harvest Wreath',
        slug: 'autumn-harvest-wreath',
        description: 'A stunning 24-inch wreath bursting with the warmth of autumn. Hand-assembled with preserved eucalyptus, dried orange slices, cinnamon sticks, and seasonal blooms in rich amber, burgundy, and gold tones. Each wreath is a one-of-a-kind piece crafted with love.',
        price: 8500,
        compareAtPrice: 11000,
        stockQty: 15,
        isFeatured: true,
        tags: ['autumn', 'seasonal', 'fall', 'harvest', 'wreath'],
        season: 'fall',
        metaTitle: 'Autumn Harvest Wreath - Handcrafted Fall Decor | ArmyGurlWreaths',
        metaDescription: 'Hand-assembled 24-inch autumn harvest wreath with preserved eucalyptus, dried orange slices, and seasonal blooms. Limited seasonal availability.',
      },
      {
        categoryId: wreathsCat.id,
        name: 'Winter Wonderland Wreath',
        slug: 'winter-wonderland-wreath',
        description: 'Capture the magic of winter with this 22-inch snow-dusted wreath. Features frosted pine branches, silver berries, pinecones, and a luxurious velvet ribbon bow. Perfect for door or wall display throughout the holiday season.',
        price: 9500,
        stockQty: 20,
        isFeatured: true,
        tags: ['winter', 'christmas', 'holiday', 'seasonal', 'wreath'],
        season: 'winter',
      },
      {
        categoryId: wreathsCat.id,
        name: 'Spring Bloom Wreath',
        slug: 'spring-bloom-wreath',
        description: 'Welcome spring with this vibrant 20-inch wreath. Hand-arranged with faux peonies, ranunculus, eucalyptus, and butterfly accents in soft blush, cream, and sage green. Lightweight and UV-resistant for lasting outdoor display.',
        price: 7500,
        stockQty: 25,
        tags: ['spring', 'floral', 'seasonal', 'wreath'],
        season: 'spring',
      },
    ]).onConflictDoNothing().returning();

    const wreathImages: Record<string, { primary: string; secondary: string }> = {
      'autumn-harvest-wreath': {
        primary: 'https://placehold.co/800x800/8b7f50/fdfcf7?text=Autumn+Harvest+Wreath',
        secondary: 'https://placehold.co/800x800/b8891e/fdfcf7?text=Autumn+Harvest%0ADetail+View',
      },
      'winter-wonderland-wreath': {
        primary: 'https://placehold.co/800x800/1e293b/fdfcf7?text=Winter+Wonderland+Wreath',
        secondary: 'https://placehold.co/800x800/334155/fdfcf7?text=Winter+Wonderland%0ADetail+View',
      },
      'spring-bloom-wreath': {
        primary: 'https://placehold.co/800x800/4a7c59/fdfcf7?text=Spring+Bloom+Wreath',
        secondary: 'https://placehold.co/800x800/6b9e79/fdfcf7?text=Spring+Bloom%0ADetail+View',
      },
    };

    for (const product of insertedProducts) {
      const imgs = wreathImages[product.slug] ?? {
        primary: 'https://placehold.co/800x800/8b7f50/fdfcf7?text=Wreath',
        secondary: 'https://placehold.co/800x800/b8891e/fdfcf7?text=Wreath%0ADetail+View',
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
        primary: 'https://placehold.co/800x800/c8373a/fdfcf7?text=Stars+%26+Stripes+Forever',
        secondary: 'https://placehold.co/800x800/1e3a8a/fdfcf7?text=Stars+%26+Stripes%0ADetail+View',
      },
      'military-pride-wreath': {
        primary: 'https://placehold.co/800x800/4b5320/fdfcf7?text=Military+Pride+Wreath',
        secondary: 'https://placehold.co/800x800/6b7a2f/fdfcf7?text=Military+Pride%0ADetail+View',
      },
      'gold-star-family-wreath': {
        primary: 'https://placehold.co/800x800/b8891e/fdfcf7?text=Gold+Star+Family+Wreath',
        secondary: 'https://placehold.co/800x800/d4a825/1e293b?text=Gold+Star+Family%0ADetail+View',
      },
    };

    for (const product of patrioticProducts) {
      const imgs = patrioticImages[product.slug] ?? {
        primary: 'https://placehold.co/800x800/c8373a/fdfcf7?text=Patriotic+Wreath',
        secondary: 'https://placehold.co/800x800/1e3a8a/fdfcf7?text=Patriotic+Wreath%0ADetail+View',
      };
      await db.insert(productImages).values([
        { productId: product.id, url: imgs.primary, altText: product.name, isPrimary: true, sortOrder: 0 },
        { productId: product.id, url: imgs.secondary, altText: `${product.name} — detail view`, isPrimary: false, sortOrder: 1 },
      ]).onConflictDoNothing();
    }
  }

  // Seed apparel products
  if (apparelCat) {
    const apparelProducts = await db.insert(products).values([
      {
        categoryId: apparelCat.id,
        name: 'Army Strong Unisex Hoodie',
        slug: 'army-strong-unisex-hoodie',
        description: 'Stay warm and show your pride with this ultra-soft cotton-blend hoodie. Features a bold "Army Strong" design on the front with a small flag on the sleeve. Available in men\'s and women\'s sizing. Preshrunk, machine washable, and built to last.',
        price: 4500,
        stockQty: 50,
        isFeatured: true,
        tags: ['hoodie', 'army', 'unisex', 'apparel', 'military'],
        season: 'year-round',
      },
      {
        categoryId: apparelCat.id,
        name: 'Patriotic Flag Tee',
        slug: 'patriotic-flag-tee',
        description: 'A classic crew-neck t-shirt featuring a vintage distressed American flag print. Made from 100% ring-spun cotton for all-day comfort. Perfect for cookouts, rallies, or everyday wear. Unisex fit available in sizes XS–3XL.',
        price: 2800,
        stockQty: 75,
        isFeatured: true,
        tags: ['tshirt', 'patriotic', 'unisex', 'apparel', 'flag'],
        season: 'year-round',
      },
      {
        categoryId: apparelCat.id,
        name: 'Military Mom V-Neck Tee',
        slug: 'military-mom-vneck-tee',
        description: 'Designed for the proud military moms who hold down the home front. Soft tri-blend fabric with a relaxed women\'s fit. "Proud Military Mom" script with star detail. Available in multiple colors.',
        price: 2500,
        stockQty: 40,
        tags: ['tshirt', 'women', 'military-mom', 'apparel'],
        season: 'year-round',
      },
      {
        categoryId: apparelCat.id,
        name: 'Kids Camo Hero Tee',
        slug: 'kids-camo-hero-tee',
        description: 'Let the little ones show their pride too! This soft cotton kids tee features a fun camo heart design with "My Hero Wears Combat Boots." Available in toddler through youth sizes.',
        price: 1800,
        stockQty: 60,
        tags: ['tshirt', 'kids', 'youth', 'apparel', 'camo'],
        season: 'year-round',
      },
    ]).onConflictDoNothing().returning();

    const apparelImages: Record<string, { primary: string; secondary: string }> = {
      'army-strong-unisex-hoodie': {
        primary: 'https://placehold.co/800x800/4b5320/fdfcf7?text=Army+Strong%0AHoodie',
        secondary: 'https://placehold.co/800x800/6b7a2f/fdfcf7?text=Army+Strong%0ABack+View',
      },
      'patriotic-flag-tee': {
        primary: 'https://placehold.co/800x800/c8373a/fdfcf7?text=Patriotic%0AFlag+Tee',
        secondary: 'https://placehold.co/800x800/1e3a8a/fdfcf7?text=Flag+Tee%0ADetail+View',
      },
      'military-mom-vneck-tee': {
        primary: 'https://placehold.co/800x800/8b7f50/fdfcf7?text=Military+Mom%0AV-Neck',
        secondary: 'https://placehold.co/800x800/b8891e/fdfcf7?text=Military+Mom%0ADetail+View',
      },
      'kids-camo-hero-tee': {
        primary: 'https://placehold.co/800x800/4a7c59/fdfcf7?text=Kids+Camo%0AHero+Tee',
        secondary: 'https://placehold.co/800x800/6b9e79/fdfcf7?text=Kids+Camo%0ADetail+View',
      },
    };

    for (const product of apparelProducts) {
      const imgs = apparelImages[product.slug] ?? {
        primary: 'https://placehold.co/800x800/4b5320/fdfcf7?text=Apparel',
        secondary: 'https://placehold.co/800x800/6b7a2f/fdfcf7?text=Apparel%0ADetail+View',
      };
      await db.insert(productImages).values([
        { productId: product.id, url: imgs.primary, altText: product.name, isPrimary: true, sortOrder: 0 },
        { productId: product.id, url: imgs.secondary, altText: `${product.name} — detail view`, isPrimary: false, sortOrder: 1 },
      ]).onConflictDoNothing();
    }

    const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
    for (const product of apparelProducts) {
      const isHoodie = product.slug.includes('hoodie');
      const isKids = product.slug.includes('kids');
      const productSizes = isKids ? ['2T', '3T', '4T', 'YS', 'YM', 'YL', 'YXL'] : sizes;
      const variantRows = productSizes.map((size) => ({
        productId: product.id,
        name: 'Size',
        value: size,
        priceAdjustment: (size === '2XL' || size === '3XL') && !isKids ? 300 : 0,
        stockQty: isHoodie ? 8 : 12,
      }));
      await db.insert(productVariants).values(variantRows);
    }
  }

  // Seed home decor products
  if (homeDecorCat) {
    const homeDecorProducts = await db.insert(products).values([
      {
        categoryId: homeDecorCat.id,
        name: 'Rustic "Home of the Brave" Sign',
        slug: 'rustic-home-brave-sign',
        description: 'A beautifully hand-painted wooden sign measuring 18" x 24". Distressed finish with "Home of the Brave" lettering and a subtle flag motif. Perfect for entryways, living rooms, or porches. Comes ready to hang.',
        price: 4200,
        stockQty: 20,
        tags: ['sign', 'home-decor', 'patriotic', 'wood'],
        season: 'year-round',
      },
      {
        categoryId: homeDecorCat.id,
        name: 'Patriotic Door Hanger',
        slug: 'patriotic-door-hanger',
        description: 'A handcrafted round wooden door hanger featuring red, white, and blue floral accents and a burlap bow. 16 inches in diameter — a beautiful alternative to a wreath that makes a statement.',
        price: 3500,
        stockQty: 25,
        isFeatured: true,
        tags: ['door-hanger', 'home-decor', 'patriotic'],
        season: 'year-round',
      },
    ]).onConflictDoNothing().returning();

    const homeDecorImages: Record<string, { primary: string; secondary: string }> = {
      'rustic-home-brave-sign': {
        primary: 'https://placehold.co/800x800/8b7f50/fdfcf7?text=Home+of%0Athe+Brave+Sign',
        secondary: 'https://placehold.co/800x800/b8891e/fdfcf7?text=Brave+Sign%0ADetail+View',
      },
      'patriotic-door-hanger': {
        primary: 'https://placehold.co/800x800/c8373a/fdfcf7?text=Patriotic%0ADoor+Hanger',
        secondary: 'https://placehold.co/800x800/1e3a8a/fdfcf7?text=Door+Hanger%0ADetail+View',
      },
    };

    for (const product of homeDecorProducts) {
      const imgs = homeDecorImages[product.slug] ?? {
        primary: 'https://placehold.co/800x800/8b7f50/fdfcf7?text=Home+Decor',
        secondary: 'https://placehold.co/800x800/b8891e/fdfcf7?text=Home+Decor%0ADetail+View',
      };
      await db.insert(productImages).values([
        { productId: product.id, url: imgs.primary, altText: product.name, isPrimary: true, sortOrder: 0 },
        { productId: product.id, url: imgs.secondary, altText: `${product.name} — detail view`, isPrimary: false, sortOrder: 1 },
      ]).onConflictDoNothing();
    }
  }

  // Seed announcement
  await db.insert(announcements).values({
    message: '🎖️ Free shipping on orders over $75 | Use code MILITARYSTRONG for 15% off patriotic items',
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
