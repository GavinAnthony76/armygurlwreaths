import { z } from 'zod';
const seasons = ['spring', 'summer', 'fall', 'winter', 'year-round'];
export const createProductSchema = z.object({
    name: z.string().min(1, 'Product name is required').max(200),
    description: z.string().min(1, 'Description is required'),
    price: z.number().int().positive('Price must be a positive integer (cents)'),
    compareAtPrice: z.number().int().positive().optional(),
    sku: z.string().max(100).optional(),
    stockQty: z.number().int().min(0).default(0),
    lowStockThreshold: z.number().int().min(0).default(3),
    categoryId: z.string().uuid().optional(),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    isCustomizable: z.boolean().default(false),
    tags: z.array(z.string().max(50)).default([]),
    season: z.enum(seasons).optional(),
    metaTitle: z.string().max(70).optional(),
    metaDescription: z.string().max(160).optional(),
});
export const updateProductSchema = createProductSchema.partial();
export const productFiltersSchema = z.object({
    category: z.string().optional(),
    season: z.enum(seasons).optional(),
    tags: z.array(z.string()).optional(),
    minPrice: z.number().int().min(0).optional(),
    maxPrice: z.number().int().min(0).optional(),
    isFeatured: z.boolean().optional(),
    search: z.string().max(100).optional(),
    page: z.number().int().min(1).default(1),
    pageSize: z.number().int().min(1).max(100).default(20),
    sortBy: z.enum(['price_asc', 'price_desc', 'newest', 'name']).default('newest'),
});
export const createCategorySchema = z.object({
    name: z.string().min(1).max(100),
    slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens'),
    description: z.string().max(500).optional(),
    imageUrl: z.string().url().optional(),
    sortOrder: z.number().int().min(0).default(0),
    isActive: z.boolean().default(true),
});
