import { Router } from 'express';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(2000),
});

router.post('/', authLimiter, asyncHandler(async (req: Request, res: Response) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Invalid form data', errors: parsed.error.flatten() });
    return;
  }

  const { name, email, subject, message } = parsed.data;

  // Log to console so admin can see submissions (email integration added when Resend is configured)
  console.info('[Contact Form]', { name, email, subject, message: message.slice(0, 80) });

  // TODO: when RESEND_API_KEY is set, send email via Resend
  // import { Resend } from 'resend';
  // const resend = new Resend(env.RESEND_API_KEY);
  // await resend.emails.send({ from: env.EMAIL_FROM, to: 'hello@armygurlwreaths.com', ... });

  res.json({ success: true, message: 'Message received. We will respond within 24 hours.' });
}));

export default router;
