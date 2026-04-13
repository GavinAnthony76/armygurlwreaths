export type ProductSeason = 'spring' | 'summer' | 'fall' | 'winter' | 'year-round';

export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  priceAdjustment: number;
  stockQty: number;
  sku: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  categoryId: string | null;
  category: Category | null;
  name: string;
  slug: string;
  description: string;
  price: number;           // cents
  compareAtPrice: number | null;  // cents
  sku: string | null;
  stockQty: number;
  lowStockThreshold: number;
  isActive: boolean;
  isFeatured: boolean;
  isCustomizable: boolean;
  tags: string[];
  season: ProductSeason | null;
  images: ProductImage[];
  variants: ProductVariant[];
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductFilters {
  category?: string;
  season?: ProductSeason;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'name';
}
