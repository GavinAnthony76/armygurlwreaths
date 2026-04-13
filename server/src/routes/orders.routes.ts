import { Router } from 'express';
import { ordersController } from '../controllers/orders.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', authenticate, asyncHandler(ordersController.getMyOrders));
router.get('/:id', authenticate, asyncHandler(ordersController.getOrder));

// Admin
router.get('/admin/all', authenticate, requireAdmin, asyncHandler(ordersController.adminGetOrders));
router.patch('/admin/:id', authenticate, requireAdmin, asyncHandler(ordersController.adminUpdateOrder));

export default router;
