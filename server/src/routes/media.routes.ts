import { Router } from 'express';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { put, del } from '@vercel/blob';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { env } from '../config/env.js';
import { ValidationError } from '../utils/AppError.js';

const uploadSchema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.string().min(1).max(100),
  fileData: z.string().min(1),
});

const router = Router();

router.post('/upload', authenticate, requireAdmin, validate(uploadSchema), asyncHandler(async (req: Request, res: Response) => {
  const { filename, contentType, fileData } = req.body as z.infer<typeof uploadSchema>;

  if (!env.BLOB_READ_WRITE_TOKEN) {
    throw new ValidationError('Blob storage is not configured');
  }

  const buffer = Buffer.from(fileData, 'base64');
  if (buffer.length === 0) {
    throw new ValidationError('fileData cannot be empty');
  }
  if (buffer.length > 10 * 1024 * 1024) {
    throw new ValidationError('File size must be under 10MB');
  }
  const blob = await put(filename, buffer, {
    access: 'public',
    token: env.BLOB_READ_WRITE_TOKEN,
    contentType,
  });
  res.json({ success: true, data: { url: blob.url } });
}));

router.delete('/:url', authenticate, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  if (!env.BLOB_READ_WRITE_TOKEN) {
    throw new ValidationError('Blob storage is not configured');
  }
  await del(decodeURIComponent(req.params.url), { token: env.BLOB_READ_WRITE_TOKEN });
  res.json({ success: true });
}));

export default router;
