import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { registerSchema, loginSchema, updateProfileSchema } from '@armygurl/shared';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), asyncHandler(authController.register));
router.post('/login', authLimiter, validate(loginSchema), asyncHandler(authController.login));
router.post('/logout', authenticate, asyncHandler(authController.logout));
router.post('/refresh', asyncHandler(authController.refresh));
router.get('/me', authenticate, asyncHandler(authController.me));
router.patch('/me', authenticate, validate(updateProfileSchema), asyncHandler(authController.updateMe));

export default router;
