import { Router } from 'express';
import type { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../config/db.js';
import { categories } from '../db/schema/index.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';

const categorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

const router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const cats = await db.query.categories.findMany({
    where: eq(categories.isActive, true),
    orderBy: (c, { asc }) => asc(c.sortOrder),
  });
  res.json({ success: true, data: cats });
}));

router.post('/', authenticate, requireAdmin, validate(categorySchema), asyncHandler(async (req: Request, res: Response) => {
  const [cat] = await db.insert(categories).values(req.body).returning();
  res.status(201).json({ success: true, data: cat });
}));

router.patch('/:id', authenticate, requireAdmin, validate(categorySchema.partial()), asyncHandler(async (req: Request, res: Response) => {
  const [cat] = await db.update(categories).set(req.body).where(eq(categories.id, req.params.id)).returning();
  res.json({ success: true, data: cat });
}));

router.delete('/:id', authenticate, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  await db.update(categories).set({ isActive: false }).where(eq(categories.id, req.params.id));
  res.json({ success: true, message: 'Category deleted' });
}));

export default router;
