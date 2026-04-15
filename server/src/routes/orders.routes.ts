import { Router } from 'express';
import { z } from 'zod';
import { ordersController } from '../controllers/orders.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';

const adminUpdateOrderSchema = z.object({
  status: z.enum(['pending', 'payment_processing', 'paid', 'in_production', 'shipped', 'delivered', 'cancelled', 'refunded']),
  trackingNumber: z.string().max(200).optional(),
  carrier: z.string().max(100).optional(),
});

const router = Router();

router.get('/', authenticate, asyncHandler(ordersController.getMyOrders));
router.get('/:id', authenticate, asyncHandler(ordersController.getOrder));

router.get('/admin/all', authenticate, requireAdmin, asyncHandler(ordersController.adminGetOrders));
router.patch('/admin/:id', authenticate, requireAdmin, validate(adminUpdateOrderSchema), asyncHandler(ordersController.adminUpdateOrder));

export default router;
