import { z } from 'zod';

export const shippingAddressSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  address1: z.string().min(1, 'Address is required').max(200),
  address2: z.string().max(200).optional(),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(50),
  postalCode: z.string().min(5, 'Postal code is required').max(10),
  country: z.string().length(2).default('US'),
  phone: z.string().optional(),
});

export const createCheckoutSchema = z.object({
  shippingAddress: shippingAddressSchema,
  notes: z.string().max(500).optional(),
  paymentProvider: z.enum(['stripe', 'paypal']),
});

export const addToCartSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  quantity: z.number().int().min(1).max(99),
  customNote: z.string().max(500).optional(),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(99),
});

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
