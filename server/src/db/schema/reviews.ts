import { pgTable, text, timestamp, uuid, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.js';
import { products } from './products.js';
import { orders } from './orders.js';

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id),
  orderId: uuid('order_id').references(() => orders.id),
  rating: integer('rating').notNull(),
  title: text('title'),
  body: text('body'),
  isApproved: boolean('is_approved').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, { fields: [reviews.productId], references: [products.id] }),
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
}));

export type ReviewSelect = typeof reviews.$inferSelect;
export type ReviewInsert = typeof reviews.$inferInsert;
