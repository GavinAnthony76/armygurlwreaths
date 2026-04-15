import { Router } from 'express';
import { z } from 'zod';
import { checkoutController } from '../controllers/checkout.controller.js';
import { authenticate } from '../middleware/auth.js';
import { checkoutLimiter } from '../middleware/rateLimiter.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { shippingAddressSchema } from '@armygurl/shared';

const cartItemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().nullable(),
  quantity: z.number().int().min(1).max(99),
  customNote: z.string().max(500).nullable(),
  productName: z.string(),
  productPrice: z.number().int(),
  variantPriceAdj: z.number().int(),
  variantName: z.string().nullable(),
  productImage: z.string().nullable(),
});

const intentSchema = z.object({
  shippingAddress: shippingAddressSchema,
  cartItems: z.array(cartItemSchema).optional(),
});

const demoSchema = z.object({
  shippingAddress: shippingAddressSchema,
  cartItems: z.array(cartItemSchema).optional(),
  notes: z.string().max(500).optional(),
});

const paypalCreateSchema = z.object({
  cartItems: z.array(cartItemSchema).optional(),
});

const paypalCaptureSchema = z.object({
  paypalOrderId: z.string().min(1),
  shippingAddress: shippingAddressSchema,
  notes: z.string().max(500).optional(),
});

const router = Router();

router.use(authenticate, checkoutLimiter);
router.post('/intent', validate(intentSchema), asyncHandler(checkoutController.createStripeIntent));
router.post('/demo', validate(demoSchema), asyncHandler(checkoutController.createDemoOrder));
router.post('/paypal/create', validate(paypalCreateSchema), asyncHandler(checkoutController.createPayPalOrder));
router.post('/paypal/capture', validate(paypalCaptureSchema), asyncHandler(checkoutController.capturePayPalOrder));

export default router;
