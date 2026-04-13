import type { Request, Response } from 'express';
import { checkoutService } from '../services/checkout.service.js';

export const checkoutController = {
  async createStripeIntent(req: Request, res: Response) {
    const { shippingAddress } = req.body;
    const result = await checkoutService.createStripeIntent(req.user!.sub, shippingAddress);
    res.json({ success: true, data: result });
  },

  async createPayPalOrder(req: Request, res: Response) {
    const result = await checkoutService.createPayPalOrder(req.user!.sub);
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
    const { shippingAddress, notes } = req.body;
    const order = await checkoutService.createDemoOrder(req.user!.sub, shippingAddress, notes);
    res.status(201).json({ success: true, data: order });
  },
};
