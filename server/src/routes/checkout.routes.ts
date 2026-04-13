import { Router } from 'express';
import { checkoutController } from '../controllers/checkout.controller.js';
import { authenticate } from '../middleware/auth.js';
import { checkoutLimiter } from '../middleware/rateLimiter.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(authenticate, checkoutLimiter);
router.post('/intent', asyncHandler(checkoutController.createStripeIntent));
router.post('/demo', asyncHandler(checkoutController.createDemoOrder));
router.post('/paypal/create', asyncHandler(checkoutController.createPayPalOrder));
router.post('/paypal/capture', asyncHandler(checkoutController.capturePayPalOrder));

export default router;
