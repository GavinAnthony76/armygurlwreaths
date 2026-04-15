import { Router } from 'express';
import authRoutes from './auth.routes.js';
import productsRoutes from './products.routes.js';
import categoriesRoutes from './categories.routes.js';
import cartRoutes from './cart.routes.js';
import checkoutRoutes from './checkout.routes.js';
import ordersRoutes from './orders.routes.js';
import announcementsRoutes from './announcements.routes.js';
import mediaRoutes from './media.routes.js';
import contactRoutes from './contact.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/cart', cartRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/orders', ordersRoutes);
router.use('/announcements', announcementsRoutes);
router.use('/media', mediaRoutes);
router.use('/contact', contactRoutes);

export default router;
