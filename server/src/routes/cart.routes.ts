import { Router } from 'express';
import { cartController } from '../controllers/cart.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { addToCartSchema, updateCartItemSchema } from '@armygurl/shared';

const router = Router();

router.use(authenticate);
router.get('/', asyncHandler(cartController.getCart));
router.post('/items', validate(addToCartSchema), asyncHandler(cartController.addItem));
router.patch('/items/:id', validate(updateCartItemSchema), asyncHandler(cartController.updateItem));
router.delete('/items/:id', asyncHandler(cartController.removeItem));
router.delete('/', asyncHandler(cartController.clearCart));

export default router;
