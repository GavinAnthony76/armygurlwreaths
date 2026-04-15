import { eq, sql } from 'drizzle-orm';
import { db } from '../config/db.js';
import { stripe } from '../config/stripe.js';
import { env } from '../config/env.js';
import { orders, orderItems, shippingAddresses, products, users } from '../db/schema/index.js';
import { cartService } from './cart.service.js';
import { generateOrderNumber } from '../utils/slug.js';
import { ValidationError } from '../utils/AppError.js';
import type { ShippingAddressInput } from '@armygurl/shared';

// Client cart item shape sent from the browser's Zustand store
interface ClientCartItem {
  productId: string;
  variantId: string | null;
  quantity: number;
  customNote: string | null;
  productName: string;
  productPrice: number;
  variantPriceAdj: number;
  variantName: string | null;
  productImage: string | null;
}

export const checkoutService = {
  // Sync client-side cart items into the server cart so fulfillOrder can read them
  async syncClientCart(userId: string, clientItems: ClientCartItem[]) {
    if (!clientItems.length) return;
    await cartService.clearCart(userId);
    for (const item of clientItems) {
      await cartService.addItem(userId, {
        productId: item.productId,
        variantId: item.variantId ?? undefined,
        quantity: item.quantity,
        customNote: item.customNote ?? undefined,
      }).catch(() => {
        // Skip items that fail (e.g. out of stock) — fulfillOrder will validate
      });
    }
  },

  async createStripeIntent(userId: string, shippingAddress: ShippingAddressInput, clientItems?: ClientCartItem[]) {
    if (clientItems?.length) await this.syncClientCart(userId, clientItems);

    const cart = await cartService.getOrCreateCart(userId);
    if (!cart.items.length) throw new ValidationError('Cart is empty');

    const subtotal = cart.items.reduce((sum, item) => {
      const basePrice = item.product.price;
      const variantAdj = item.variant?.priceAdjustment ?? 0;
      return sum + (basePrice + variantAdj) * item.quantity;
    }, 0);

    const shippingCost = subtotal >= 7500 ? 0 : 895;
    const total = subtotal + shippingCost;

    // Demo mode — Stripe keys not configured
    if (!stripe) {
      return {
        clientSecret: null,
        paymentIntentId: null,
        demoMode: true,
        subtotal,
        shippingCost,
        total,
      };
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { userId, cartId: cart.id },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      demoMode: false,
      subtotal,
      shippingCost,
      total,
    };
  },

  async createDemoOrder(userId: string, shippingAddress: ShippingAddressInput, clientItems?: ClientCartItem[], notes?: string) {
    if (clientItems?.length) await this.syncClientCart(userId, clientItems);
    const demoIntentId = `demo_${Date.now()}`;
    return this.fulfillOrder(userId, demoIntentId, 'stripe', shippingAddress, notes);
  },

  async createPayPalOrder(userId: string, clientItems?: ClientCartItem[]) {
    if (clientItems?.length) await this.syncClientCart(userId, clientItems);
    const cart = await cartService.getOrCreateCart(userId);
    if (!cart.items.length) throw new ValidationError('Cart is empty');

    const subtotal = cart.items.reduce((sum, item) => {
      const basePrice = item.product.price;
      const variantAdj = item.variant?.priceAdjustment ?? 0;
      return sum + (basePrice + variantAdj) * item.quantity;
    }, 0);

    const shippingCost = subtotal >= 7500 ? 0 : 895;
    const total = subtotal + shippingCost;

    // PayPal API call
    const accessToken = await getPayPalAccessToken();
    const baseUrl = env.PAYPAL_MODE === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: (total / 100).toFixed(2),
            breakdown: {
              item_total: { currency_code: 'USD', value: (subtotal / 100).toFixed(2) },
              shipping: { currency_code: 'USD', value: (shippingCost / 100).toFixed(2) },
            },
          },
          custom_id: userId,
        }],
      }),
    });

    const order = await response.json() as { id: string };
    return { orderId: order.id, subtotal, shippingCost, total };
  },

  async capturePayPalOrder(paypalOrderId: string, userId: string, shippingAddress: ShippingAddressInput, notes?: string) {
    const accessToken = await getPayPalAccessToken();
    const baseUrl = env.PAYPAL_MODE === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    const response = await fetch(`${baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const captured = await response.json() as { status: string; id: string };
    if (captured.status !== 'COMPLETED') {
      throw new ValidationError('PayPal payment capture failed');
    }

    return this.fulfillOrder(userId, paypalOrderId, 'paypal', shippingAddress, notes);
  },

  async fulfillOrder(
    userId: string,
    paymentIntentId: string,
    paymentProvider: 'stripe' | 'paypal',
    shippingAddress: ShippingAddressInput,
    notes?: string
  ) {
    const cart = await cartService.getOrCreateCart(userId);
    if (!cart.items.length) throw new ValidationError('Cart is empty');

    const userRecord = await db.query.users.findFirst({ where: eq(users.id, userId) });
    const userEmail = userRecord?.email ?? '';

    const subtotal = cart.items.reduce((sum, item) => {
      const basePrice = item.product.price;
      const variantAdj = item.variant?.priceAdjustment ?? 0;
      return sum + (basePrice + variantAdj) * item.quantity;
    }, 0);

    const shippingCost = subtotal >= 7500 ? 0 : 895;
    const total = subtotal + shippingCost;
    const orderNumber = generateOrderNumber();

    const [order] = await db.insert(orders).values({
      orderNumber,
      userId,
      email: userEmail,
      status: 'paid',
      paymentProvider,
      paymentIntentId,
      subtotal,
      shippingCost,
      taxAmount: 0,
      total,
      notes,
    }).returning();

    await db.insert(shippingAddresses).values({ orderId: order.id, userId, ...shippingAddress });

    await db.insert(orderItems).values(
      cart.items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        variantId: item.variantId,
        productName: item.product.name,
        variantName: item.variant ? `${item.variant.name}: ${item.variant.value}` : null,
        price: item.product.price + (item.variant?.priceAdjustment ?? 0),
        quantity: item.quantity,
        customNote: item.customNote,
      }))
    );

    // Decrement inventory (floor at 0)
    for (const item of cart.items) {
      await db.update(products)
        .set({
          stockQty: sql`GREATEST(0, ${products.stockQty} - ${item.quantity})`,
          updatedAt: new Date(),
        })
        .where(eq(products.id, item.productId));
    }

    await cartService.clearCart(userId);
    return order;
  },
};

async function getPayPalAccessToken(): Promise<string> {
  const baseUrl = env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

  const credentials = Buffer.from(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json() as { access_token: string };
  return data.access_token;
}
