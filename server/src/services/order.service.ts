import { eq, desc, and } from 'drizzle-orm';
import { db } from '../config/db.js';
import { orders } from '../db/schema/index.js';
import { NotFoundError, ForbiddenError } from '../utils/AppError.js';

export const orderService = {
  async getByUser(userId: string) {
    return db.query.orders.findMany({
      where: eq(orders.userId, userId),
      with: { items: true, shippingAddress: true },
      orderBy: desc(orders.createdAt),
    });
  },

  async getById(id: string, userId?: string) {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: { items: true, shippingAddress: true },
    });
    if (!order) throw new NotFoundError('Order');
    if (userId && order.userId !== userId) throw new ForbiddenError();
    return order;
  },

  async getAllAdmin(page = 1, pageSize = 20, status?: string) {
    const conditions = status ? [eq(orders.status, status as typeof orders.status._.data)] : [];
    return db.query.orders.findMany({
      where: conditions.length ? and(...conditions) : undefined,
      with: { items: true, shippingAddress: true, user: true },
      orderBy: desc(orders.createdAt),
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
  },

  async updateStatus(id: string, status: typeof orders.status._.data, trackingInfo?: { carrier?: string; trackingNumber?: string }) {
    const updates: Record<string, unknown> = { status, updatedAt: new Date() };
    if (trackingInfo?.carrier) updates.shippingCarrier = trackingInfo.carrier;
    if (trackingInfo?.trackingNumber) updates.trackingNumber = trackingInfo.trackingNumber;
    if (status === 'shipped') updates.shippedAt = new Date();
    if (status === 'delivered') updates.deliveredAt = new Date();

    const [updated] = await db.update(orders).set(updates).where(eq(orders.id, id)).returning();
    if (!updated) throw new NotFoundError('Order');
    return updated;
  },
};
