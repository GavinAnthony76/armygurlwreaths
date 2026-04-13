import { Router } from 'express';
import type { Request, Response } from 'express';
import { put, del } from '@vercel/blob';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';

const router = Router();

router.post('/upload', authenticate, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { filename, contentType } = req.body as { filename: string; contentType: string };
  const blob = await put(filename, req.body.file, {
    access: 'public',
    token: env.BLOB_READ_WRITE_TOKEN,
    contentType,
  });
  res.json({ success: true, data: { url: blob.url } });
}));

router.delete('/:url', authenticate, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  await del(decodeURIComponent(req.params.url), { token: env.BLOB_READ_WRITE_TOKEN });
  res.json({ success: true });
}));

export default router;
