import type { Request, Response } from 'express';
import { orderService } from '../services/order.service.js';

export const ordersController = {
  async getMyOrders(req: Request, res: Response) {
    const orders = await orderService.getByUser(req.user!.sub);
    res.json({ success: true, data: orders });
  },

  async getOrder(req: Request, res: Response) {
    const id = req.params.id;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const order = isUuid
      ? await orderService.getById(id, req.user!.sub)
      : await orderService.getByOrderNumber(id, req.user!.sub);
    res.json({ success: true, data: order });
  },

  async adminGetOrders(req: Request, res: Response) {
    const { page, pageSize, status } = req.query as Record<string, string>;
    const orders = await orderService.getAllAdmin(
      Number(page) || 1,
      Number(pageSize) || 20,
      status
    );
    res.json({ success: true, data: orders });
  },

  async adminUpdateOrder(req: Request, res: Response) {
    const { status, carrier, trackingNumber } = req.body;
    const order = await orderService.updateStatus(req.params.id, status, {
      carrier,
      trackingNumber,
    });
    res.json({ success: true, data: order });
  },
};
