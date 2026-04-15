import { Router } from 'express';
import type { Request, Response } from 'express';
import { put, del } from '@vercel/blob';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';
import { ValidationError } from '../utils/AppError.js';

const router = Router();

router.post('/upload', authenticate, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { filename, contentType, fileData } = req.body as { filename?: string; contentType?: string; fileData?: string };

  if (!filename || !contentType || !fileData) {
    throw new ValidationError('filename, contentType, and fileData are required');
  }

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
