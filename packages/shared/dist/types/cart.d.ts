import type { Product, ProductVariant } from './product.js';
export interface CartItem {
    id: string;
    productId: string;
    variantId: string | null;
    quantity: number;
    customNote: string | null;
    product: Pick<Product, 'id' | 'name' | 'slug' | 'price' | 'images' | 'stockQty'>;
    variant: Pick<ProductVariant, 'id' | 'name' | 'value' | 'priceAdjustment'> | null;
}
export interface Cart {
    id: string;
    items: CartItem[];
    itemCount: number;
    subtotal: number;
}
export interface AddToCartInput {
    productId: string;
    variantId?: string;
    quantity: number;
    customNote?: string;
}
export interface UpdateCartItemInput {
    quantity: number;
}
