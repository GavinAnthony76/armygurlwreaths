import { z } from 'zod';

const seasons = ['spring', 'summer', 'fall', 'winter', 'year-round'] as const;

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
  // Use coerce so string query params ("1", "30000") are cast to numbers automatically
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  // Boolean query params arrive as "true"/"false" strings
  isFeatured: z.union([
    z.boolean(),
    z.string().transform((v) => v === 'true'),
  ]).optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
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

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductFiltersInput = z.infer<typeof productFiltersSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
