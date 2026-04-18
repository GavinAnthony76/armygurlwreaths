import { eq, and, gte, lte, ilike, desc, asc, sql, count, ne } from 'drizzle-orm';
import { db } from '../config/db.js';
import { products, productImages, productVariants, categories } from '../db/schema/index.js';
import { NotFoundError, ConflictError } from '../utils/AppError.js';
import { toSlug } from '../utils/slug.js';
import type { CreateProductInput, UpdateProductInput, ProductFiltersInput } from '@armygurl/shared';

async function ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let suffix = 1;
  while (true) {
    const conditions = [eq(products.slug, slug)];
    if (excludeId) conditions.push(ne(products.id, excludeId));
    const existing = await db.query.products.findFirst({ where: and(...conditions), columns: { id: true } });
    if (!existing) return slug;
    slug = `${baseSlug}-${suffix++}`;
  }
}

export const productService = {
  async list(filters: ProductFiltersInput) {
    const { page, pageSize, sortBy, search, category, season, minPrice, maxPrice, isFeatured, isActive, tags } = filters;
    const offset = (page - 1) * pageSize;

    const conditions = [];

    conditions.push(eq(products.isActive, true));

    if (category) {
      const cat = await db.query.categories.findFirst({ where: eq(categories.slug, category) });
      if (cat) conditions.push(eq(products.categoryId, cat.id));
    }
    if (season) conditions.push(eq(products.season, season));
    if (isFeatured !== undefined) conditions.push(eq(products.isFeatured, isFeatured));
    if (minPrice !== undefined) conditions.push(gte(products.price, minPrice));
    if (maxPrice !== undefined) conditions.push(lte(products.price, maxPrice));
    if (search) conditions.push(ilike(products.name, `%${search}%`));
    if (tags?.length) conditions.push(sql`${products.tags} && ${tags}`);

    const orderBy = sortBy === 'price_asc' ? asc(products.price)
      : sortBy === 'price_desc' ? desc(products.price)
      : sortBy === 'name' ? asc(products.name)
      : desc(products.createdAt);

    const [result, totalResult] = await Promise.all([
      db.query.products.findMany({
        where: and(...conditions),
        with: { images: true, variants: true, category: true },
        orderBy,
        limit: pageSize,
        offset,
      }),
      db.select({ count: count() }).from(products).where(and(...conditions)),
    ]);

    const total = totalResult[0]?.count ?? 0;
    return {
      products: result,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  },

  async adminList(filters: ProductFiltersInput) {
    const { page, pageSize, sortBy, search, category, season, minPrice, maxPrice, isFeatured, isActive, tags } = filters;
    const offset = (page - 1) * pageSize;

    const conditions = [];

    if (isActive !== undefined) {
      conditions.push(eq(products.isActive, isActive));
    }

    if (category) {
      const cat = await db.query.categories.findFirst({ where: eq(categories.slug, category) });
      if (cat) conditions.push(eq(products.categoryId, cat.id));
    }
    if (season) conditions.push(eq(products.season, season));
    if (isFeatured !== undefined) conditions.push(eq(products.isFeatured, isFeatured));
    if (minPrice !== undefined) conditions.push(gte(products.price, minPrice));
    if (maxPrice !== undefined) conditions.push(lte(products.price, maxPrice));
    if (search) conditions.push(ilike(products.name, `%${search}%`));
    if (tags?.length) {
      for (const tag of tags) {
        conditions.push(sql`${products.tags}::jsonb ? ${tag}`);
      }
    }

    const whereClause = conditions.length ? and(...conditions) : undefined;

    const orderBy = sortBy === 'price_asc' ? asc(products.price)
      : sortBy === 'price_desc' ? desc(products.price)
      : sortBy === 'name' ? asc(products.name)
      : desc(products.createdAt);

    const result = await db.query.products.findMany({
      where: whereClause,
      orderBy,
      limit: pageSize,
      offset,
      with: { category: true, images: true, variants: true },
    });

    const [{ count: total }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(whereClause);

    return {
      products: result,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  },

  async getFeatured() {
    return db.query.products.findMany({
      where: and(eq(products.isActive, true), eq(products.isFeatured, true)),
      with: { images: true, variants: true, category: true },
      orderBy: desc(products.createdAt),
      limit: 8,
    });
  },

  async getBySlug(slug: string) {
    const product = await db.query.products.findFirst({
      where: and(eq(products.slug, slug), eq(products.isActive, true)),
      with: { images: true, variants: true, category: true },
    });
    if (!product) throw new NotFoundError('Product');
    return product;
  },

  async getById(id: string) {
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: { images: true, variants: true, category: true },
    });
    if (!product) throw new NotFoundError('Product');
    return product;
  },

  async create(input: CreateProductInput) {
    const slug = await ensureUniqueSlug(toSlug(input.name));
    const [product] = await db.insert(products).values({ ...input, slug }).returning();
    return product;
  },

  async update(id: string, input: UpdateProductInput) {
    const updates: Record<string, unknown> = { ...input, updatedAt: new Date() };
    if (input.name) updates.slug = await ensureUniqueSlug(toSlug(input.name), id);

    const [updated] = await db.update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();
    if (!updated) throw new NotFoundError('Product');
    return updated;
  },

  async delete(id: string) {
    const [deleted] = await db.update(products)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    if (!deleted) throw new NotFoundError('Product');
    return deleted;
  },

  async addImage(productId: string, data: { url: string; altText?: string; isPrimary?: boolean }) {
    if (data.isPrimary) {
      await db.update(productImages)
        .set({ isPrimary: false })
        .where(eq(productImages.productId, productId));
    }
    const [image] = await db.insert(productImages).values({ productId, ...data }).returning();
    return image;
  },

  async deleteImage(imageId: string) {
    await db.delete(productImages).where(eq(productImages.id, imageId));
  },

  async adjustInventory(id: string, delta: number) {
    const [updated] = await db.update(products)
      .set({
        stockQty: sql`GREATEST(0, ${products.stockQty} + ${delta})`,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();
    return updated;
  },

  async getRelated(productId: string, categoryId: string | null, limit = 4) {
    const conditions = [eq(products.isActive, true)];
    if (categoryId) conditions.push(eq(products.categoryId, categoryId));

    const related = await db.query.products.findMany({
      where: and(...conditions),
      with: { images: true },
      limit: limit + 1,
    });
    return related.filter((p) => p.id !== productId).slice(0, limit);
  },
};
