import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  role: text('role', { enum: ['customer', 'admin'] }).notNull().default('customer'),
  phone: text('phone'),
  stripeCustomerId: text('stripe_customer_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type UserSelect = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
