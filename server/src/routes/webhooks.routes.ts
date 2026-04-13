import { Router } from 'express';
import type { Request, Response } from 'express';
import { stripe } from '../config/stripe.js';
import { env } from '../config/env.js';
import { db } from '../config/db.js';
import { orders } from '../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// IMPORTANT: Stripe webhooks require raw body — do NOT apply JSON middleware here
router.post(
  '/stripe',
  asyncHandler(async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    if (!sig) {
      res.status(400).json({ error: 'Missing stripe-signature header' });
      return;
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      res.status(400).json({ error: `Webhook signature verification failed: ${(err as Error).message}` });
      return;
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object;
        await db.update(orders)
          .set({ status: 'paid', updatedAt: new Date() })
          .where(eq(orders.paymentIntentId, pi.id));
        break;
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object;
        await db.update(orders)
          .set({ status: 'cancelled', updatedAt: new Date() })
          .where(eq(orders.paymentIntentId, pi.id));
        break;
      }
      default:
        // Unhandled event type — acknowledge and ignore
        break;
    }

    res.json({ received: true });
  })
);

export default router;
