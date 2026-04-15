import { eq, and } from 'drizzle-orm';
import { db } from '../config/db.js';
import { carts, cartItems, products, productVariants } from '../db/schema/index.js';
import { NotFoundError, ValidationError } from '../utils/AppError.js';
import type { AddToCartInput } from '@armygurl/shared';

export const cartService = {
  async getOrCreateCart(userId: string) {
    let cart = await db.query.carts.findFirst({
      where: eq(carts.userId, userId),
      with: {
        items: {
          with: {
            product: { with: { images: true } },
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      const [newCart] = await db.insert(carts).values({ userId }).returning();
      cart = { ...newCart, items: [] };
    }
    return cart;
  },

  async addItem(userId: string, input: AddToCartInput) {
    const product = await db.query.products.findFirst({
      where: eq(products.id, input.productId),
    });
    if (!product || !product.isActive) throw new NotFoundError('Product');

    let availableStock = product.stockQty;

    if (input.variantId) {
      const variant = await db.query.productVariants.findFirst({
        where: and(eq(productVariants.id, input.variantId), eq(productVariants.productId, input.productId)),
      });
      if (!variant) throw new NotFoundError('Product variant');
      availableStock = variant.stockQty;
    }

    if (availableStock < input.quantity) {
      throw new ValidationError(`Only ${availableStock} items available in stock`);
    }

    const cart = await this.getOrCreateCart(userId);

    const existing = cart.items.find(
      (item) => item.productId === input.productId && item.variantId === (input.variantId ?? null)
    );

    if (existing) {
      const newQty = existing.quantity + input.quantity;
      if (newQty > availableStock) {
        throw new ValidationError(`Cannot add more — only ${availableStock} available`);
      }
      const [updated] = await db.update(cartItems)
        .set({ quantity: newQty })
        .where(eq(cartItems.id, existing.id))
        .returning();
      return updated;
    }

    const [item] = await db.insert(cartItems).values({
      cartId: cart.id,
      productId: input.productId,
      variantId: input.variantId,
      quantity: input.quantity,
      customNote: input.customNote,
    }).returning();
    return item;
  },

  async updateItem(userId: string, itemId: string, quantity: number) {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) throw new NotFoundError('Cart item');

    if (quantity <= 0) {
      await db.delete(cartItems).where(eq(cartItems.id, itemId));
      return null;
    }

    const [updated] = await db.update(cartItems)
      .set({ quantity })
      .where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cart.id)))
      .returning();
    return updated;
  },

  async removeItem(userId: string, itemId: string) {
    const cart = await this.getOrCreateCart(userId);
    await db.delete(cartItems).where(
      and(eq(cartItems.id, itemId), eq(cartItems.cartId, cart.id))
    );
  },

  async clearCart(userId: string) {
    const cart = await db.query.carts.findFirst({ where: eq(carts.userId, userId) });
    if (cart) {
      await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));
    }
  },
};
