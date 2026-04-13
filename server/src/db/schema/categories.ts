import { pgTable, text, timestamp, uuid, integer, boolean } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').unique().notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  sortOrder: integer('sort_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type CategorySelect = typeof categories.$inferSelect;
export type CategoryInsert = typeof categories.$inferInsert;
