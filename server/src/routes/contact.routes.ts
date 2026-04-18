import { Router } from 'express';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { env } from '../config/env.js';

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

  console.info('[Contact Form]', { name, email, subject, message: message.slice(0, 80) });

  let emailSent = false;
  if (env.RESEND_API_KEY) {
    const { Resend } = await import('resend');
    const resend = new Resend(env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: `${env.EMAIL_FROM_NAME} <${env.EMAIL_FROM}>`,
      to: 'hello@armygurlwreaths.com',
      reply_to: email,
      subject: `[Contact Form] ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
    });
    emailSent = !result.error;
    if (result.error) {
      console.error('[Contact Form] Email delivery failed:', result.error);
    }
  }

  if (!emailSent && env.RESEND_API_KEY) {
    res.status(502).json({ success: false, message: 'Your message was received but email delivery failed. We will follow up shortly.' });
    return;
  }

  res.json({ success: true, message: 'Message received. We will respond within 24 hours.' });
}));

export default router;
