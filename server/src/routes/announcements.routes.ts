import { Router } from 'express';
import type { Request, Response } from 'express';
import { and, eq, or, isNull, lte, gte } from 'drizzle-orm';
import { db } from '../config/db.js';
import { announcements } from '../db/schema/index.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/active', async (_req: Request, res: Response) => {
  try {
    const now = new Date();
    const active = await db.query.announcements.findMany({
      where: and(
        eq(announcements.isActive, true),
        or(isNull(announcements.startsAt), lte(announcements.startsAt, now)),
        or(isNull(announcements.endsAt), gte(announcements.endsAt, now))
      ),
    });
    res.json({ success: true, data: active });
  } catch (err) {
    console.error('[announcements.active]', err);
    res.json({ success: true, data: [] });
  }
});

router.get('/', authenticate, requireAdmin, asyncHandler(async (_req: Request, res: Response) => {
  const all = await db.query.announcements.findMany();
  res.json({ success: true, data: all });
}));

router.post('/', authenticate, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const [ann] = await db.insert(announcements).values(req.body).returning();
  res.status(201).json({ success: true, data: ann });
}));

router.patch('/:id', authenticate, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const [ann] = await db.update(announcements).set(req.body).where(eq(announcements.id, req.params.id)).returning();
  res.json({ success: true, data: ann });
}));

router.delete('/:id', authenticate, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  await db.delete(announcements).where(eq(announcements.id, req.params.id));
  res.json({ success: true });
}));

export default router;
