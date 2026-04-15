import type { Request, Response } from 'express';
import { checkoutService } from '../services/checkout.service.js';

export const checkoutController = {
  async createStripeIntent(req: Request, res: Response) {
    const { shippingAddress, cartItems } = req.body;
    const result = await checkoutService.createStripeIntent(req.user!.sub, shippingAddress, cartItems);
    res.json({ success: true, data: result });
  },

  async createPayPalOrder(req: Request, res: Response) {
    const { cartItems } = req.body;
    const result = await checkoutService.createPayPalOrder(req.user!.sub, cartItems);
    res.json({ success: true, data: result });
  },

  async capturePayPalOrder(req: Request, res: Response) {
    const { paypalOrderId, shippingAddress, notes } = req.body;
    const order = await checkoutService.capturePayPalOrder(
      paypalOrderId,
      req.user!.sub,
      shippingAddress,
      notes
    );
    res.json({ success: true, data: order });
  },

  async createDemoOrder(req: Request, res: Response) {
    const { shippingAddress, cartItems, notes } = req.body;
    const order = await checkoutService.createDemoOrder(req.user!.sub, shippingAddress, cartItems, notes);
    res.status(201).json({ success: true, data: order });
  },
};
