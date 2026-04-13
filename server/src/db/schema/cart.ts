import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.js';
import { products, productVariants } from './products.js';

export const carts = pgTable('carts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  sessionId: text('session_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const cartItems = pgTable('cart_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  cartId: uuid('cart_id').notNull().references(() => carts.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').notNull().references(() => products.id),
  variantId: uuid('variant_id').references(() => productVariants.id),
  quantity: integer('quantity').default(1).notNull(),
  customNote: text('custom_note'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, { fields: [carts.userId], references: [users.id] }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
  product: one(products, { fields: [cartItems.productId], references: [products.id] }),
  variant: one(productVariants, { fields: [cartItems.variantId], references: [productVariants.id] }),
}));

export type CartSelect = typeof carts.$inferSelect;
export type CartItemSelect = typeof cartItems.$inferSelect;
