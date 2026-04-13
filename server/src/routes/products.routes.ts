import { Router } from 'express';
import { productsController } from '../controllers/products.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createProductSchema, updateProductSchema, productFiltersSchema } from '@armygurl/shared';

const router = Router();

router.get('/', validate(productFiltersSchema, 'query'), asyncHandler(productsController.list));
router.get('/featured', asyncHandler(productsController.featured));
router.get('/:slug', asyncHandler(productsController.getBySlug));
router.get('/:id/related', asyncHandler(productsController.related));

// Admin routes
router.post('/', authenticate, requireAdmin, validate(createProductSchema), asyncHandler(productsController.create));
router.patch('/:id', authenticate, requireAdmin, validate(updateProductSchema), asyncHandler(productsController.update));
router.delete('/:id', authenticate, requireAdmin, asyncHandler(productsController.delete));
router.post('/:id/images', authenticate, requireAdmin, asyncHandler(productsController.addImage));
router.delete('/:id/images/:imageId', authenticate, requireAdmin, asyncHandler(productsController.deleteImage));
router.patch('/:id/inventory', authenticate, requireAdmin, asyncHandler(productsController.adjustInventory));

export default router;
