import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';

export const announcements = pgTable('announcements', {
  id: uuid('id').primaryKey().defaultRandom(),
  message: text('message').notNull(),
  linkText: text('link_text'),
  linkUrl: text('link_url'),
  bgColor: text('bg_color').default('#8b7f50'),
  textColor: text('text_color').default('#fdfcf7'),
  isActive: boolean('is_active').default(true).notNull(),
  startsAt: timestamp('starts_at'),
  endsAt: timestamp('ends_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type AnnouncementSelect = typeof announcements.$inferSelect;
