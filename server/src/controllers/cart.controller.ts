import type { Request, Response } from 'express';
import { cartService } from '../services/cart.service.js';

export const cartController = {
  async getCart(req: Request, res: Response) {
    const cart = await cartService.getOrCreateCart(req.user!.sub);
    res.json({ success: true, data: cart });
  },

  async addItem(req: Request, res: Response) {
    const item = await cartService.addItem(req.user!.sub, req.body);
    res.status(201).json({ success: true, data: item });
  },

  async updateItem(req: Request, res: Response) {
    const item = await cartService.updateItem(req.user!.sub, req.params.id, req.body.quantity);
    res.json({ success: true, data: item });
  },

  async removeItem(req: Request, res: Response) {
    await cartService.removeItem(req.user!.sub, req.params.id);
    res.json({ success: true, message: 'Item removed' });
  },

  async clearCart(req: Request, res: Response) {
    await cartService.clearCart(req.user!.sub);
    res.json({ success: true, message: 'Cart cleared' });
  },
};
