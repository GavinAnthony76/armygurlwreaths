import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.js';
import { products } from './products.js';
import { productVariants } from './products.js';

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNumber: text('order_number').unique().notNull(),
  userId: uuid('user_id').references(() => users.id),
  email: text('email').notNull(),
  status: text('status', {
    enum: ['pending', 'payment_processing', 'paid', 'in_production', 'shipped', 'delivered', 'cancelled', 'refunded'],
  }).default('pending').notNull(),
  paymentProvider: text('payment_provider', { enum: ['stripe', 'paypal'] }).notNull(),
  paymentIntentId: text('payment_intent_id').unique(),
  stripeCustomerId: text('stripe_customer_id'),
  subtotal: integer('subtotal').notNull(),
  shippingCost: integer('shipping_cost').default(0).notNull(),
  taxAmount: integer('tax_amount').default(0).notNull(),
  discountAmount: integer('discount_amount').default(0).notNull(),
  total: integer('total').notNull(),
  currency: text('currency').default('usd').notNull(),
  notes: text('notes'),
  shippingCarrier: text('shipping_carrier'),
  trackingNumber: text('tracking_number'),
  shippedAt: timestamp('shipped_at'),
  deliveredAt: timestamp('delivered_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').references(() => products.id),
  variantId: uuid('variant_id').references(() => productVariants.id),
  productName: text('product_name').notNull(),
  variantName: text('variant_name'),
  price: integer('price').notNull(),
  quantity: integer('quantity').notNull(),
  customNote: text('custom_note'),
});

export const shippingAddresses = pgTable('shipping_addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  address1: text('address1').notNull(),
  address2: text('address2'),
  city: text('city').notNull(),
  state: text('state').notNull(),
  postalCode: text('postal_code').notNull(),
  country: text('country').default('US').notNull(),
  phone: text('phone'),
  isDefault: text('is_default').default('false'),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
  shippingAddress: one(shippingAddresses, { fields: [orders.id], references: [shippingAddresses.orderId] }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));

export type OrderSelect = typeof orders.$inferSelect;
export type OrderInsert = typeof orders.$inferInsert;
export type OrderItemSelect = typeof orderItems.$inferSelect;
export type ShippingAddressSelect = typeof shippingAddresses.$inferSelect;
